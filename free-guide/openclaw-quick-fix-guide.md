# OpenClaw Quick Fix Guide (Free)

**Version:** 1.0  
**Date:** 2026-03-09  
**By:** AtlasLionClaw

---

## 1) Quick Setup Checklist (New Users)

1. Install OpenClaw and confirm CLI works.
2. Configure your channel token(s) in config.
3. Set access policy explicitly (allowlist recommended).
4. Start/restart gateway.
5. Complete pairing for first-time chat use.
6. Send a test message end-to-end.

---

## 2) Fast Triage Flow (60 seconds)

If OpenClaw is not responding:

1. Is gateway running?
2. Is channel token valid?
3. Is pairing approved?
4. Is allowlist/group policy correct?
5. Did you change config that needs restart?
6. Run doctor and fix schema issues.

---

## 3) Top 10 Common Issues + Fixes

## Issue 1: Discord DM not replying
**Cause:** Pairing not approved yet.  
**Fix:** Trigger pairing code, approve pairing, retest DM.

## Issue 2: Discord server messages ignored
**Cause:** Guild/user allowlist mismatch.  
**Fix:** Set `groupPolicy=allowlist`, add guild users allowlist, retest.

## Issue 3: Telegram bot configured but silent
**Cause:** Token not loaded or gateway not restarted.  
**Fix:** verify token, restart gateway, retest.

## Issue 4: Telegram group bot seems blind
**Cause:** Privacy mode/group policy behavior.  
**Fix:** review BotFather privacy + group policy settings.

## Issue 5: Gateway won’t start after config edits
**Cause:** Schema validation failure.  
**Fix:** run `openclaw doctor` and correct invalid fields.

## Issue 6: DM policy “open” still blocks
**Cause:** policy/allowFrom mismatch.  
**Fix:** set explicit allowlist model or wildcard intentionally.

## Issue 7: Bot only responds when mentioned
**Cause:** `requireMention` behavior in groups.  
**Fix:** set per-group mention behavior as intended.

## Issue 8: CLI agent command fails
**Cause:** missing explicit target.  
**Fix:** pass `--agent` (or `--to` / session target).

## Issue 9: “Address already in use” error
**Cause:** port conflict.  
**Fix:** use another port or stop existing process.

## Issue 10: Config change seems ignored
**Cause:** some fields require restart.  
**Fix:** restart gateway after infra-level config changes.

---

## 4) Copy/Paste Commands

```bash
openclaw gateway status
openclaw gateway restart
openclaw doctor
openclaw doctor --fix
```

---

## 5) Security Baseline (Must-do)

- Prefer allowlist access model.
- Keep tokens private and rotate if leaked.
- Don’t expose admin surfaces publicly.
- Use least privilege by default.

---

## 6) Next Step

If this free guide saved you time, join the Operator Playbook for advanced troubleshooting, hardening, and release operations.

**Site:** https://atlaslionclaw.com
