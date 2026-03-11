import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function handler(req, res) {
  try {
    const token = String(req.query?.t || '').trim();
    if (!token) return res.status(400).send('Missing token');

    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      FREE_PDF_ATTACHMENT_FILENAME
    } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).send('Server misconfigured');
    }

    const lookup = await fetch(
      `${SUPABASE_URL}/rest/v1/pdf_access_tokens?select=id,expires_at,used_at&token=eq.${encodeURIComponent(token)}&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!lookup.ok) {
      const t = await lookup.text();
      console.error('Token lookup failed:', t);
      return res.status(500).send('Token lookup failed');
    }
    const rows = await lookup.json();
    if (!Array.isArray(rows) || rows.length === 0) return res.status(404).send('Invalid token');

    const row = rows[0];
    if (row.used_at) return res.status(410).send('Link already used');
    if (new Date(row.expires_at).getTime() < Date.now()) return res.status(410).send('Link expired');

    const candidates = [
      'protected-assets/free/openclaw-quick-fix-guide.pdf',
      'free-guide/openclaw-quick-fix-guide.pdf'
    ];

    let fileBuffer = null;
    let chosenPath = null;

    for (const relPath of candidates) {
      try {
        const abs = resolve(process.cwd(), relPath);
        fileBuffer = await readFile(abs);
        chosenPath = abs;
        break;
      } catch (_) {
        // try next path
      }
    }

    if (!fileBuffer) {
      console.error('PDF file missing on server; tried:', candidates, 'cwd:', process.cwd());
      return res.status(500).send('PDF file missing on server');
    }

    await fetch(`${SUPABASE_URL}/rest/v1/pdf_access_tokens?id=eq.${row.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ used_at: new Date().toISOString() })
    });

    console.log('Serving protected PDF from:', chosenPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${FREE_PDF_ATTACHMENT_FILENAME || 'openclaw-quick-fix-guide.pdf'}"`);
    return res.status(200).send(fileBuffer);
  } catch (e) {
    res.status(500).send('Download failed');
  }
}
