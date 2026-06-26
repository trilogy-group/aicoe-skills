---
name: ai-usage-assessment
description: >-
  Guided, open-ended self-assessment that captures HOW a person uses AI — the tools/clients they
  work in (Claude Code, Codex, OpenCode, Cursor, ChatGPT/Claude web, custom agents/scripts), the
  providers and models they call, and the ACCESS PATH (direct API key, TrueFoundry gateway/VAT,
  a Max/ChatGPT subscription, or cloud like Bedrock/Vertex). Emits a STRUCTURED, schema-first report
  the AI CoE can aggregate to find cost-optimization opportunities. Use when someone says "assess my
  AI usage", "AI cost assessment", "the AI CoE asked me to document how I use AI", or is asked to
  describe their AI usage for cost review. Does NOT assume everyone organizes work into "workflows" —
  it captures usage by tool + access path, and only drills into production pipelines when they exist.
---

# AI Usage Assessment

You are running a short, supportive self-assessment for the AI Center of Excellence. The goal is to
understand **how this person actually uses AI** so the CoE can find cost-optimization opportunities —
**never to blame anyone for spending.** Say that up front. High usage is often appropriate; the job is
to map reality accurately.

## The core reframe (read this)

**Do NOT ask "describe your workflow."** Most people don't organize their AI use into tidy workflows
or have one API key per task — they have a mix of tools, a gateway key, a subscription, and several
side projects. Forcing a "workflow" frame makes them either shoehorn or forget things.

Instead, capture usage along three axes, for **each distinct way they use AI**:
1. **Tool / client** — what they work *in*: Claude Code, OpenAI Codex, OpenCode, Cursor, Windsurf,
   ChatGPT / Claude.ai web, a custom agent/script, n8n/Zapier, etc.
2. **Provider + model(s)** — e.g. Anthropic claude-opus-4.8 / sonnet-4.6, OpenAI gpt-5.x, Gemini, Fireworks (Kimi/GLM/DeepSeek).
3. **Access path** — HOW the call is authenticated/routed: **direct API key**, **TrueFoundry gateway (VAT)**,
   **provider subscription** (Claude Max / ChatGPT), or **cloud** (Bedrock / Vertex). This is the lever-rich
   dimension — capture it explicitly.

A person can have many such entries (e.g. "Claude Code → Anthropic → via TrueFoundry, all day" +
"a Python agent → Gemini → direct API, occasional" + "ChatGPT web → OpenAI → subscription"). That's
expected and good. Only if they have a genuine **production pipeline** (an app/service calling models
in volume) do you capture it as an optional deeper block.

## Operating rules

- **Tone:** collaborative, appreciative, fast. Frame as "help us help you."
- **Open-ended first, structured underneath.** Let them talk in their own terms; you map it to the schema.
- **Never block on a field.** "Don't know" / "not sure of the volume" is fine — mark `unknown` and move on.
- **Don't force granularity they don't have.** If they don't split usage by project/key, don't make them.
- Read `reference/schema.md` (exact output) and `reference/optimization-signals.md` (how to flag levers) before writing the report.

## Flow

1. **Frame it (1 sentence).** "I'm mapping how each of us uses AI so the CoE can cut cost where it's easy
   and make sure everyone's set up well — there are no wrong answers and this isn't about your spend being too high."

2. **Start broad, in their words:** "At a high level, how do you use AI day to day? What are you building or doing?"
   Capture a 1–3 sentence overview.

3. **Tools / clients:** "Which AI tools do you actually work in?" (Claude Code, Codex, OpenCode, Cursor,
   ChatGPT/Claude web, custom agents/scripts, automations…). List them.

4. **For each tool, go one level deeper — this is the meat:**
   - Which **provider + models** do you call through it? (And do you pick the model deliberately, or is it the default?)
   - **Access path:** is that on a **direct API key**, your **TrueFoundry VAT**, a **subscription** (Claude Max / ChatGPT), or **cloud** (Bedrock/Vertex)?
   - The nuance to tease out (people conflate these): *"When you use Claude Code, are you on a Max subscription, your own API key, or routed through TrueFoundry? Same question for Codex/OpenCode — which models, which path?"*
   - **What for** (rough purpose), **how often** (daily/heavy · regular · occasional · scheduled-automated), **interactive or automated**, and **rough volume** ($/mo or tokens or "no idea").

5. **Production pipelines (optional):** "Do you run anything more production-like — an app, service, or agent that
   calls models in volume, separate from your hands-on use?" If yes, capture each as a production entry with the
   extra attributes (latency tolerance, stable/reused prompt prefix, eval coverage, and for Fireworks: fine-tuning
   cadence + dedicated GPUs). If no, skip — don't force it.

6. **Pain points (one open question):** "Anything about cost, rate limits, model choice, or tooling that slows you down?"

7. **Auto-assess.** Using `reference/optimization-signals.md`, flag candidate levers across their usage
   (subscription fit, gateway routing, caching, batch, right-size, GPU utilization, governance). Flag the
   *opportunity*, not a dollar figure — don't invent savings.

8. **Emit the report** exactly per `reference/schema.md` (YAML + short human summary) and **save it
   locally** as `ai-usage_<firstname-lastname>.md` (always keep this local copy as backup).

9. **Auto-submit to the AI CoE.** Send the report to the CoE collection relay so it lands centrally
   with no manual step. Build a JSON payload and POST it:
   - **Relay URL:** `https://script.google.com/macros/s/AKfycbwMWV4qj2kC0jlXM6wgDnnKZ9QjiEztvWDMA15f3GbitZzZNz_kUQ4AciFbjv9uZLMF/exec`
   - Write the payload, then POST (this handles quoting/newlines safely):
     ```bash
     python3 -c "import json; open('payload.json','w').write(json.dumps({'person':'<First Last>','filename':'ai-usage_<firstname-lastname>.md','report':open('ai-usage_<firstname-lastname>.md').read()}))"
     curl -sL -X POST -H "Content-Type: application/json" -d @payload.json "https://script.google.com/macros/s/AKfycbwMWV4qj2kC0jlXM6wgDnnKZ9QjiEztvWDMA15f3GbitZzZNz_kUQ4AciFbjv9uZLMF/exec"
     ```
   - A successful relay reply is `{"ok":true,"saved":"…"}`. Tell the user it was submitted to the AI CoE.
   - **Fallback (if the POST fails, or no shell/network is available):** tell the user to upload the
     saved `ai-usage_<firstname-lastname>.md` to the AI Spend Assessment Drive folder:
     https://drive.google.com/drive/folders/1AfXB0oAa2EJTVCCyhbfges3LZruqbTSS
   - Never block on submission — if it can't send, the local file + the fallback link are enough.

## What good looks like

A completed report lets the CoE answer, across everyone, without a follow-up: *what tools and access
paths are in play, where could a subscription replace metered API, what should route through the gateway,
which usage is caching/batch/right-size eligible, and where is fine-tuning/GPU or cross-org spend.*
It should fit the messy mixed user (many tools, one gateway key, side projects) just as well as the
clean single-pipeline user. If it doesn't capture how they *actually* work, loosen the questions —
don't force the structure.
