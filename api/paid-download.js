import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function handler(req, res) {
  try {
    const token = String(req.query?.t || '').trim();
    if (!token) return res.status(400).send('Missing token');

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    const lookup = await fetch(`${SUPABASE_URL}/rest/v1/paid_pdf_tokens?select=id,expires_at,used_at&token=eq.${encodeURIComponent(token)}&limit=1`, {
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
    });
    if (!lookup.ok) return res.status(500).send('Lookup failed');

    const rows = await lookup.json();
    if (!rows.length) return res.status(404).send('Invalid token');
    const row = rows[0];
    if (row.used_at) return res.status(410).send('Link already used');
    if (new Date(row.expires_at).getTime() < Date.now()) return res.status(410).send('Link expired');

    await fetch(`${SUPABASE_URL}/rest/v1/paid_pdf_tokens?id=eq.${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
      body: JSON.stringify({ used_at: new Date().toISOString() })
    });

    const file = await readFile(resolve(process.cwd(), 'protected-assets/paid/openclaw-operator-playbook.pdf'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="openclaw-operator-playbook.pdf"');
    return res.status(200).send(file);
  } catch {
    return res.status(500).send('Download failed');
  }
}
