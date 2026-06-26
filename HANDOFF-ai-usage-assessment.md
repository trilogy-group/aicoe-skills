# Handoff — package `ai-usage-assessment` into the (PRIVATE) marketplace

**Goal:** publish the `ai-usage-assessment` skill in this repo as a marketplace plugin so AI CoE / CNU
teammates install it with `/plugin marketplace add <owner>/aicoe-skills` then `/plugin install …`, and
its output auto-collects to a Google Drive folder via a webhook relay.

> ⚠️ **This repo MUST stay PRIVATE.** The skill's `SKILL.md` contains a submit token (see Secrets below).

---

## What's already here

| Path | What it is |
|---|---|
| `ai-usage-assessment/SKILL.md` | The skill. Open-ended self-assessment of how a person uses AI (tools × providers/models × access path), emits a schema-first report, then **auto-submits** it to the relay. |
| `ai-usage-assessment/reference/schema.md` | Exact output schema (YAML block + summary). |
| `ai-usage-assessment/reference/optimization-signals.md` | How the skill flags levers (subscription / gateway / caching / batch / right-size / GPU / governance). |
| `relay/assessment-relay.gs` | **Reference copy** of the Google Apps Script relay. The real token is NOT here (placeholder only) — the live token lives in the *deployed* Apps Script. |

## The skill design (context)
- Primary unit is **how someone uses AI**, not "workflow" — a `usage` list of entries (tool, provider+models, **access path**: direct API key / TrueFoundry VAT / subscription / cloud). Production pipelines are an optional deeper block.
- Closing step writes `ai-usage_<first-last>.md` locally, then submits it.

## Output-collection contract (the relay)
- The skill POSTs JSON to the deployed Apps Script Web App:
  - **URL:** `https://script.google.com/macros/s/AKfycbwMWV4qj2kC0jlXM6wgDnnKZ9QjiEztvWDMA15f3GbitZzZNz_kUQ4AciFbjv9uZLMF/exec`
  - **Body:** `{"token":"<submit token>","person":"First Last","filename":"ai-usage_first-last.md","report":"<full markdown>"}`
  - Relay writes the report as a `.md` into the **AI Spend Assessment** Drive folder (`1AfXB0oAa2EJTVCCyhbfges3LZruqbTSS`) and returns `{"ok":true,"saved":"…"}`.
- **Fallback** (already in SKILL.md): if the POST fails or no shell/network is available, the skill tells the user to drop the saved `.md` into that Drive folder manually.

## Token
`trilogy-aicoe-relay` — shared team token, intentionally public. It's a noise filter only (prevents random junk in the Drive folder), not a security boundary. If the Drive folder gets spammed, just change the token in `SKILL.md`, `relay/assessment-relay.gs`, and the deployed Apps Script, then redeploy.

## Packaging tasks
1. Lay out as a plugin (per Claude Code plugin docs) — e.g., a single `ai-coe` plugin whose `skills/ai-usage-assessment/` holds `SKILL.md` + `reference/`. (Move/copy the `ai-usage-assessment/` folder into the plugin's `skills/` dir.)
2. Add `.claude-plugin/marketplace.json` at repo root listing the plugin + version; add `.claude-plugin/plugin.json` per plugin.
3. **Do not** include `relay/` inside the published plugin (it's CoE infra, not part of the skill).
4. Bump `version` on every skill change so existing installs auto-sync.
5. Docs: https://code.claude.com/docs/en/plugin-marketplaces · https://code.claude.com/docs/en/skills

## Pre-flight before first team install
- [ ] Relay redeployed with the token check removed (paste updated `relay/assessment-relay.gs` into Apps Script → new version, same `/exec` URL).
- [ ] Repo is **private**.
- [ ] End-to-end test: install the plugin, run the skill on yourself → confirm an `ai-usage_*.md` lands in the Drive folder (relay reply `{"ok":true}`).
- [ ] If the POST is blocked in some sessions (can't reach `script.google.com`), confirm the manual-drop fallback message appears with the Drive folder link.
