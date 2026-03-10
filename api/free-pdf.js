import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ ok: false, error: 'Invalid email' });
      return;
    }

    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY,
      FREE_PDF_FROM_EMAIL,
      FREE_PDF_URL,
      FREE_PDF_DELIVERY_MODE,
      FREE_PDF_ATTACHMENT_PATH,
      FREE_PDF_ATTACHMENT_FILENAME
    } = process.env;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      res.status(500).json({ ok: false, error: 'Supabase server env vars missing' });
      return;
    }

    // Check if this lead/type already exists to avoid duplicate emails.
    const existingResp = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?select=id,email,lead_type&email=eq.${encodeURIComponent(cleanEmail)}&lead_type=eq.free_pdf&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!existingResp.ok) {
      const t = await existingResp.text();
      res.status(500).json({ ok: false, error: `Supabase read failed: ${t}` });
      return;
    }

    const existing = await existingResp.json();
    const alreadyExists = Array.isArray(existing) && existing.length > 0;

    if (!alreadyExists) {
      const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify([{ email: cleanEmail, lead_type: 'free_pdf', source_page: '/' }])
      });

      if (!insertResp.ok) {
        const t = await insertResp.text();
        res.status(500).json({ ok: false, error: `Supabase insert failed: ${t}` });
        return;
      }
    }

    if (!RESEND_API_KEY || !FREE_PDF_FROM_EMAIL) {
      res.status(200).json({ ok: true, emailed: false, note: 'Lead saved. Email provider not configured yet.' });
      return;
    }

    const deliveryMode = (FREE_PDF_DELIVERY_MODE || 'url').toLowerCase();
    const payload = {
      from: FREE_PDF_FROM_EMAIL,
      to: [cleanEmail],
      subject: 'Your OpenClaw Quick Fix Guide (Free PDF)'
    };

    if (deliveryMode === 'attachment') {
      const attachmentPath = FREE_PDF_ATTACHMENT_PATH || 'public/free/openclaw-quick-fix-guide.pdf';
      const absolutePath = resolve(process.cwd(), attachmentPath);
      const file = await readFile(absolutePath);
      const base64 = file.toString('base64');
      payload.html = '<p>Hey there,</p><p>Attached is your OpenClaw Quick Fix Guide PDF.</p><p>- AtlasLionClaw</p>';
      payload.attachments = [
        {
          filename: FREE_PDF_ATTACHMENT_FILENAME || 'openclaw-quick-fix-guide.pdf',
          content: base64
        }
      ];
    } else {
      const pdfUrl = FREE_PDF_URL || 'https://atlaslionclaw.com/free/openclaw-quick-fix-guide.pdf';
      payload.html = `<p>Hey there,</p><p>Thanks for requesting the free OpenClaw Quick Fix Guide.</p><p><a href="${pdfUrl}">Download your PDF here</a></p><p>- AtlasLionClaw</p>`;
    }

    const sendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!sendResp.ok) {
      const t = await sendResp.text();
      res.status(500).json({ ok: false, error: `Email send failed: ${t}` });
      return;
    }

    res.status(200).json({ ok: true, emailed: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || 'Unknown server error' });
  }
}
