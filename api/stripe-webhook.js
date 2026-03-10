import Stripe from 'stripe';
import crypto from 'node:crypto';

export const config = { api: { bodyParser: false } };

async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUBLIC_BASE_URL, RESEND_API_KEY, FREE_PDF_FROM_EMAIL } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !PUBLIC_BASE_URL) {
    return res.status(500).send('Missing env');
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const raw = await readRaw(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = (session.customer_details?.email || session.customer_email || '').toLowerCase();
    if (email) {
      const token = crypto.randomBytes(32).toString('base64url');
      const ttlMinutes = Number(process.env.PAID_PDF_TOKEN_TTL_MINUTES || 60);
      const expires = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

      await fetch(`${SUPABASE_URL}/rest/v1/paid_pdf_tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify([{ email, token, expires_at: expires, stripe_session_id: session.id }])
      });

      if (RESEND_API_KEY && FREE_PDF_FROM_EMAIL) {
        const base = PUBLIC_BASE_URL.replace(/\/$/, '');
        const secureUrl = `${base}/api/paid-download?t=${token}`;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: FREE_PDF_FROM_EMAIL,
            to: [email],
            subject: 'Your OpenClaw Operator Playbook (Paid)',
            html: `<p>Payment received ✅</p><p>Download your paid playbook here (short-lived, one-time): <a href="${secureUrl}">${secureUrl}</a></p>`
          })
        });
      }
    }
  }

  return res.status(200).json({ received: true });
}
