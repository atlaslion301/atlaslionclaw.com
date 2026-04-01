# AtlasLionClaw Blog Article Workflow (Create → Optimize → Publish)

This is the repeatable flow to draft, optimize, and publish a blog post to https://atlaslionclaw.com.

## 1) Draft + source of truth
- Draft in `/content-drafts/*.md` or the longer form `/home/atlaslion/.openclaw/workspace/blog-drafts.md`.
- Pick a final slug early (kebab-case). Example: `openclaw-approval-gates-playbook` → `/blog/openclaw-approval-gates-playbook/`.

## 2) Create the Astro post
- Copy an existing post in `src/pages/blog/` as a starter (e.g., `openclaw-security-hardening-2026.astro`).
- Required edits:
  - Update `<BaseLayout title=... description=...>` with a concise, unique title tag (50–60 chars) and meta description (120–155 chars).
  - Update `<h1>` and body content with the draft.
  - Keep the back-link `← Back to blog` near the top.
  - Add in-body links per growth packet (see §4 below).
- Optional: Add checklists, bullets, and CTA links near the end (e.g., to setup guide or relevant use-case page).

## 3) Blog index wiring
- File: `src/pages/blog/index.astro` (manually curated grid).
- Add a new `<a class="post-card" ...>` block with `href`, `<h4>` title, and 1–2 line summary.
- Place it near related topics (TOFU/MOFU/BOFU clustering). Avoid duplicate entries.

## 4) Internal linking (quick wins)
Use **growth-publish-packet.md** (section 2) as the linking source of truth. Minimum per new post:
- Link out to 2–3 related posts (contextual, in-body).
- Add 1–2 inbound targets by editing the related posts to point back, when relevant.
- Favor descriptive anchors (e.g., “two-layer cron + heartbeat pattern”) over generic “read more”.

## 5) SEO hygiene per post
- Title tag and meta description set in BaseLayout props.
- One H1 only. Use H2/H3 for structure.
- Add a short intro paragraph before the first H2.
- Include a skim-friendly outline: bullets, numbered steps, or mini checklists.
- If adding images, ensure proper alt text and web-safe filenames; place under `public/` and reference with absolute paths (e.g., `/images/...`).

## 6) Sitemap + robots
- `public/sitemap.xml` is **static**. Add a new `<url><loc>https://atlaslionclaw.com/blog/<slug>/</loc></url>` entry for each new post.
- `public/robots.txt` already points to the sitemap; no change unless the domain changes.

## 7) QA checklist (local)
- Run `npm run build` in repo root to confirm Astro build passes.
- Spot-check the new page at `dist/blog/<slug>/index.html` if desired.
- Validate internal links on the new page (no 404s).

## 8) Deploy + Search
- Deploy via Vercel from latest commit (project is static Astro).
- After deploy, verify the live URLs: home, `/blog/`, and the new post.
- Submit/refresh sitemap in Google Search Console: `https://atlaslionclaw.com/sitemap.xml`.
- Request indexing for the new post and `/blog/`.

## 9) Optional conversion/attribution
- If the post includes CTAs to guides/lead capture, ensure the target forms work (free PDF or checkout flows) and UTM tags are applied when linking from campaigns.

## File map (quick reference)
- Drafts: `content-drafts/*.md`, `../blog-drafts.md`
- Post pages: `src/pages/blog/<slug>.astro`
- Blog index cards: `src/pages/blog/index.astro`
- Layout/meta: `src/layouts/BaseLayout.astro`
- Sitemap/robots: `public/sitemap.xml`, `public/robots.txt`
- Linking guidance: `growth-publish-packet.md`
