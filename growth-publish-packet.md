# Growth Publish Packet — OpenClaw PDF MVP

Date: 2026-03-27  
Owner: Growth Department

## 1) Final list of publish-ready posts

> Note: `openclaw-march-2026-updates` is intentionally excluded from this final publish set to avoid keyword cannibalization with `openclaw-march-2026-reliability-updates` (same primary topic + near-duplicate H1 intent).

- **The Rise of the Invisible Assistant | OpenClaw Local AI Ops**  
  Slug: `/blog/rise-of-the-invisible-assistant-openclaw-local-ai-ops/`  
  Funnel: **TOFU**
- **The Rise of AI Operations as a Real Job**  
  Slug: `/blog/rise-of-ai-operations-as-a-real-job/`  
  Funnel: **TOFU**
- **From Chat to Action: How AI Workflows Move from Messages to Real Operations**  
  Slug: `/blog/from-chat-to-action-ai-workflows/`  
  Funnel: **TOFU**
- **The New AI Stack for Small Teams: Orchestrators, Fallback Models, and Workflow Automation**  
  Slug: `/blog/new-ai-stack-for-small-teams/`  
  Funnel: **TOFU**
- **OpenClaw + AI News Roundup**  
  Slug: `/blog/openclaw-ai-news-roundup/`  
  Funnel: **TOFU**
- **From Prompting to Operations: Running AI Agents Like Production Services**  
  Slug: `/blog/from-prompting-to-ai-operations/`  
  Funnel: **MOFU**
- **What Breaks in Real AI Agent Systems (and How OpenClaw-Style Safeguards Reduce Risk)**  
  Slug: `/blog/what-breaks-in-ai-agent-systems/`  
  Funnel: **MOFU**
- **Human-in-the-Loop by Design: Safe AI Automation**  
  Slug: `/blog/human-in-the-loop-ai-approval-gates/`  
  Funnel: **MOFU**
- **Cron + Heartbeats: The Two-Layer Automation Pattern for Reliable Agent Operations**  
  Slug: `/blog/cron-heartbeats-two-layer-automation-pattern/`  
  Funnel: **MOFU**
- **Scaling OpenClaw: From Personal Assistant to Enterprise Fleet**  
  Slug: `/blog/scaling-openclaw-enterprise-fleet/`  
  Funnel: **MOFU**
- **OpenClaw March 2026 Updates: Reliability Features That Matter**  
  Slug: `/blog/openclaw-march-2026-reliability-updates/`  
  Funnel: **MOFU**
- **OpenClaw Security Hardening in 2026: Production Guide**  
  Slug: `/blog/openclaw-security-hardening-2026/`  
  Funnel: **BOFU**
- **Securing Your Autonomous Agents: A Guide to OpenClaw Permissions and Host Safety**  
  Slug: `/blog/securing-autonomous-agents-openclaw/`  
  Funnel: **BOFU**
- **OpenClaw Cron Jobs: Reliable Scheduled Workflows**  
  Slug: `/blog/openclaw-reliable-scheduled-workflows/`  
  Funnel: **BOFU**
- **OpenClaw Setup Checklist (2026)**  
  Slug: `/blog/openclaw-setup-checklist/`  
  Funnel: **BOFU**
- **Top Discord Integration Fixes**  
  Slug: `/blog/openclaw-discord-fixes/`  
  Funnel: **BOFU**
- **Telegram vs Discord for OpenClaw in 2026**  
  Slug: `/blog/telegram-vs-discord-openclaw-2026/`  
  Funnel: **BOFU**

---

## 2) Internal linking improvements (top 5 quick wins)

1. **Security hub loop:** Add contextual link in `/blog/openclaw-security-hardening-2026/` to `/blog/securing-autonomous-agents-openclaw/` with anchor like **“permissions and host safety baseline”**.
2. **Scheduling cluster:** In `/blog/openclaw-reliable-scheduled-workflows/`, add in-body link to `/blog/cron-heartbeats-two-layer-automation-pattern/` using anchor **“two-layer cron + heartbeat pattern”**.
3. **Conversion assist from comparison content:** In `/blog/telegram-vs-discord-openclaw-2026/`, add CTA link to `/blog/openclaw-setup-checklist/` and `/blog/openclaw-discord-fixes/` after decision matrix.
4. **Thought leadership → practical bridge:** In `/blog/rise-of-ai-operations-as-a-real-job/`, add links to `/blog/from-prompting-to-ai-operations/` and `/blog/what-breaks-in-ai-agent-systems/` as next-step reads.
5. **Homepage pathway strengthening:** Add one homepage section link to `/use-cases/` and one to `/blog/openclaw-setup-checklist/` to improve TOFU→BOFU crawl/user flow.

