# OpenClaw PDF MVP Page

## Run locally
```bash
cd /home/atlaslion/.openclaw/workspace/openclaw-pdf-mvp
python3 -m http.server 8791
```
Open: http://localhost:8791

## Supabase setup
1. Open Supabase SQL Editor and run `supabase.sql`.
2. Verify table: `public.leads`.
3. This page uses:
   - URL: `https://kanderhmsvibtduhpsir.supabase.co`
   - publishable key: configured in `index.html`.

## Notes
- Forms now insert into Supabase directly.
- Anti-spam added: honeypot field + client-side rate limit.
- For production hardening, move keys to environment variables (Next.js/Vercel) and use an API route.

## Deploy
- Follow `vercel-deploy-checklist.md` for final domain + SEO patching.
