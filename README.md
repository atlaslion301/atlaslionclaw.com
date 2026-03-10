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
- Landing forms insert into `public.leads` using the publishable key.
- SQL schema/policy file: `supabase.sql`

## Notes
- Anti-spam included: honeypot + client-side rate limiting.
- Blog routes are under `src/pages/blog/`.
- SEO basics included via layout metadata, canonical links, robots, and sitemap.
