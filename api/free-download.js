
export default async function handler(req, res) {
  try {
    const token = String(req.query?.t || '').trim();
    if (!token) return res.status(400).send('Missing token');

    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      FREE_PDF_ATTACHMENT_PATH,
      FREE_PDF_ATTACHMENT_FILENAME,
      FREE_PDF_URL
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

    const staticPdfUrl = FREE_PDF_URL || '/free/openclaw-quick-fix-guide.pdf';

    // Validate static URL is reachable from this deployment (best effort)
    let canRedirect = true;
    try {
      const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
      const probeUrl = staticPdfUrl.startsWith('http') ? staticPdfUrl : `${base}${staticPdfUrl}`;
      const probe = await fetch(probeUrl, { method: 'HEAD' });
      canRedirect = probe.ok;
    } catch (_) {
      canRedirect = true; // allow redirect even if probe failed due to networking quirks
    }

    if (!canRedirect) {
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

    return res.redirect(302, staticPdfUrl);
  } catch (e) {
    res.status(500).send('Download failed');
  }
}
