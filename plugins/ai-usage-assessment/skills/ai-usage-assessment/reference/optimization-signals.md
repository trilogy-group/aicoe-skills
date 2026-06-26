# Optimization Signals — how to flag levers (per usage entry → rolled up)

Map the captured usage to candidate levers. Flag the **opportunity** with a one-line reason. Do NOT
estimate dollar savings — the AI CoE sizes those centrally. If unsure, `unknown`. A person can trigger
several; flag all that apply, and name *which* usage entry triggers each.

| Signal | Flag `yes` when… | Why it matters |
|---|---|---|
| **subscription_candidate** | An **interactive** tool (Claude Code / Codex / ChatGPT-style) runs on a **direct API key** at meaningful volume | A flat seat (Claude Max / ChatGPT) can replace metered API for interactive use; the gateway can fall back to discounted API past the seat's rate caps |
| **gateway_routing** | Any usage is on a **direct API key** (not yet through TrueFoundry) | Routing via the TF VAT gives per-user budgets, limits, and one-pane visibility — the main governance win (note: gateways don't cut per-token price) |
| **caching_candidate** | A tool/pipeline reuses a **large stable prefix** (system prompt, tools, docs/RAG) across many calls, latency interactive/mixed | Cached input is far cheaper; biggest mechanical lever where prefixes are stable (Gemini especially; Anthropic largely already cached) |
| **batch_candidate** | Usage is **automated / async-tolerant** and not already batched | Flat 50% off with no quality tradeoff; stacks with caching |
| **rightsize_candidate** | `model_choice: default/unclear` on a flagship model AND task is low-stakes or easy-to-verify (and eval coverage exists) | Safe downgrade (flagship → mid/mini) only where evals catch regressions |
| **gpu_utilization_flag** | Fireworks `dedicated_gpus: yes_some_idle` OR frequent fine-tuning with no stated cadence reason | Idle GPUs at $7–10/hr are pure waste; right-size or schedule |
| **governance_flag** | Usage serves **another org**, bills to us but shouldn't, or routes Claude via **Vertex/Bedrock** at a premium | Chargeback / key migration / consolidate the cloud route — governance, not tuning |

## Access-path cues (the lever-rich dimension)
- **direct_api_key + interactive tool** → subscription_candidate AND gateway_routing.
- **direct_api_key + automated** → gateway_routing (budgets) AND batch_candidate.
- **truefoundry_gateway already** → governance is in good shape; focus on caching/right-size of the underlying calls.
- **subscription already** → check whether agentic/headless use is metered separately (note it; don't assume flat).
- **cloud_bedrock_vertex** → governance_flag (verify it isn't paying a route premium vs direct).

## Guard-rails
- Don't over-claim: flagship use with a clear rationale + eval coverage is NOT a rightsize candidate — say so.
- `eval_coverage: no` caps rightsize confidence → "candidate pending eval coverage."
- Fine-tuning volume is often legitimate; flag `gpu_utilization` only for *idle* capacity, not training itself.
- If someone only uses a subscription/web UI casually, most levers are N/A — keep it short, don't manufacture findings.
