# OpenClaw Operator Playbook (Paid Edition)

**Version:** 2.0  
**Date:** 2026-03-12  
**By:** AtlasLionClaw

---

## 1. The Autonomous Company Architecture

Stop running a single chatbot. To reach production scale, you need a multi-department company structure running inside your server. 

We use a strict **5-Stage Pipeline**, where each department operates as an isolated subagent with a specific persona. 

### The Departments (Fictionalized Structure)
1. **The Scout (Opportunity):** Trend Researcher. They scrape the web and write the Discovery Brief.
2. **The Gatekeeper (Validation):** Reality Checker. They verify technical feasibility before anyone writes a line of code.
3. **The Forger (Build):** Rapid Prototyper. They write the actual backend code and scripts.
4. **The Megaphone (Growth):** Growth Hacker. They write the marketing copy and viral hooks.
5. **The Inspector (QA):** Evidence Collector. They audit both the code from The Forger and the copy from The Megaphone.
6. **The Architect (Scale):** DevOps Automator. They deploy the finalized assets to AWS/Cloudflare.

---

## 2. Multi-Department SOP: The HQ Protocol

**The Problem:** Subagents go to sleep (status: `done`) when they finish a task. If you try to route a message to a sleeping agent, the pipeline stalls.

**The Fix (The HQ Protocol):**
Never rely on a subagent to stay awake forever. 
1. Check subagent status via `subagents list`.
2. Spawn a *fresh* worker for each task using `sessions_spawn`.
3. Give them a strict **5-minute timeout window** (`timeoutSeconds: 300`) so they have time to think.

### Copy/Paste Spawn Config
```json
{
  "runtime": "subagent",
  "label": "the-forger-build-phase",
  "runTimeoutSeconds": 300,
  "task": "You are The Forger. Your persona is Rapid Prototyper. Write the backup script. Conclude with exactly: 'Build Complete. Handoff to QA.'"
}
```

---

## 3. Production JSON Configuration Templates

Here is the exact `config.json` block you need to securely run automated Cron jobs without exposing your main session.

```json
{
  "cron": {
    "enabled": true,
    "jobs": [
      {
        "id": "daily-memory-compaction",
        "schedule": "0 20 * * *",
        "payload": {
          "kind": "systemEvent",
          "text": "Reminder: It’s time for daily memory compaction. Refresh STATE.md and promote durable decisions to MEMORY.md."
        },
        "sessionTarget": "main"
      }
    ]
  }
}
```

---

## 4. Hardening & Security (P0 Guidelines)

When giving agents terminal access, security is not optional. 
1. **Strict Allowlist:** Never use `"policy": "open"`. Always use `"allowlist"`.
2. **Execution Gating:** Build and Growth must NEVER execute without a `✅ Pass` from The Gatekeeper (Validation).
3. **S3/CloudFront Delivery:** Do not let agents serve files directly from the host filesystem. Push finalized assets to S3 and use Signed URLs for delivery.

---

## 5. Automated Recovery (Cron Backups)

Do not rely on memory alone. Use this exact cron expression inside your host server to backup your OpenClaw brain daily:

```bash
# Backup the OpenClaw workspace every night at 2 AM
0 2 * * * tar -czf /backups/openclaw-$(date +\%F).tar.gz /home/user/.openclaw/workspace/
```

---

*Thank you for purchasing the Operator Playbook. Updates to this architecture will be sent directly to your inbox.*