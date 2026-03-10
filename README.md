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
  - `FREE_PDF_DELIVERY_MODE` (`attachment` or `url`)
  - `FREE_PDF_URL` (if mode = `url`)
  - `FREE_PDF_ATTACHMENT_PATH` + `FREE_PDF_ATTACHMENT_FILENAME` (if mode = `attachment`)
- Put your PDF file in the repo path referenced by `FREE_PDF_ATTACHMENT_PATH` (default: `public/free/openclaw-quick-fix-guide.pdf`).

## Notes
- Anti-spam included: honeypot + client-side rate limiting.
- Blog routes are under `src/pages/blog/`.
- SEO basics included via layout metadata, canonical links, robots, and sitemap.