---

## 3) SEO metadata QA checklist (critical pages)

| Critical page | Title tag | Meta description | Canonical | OG/Twitter | Structured data | Indexability | Result |
|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass (Organization + page schema) | Pass | **PASS** |
| `/blog/` | Pass | Pass | Pass | Pass | Partial (Org only) | Pass | **PASS** |
| `/blog/openclaw-setup-checklist/` | Pass | Pass | Pass | Pass | Pass (BlogPosting) | Pass | **PASS** |
| `/blog/openclaw-discord-fixes/` | Pass | Pass | Pass | Pass | Pass (BlogPosting) | Pass | **PASS** |
| `/blog/openclaw-security-hardening-2026/` | Pass | Pass | Pass | Pass | Partial (Org only) | Pass | **PASS** |
| `/blog/cron-heartbeats-two-layer-automation-pattern/` | Pass | Pass | Pass | Pass | Partial (Org only) | Pass | **PASS** |
| `/blog/telegram-vs-discord-openclaw-2026/` | Pass | Pass | Pass | Pass | Partial (Org only) | Pass | **PASS** |
| `/blog/rise-of-the-invisible-assistant-openclaw-local-ai-ops/` | Pass | Pass | Pass | Pass | Pass (BlogPosting) | Pass | **PASS** |
| `/use-cases/` | Pass | Pass | Pass | Pass | Partial (Org only) | Pass | **PASS** |
| `/blog/openclaw-march-2026-updates/` | Pass | Pass | Pass | Pass | Partial | Pass | **FAIL (publish)** — cannibalizes `/blog/openclaw-march-2026-reliability-updates/` |

### QA notes
- Technical metadata foundation is healthy (title/description/canonical/OG/Twitter all present via layout).
- Main gap is **content-level duplication/cannibalization**, not missing tags.
- Structured article schema exists on only part of the blog set; rollout can be phased post-launch.

---

## 4) 2-week content cadence proposal (max 4 posts)

1. **Week 1 / Post 1 (TOFU):** *“AI Ops Stack for Lean Teams: 2026 Field Guide”*  
   Target intent keyword: **ai ops stack for small teams**
2. **Week 1 / Post 2 (MOFU):** *“OpenClaw Approval Gates Playbook (With Practical Templates)”*  
   Target intent keyword: **human in the loop ai approval workflow**
3. **Week 2 / Post 3 (BOFU):** *“OpenClaw Deployment Checklist for Vercel + Discord/Telegram Routing”*  
   Target intent keyword: **openclaw deployment checklist**
4. **Week 2 / Post 4 (BOFU):** *“OpenClaw Security Baseline: Host Permissions, Allowlists, and Audit Steps”*  
   Target intent keyword: **openclaw security hardening**

---

## 5) Launch day checklist (Vercel + Search Console)

### Vercel
- [ ] Confirm production build passes (`npm run build`) from latest commit.
- [ ] Verify project root, framework preset, and env vars (if any) are correct.
- [ ] Deploy to production and validate primary URLs (home, blog index, 3 key BOFU posts).
- [ ] Run post-deploy smoke checks for nav links and footer links.
- [ ] Confirm `robots.txt` and `/sitemap.xml` return 200 in production.

### Google Search Console
- [ ] Verify domain property (`https://atlaslionclaw.com`).
- [ ] Submit fresh sitemap (`https://atlaslionclaw.com/sitemap.xml`).
- [ ] URL inspect + request indexing for: `/`, `/blog/`, and top 5 target posts.
- [ ] Confirm no manual actions / security issues.
- [ ] Monitor Coverage + Enhancements for 72 hours after launch.

---

## Safe changes made during this audit

1. **Removed duplicate import** in `src/layouts/BaseLayout.astro` (non-functional cleanup; no behavior change).
2. **Expanded `public/sitemap.xml`** to include `/use-cases/` and all use-case child pages for better discoverability and crawl coverage.

No destructive edits were made.
