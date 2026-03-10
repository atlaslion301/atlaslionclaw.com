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
- Endpoint: `api/free-pdf.js` (Vercel Serverless Function)
- Required env vars (set in Vercel): see `.env.example`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `FREE_PDF_FROM_EMAIL`
  - `FREE_PDF_URL`

## Notes
- Anti-spam included: honeypot + client-side rate limiting.
- Blog routes are under `src/pages/blog/`.
- SEO basics included via layout metadata, canonical links, robots, and sitemap.
