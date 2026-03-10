# AtlasLionClaw Site (Astro)

This project is now migrated to **Astro** with static pages and blog routes.

## Run locally
```bash
cd /home/atlaslion/.openclaw/workspace/openclaw-pdf-mvp
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Supabase
- Landing forms insert into `public.leads`.
- SQL schema/policy file: `supabase.sql`

## Free PDF email flow
- Endpoints:
  - `api/free-pdf.js` (creates lead + sends email)
  - `api/free-download.js` (one-time secure token download)
- Required env vars (set in Vercel): see `.env.example`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `FREE_PDF_FROM_EMAIL`
  - `PUBLIC_BASE_URL`
  - `FREE_PDF_DELIVERY_MODE` (`url` or `attachment`)
- Run SQL files in Supabase SQL Editor:
  - `supabase.sql`
  - `supabase-token-table.sql`
- Free PDF is now stored outside public web root by default:
  - `protected-assets/free/openclaw-quick-fix-guide.pdf`

## Paid PDF (Stripe)
- Endpoints:
  - `api/create-checkout-session.js`
  - `api/stripe-webhook.js`
  - `api/paid-download.js`
- Required env vars:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`
  - `PAID_PDF_TOKEN_TTL_MINUTES`
- Run SQL:
  - `supabase-paid-token-table.sql`
- Configure Stripe webhook endpoint:
  - `https://atlaslionclaw.com/api/stripe-webhook`

## Notes
- Anti-spam included: honeypot + client-side rate limiting.
- Blog routes are under `src/pages/blog/`.
- SEO basics included via layout metadata, canonical links, robots, and sitemap.
