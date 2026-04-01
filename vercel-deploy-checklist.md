# Vercel Deploy + SEO Finalization Checklist

## 1) Deploy
- Push `openclaw-pdf-mvp` to GitHub.
- Import repo/project in Vercel.
- Framework preset: Other (static) or Next.js if migrated later.
- Deploy.

## 2) Domain
- Add custom domain in Vercel.
- Confirm HTTPS active.

## 3) Replace placeholders (Astro source-of-truth)
Update these files with your real domain:
- `astro.config.mjs`
  - `site` value
- `src/layouts/BaseLayout.astro`
  - canonical URL defaults
  - OG URL defaults
  - hreflang alternate URLs (if used)
- `public/robots.txt`
  - sitemap URL
- `public/sitemap.xml`
  - all `<loc>` entries

## 4) Validate lead capture
- Submit free form and paid form once.
- Confirm rows in Supabase `public.leads`.
- Test duplicate protection.

## 5) Search indexing
- Add site to Google Search Console.
- Submit `https://YOUR_DOMAIN/sitemap.xml`.
- Request indexing for homepage and locale pages.

## 6) Geo SEO readiness
- Create actual localized pages for each hreflang URL.
- Keep translated meta title/description/H1 unique per locale.
- Ensure locale switcher is visible.

## 7) Post-launch monitoring
- Check Vercel Analytics (or GA/Umami).
- Track form conversion by lead type.
- Weekly SEO checks: impressions, CTR, indexed pages.
