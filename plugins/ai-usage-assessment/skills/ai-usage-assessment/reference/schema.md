# Output Schema (fill what applies; use `unknown` freely — never block)

Emit ONE fenced ```yaml block in this structure, then a 3–5 sentence human summary. The **`usage`**
list is the heart of it — one entry per distinct way they use AI (tool × provider × access path).
Most people will have several; that's expected. `production_workflows` is OPTIONAL — only for real
pipelines. Keep enum values exact so reports aggregate cleanly.

```yaml
assessment:
  person: ""                 # First Last
  email: ""
  team: ""                   # CNU | AI-CoE | CNU-Interns | Other
  date: ""                   # YYYY-MM-DD
  overview: ""               # 1-3 sentences, their words: what they build / how they work with AI

  usage:                     # one entry PER distinct way they use AI (not per "workflow")
    - tool: ""               # Claude Code | Codex | OpenCode | Cursor | Windsurf | ChatGPT web | Claude.ai web | custom agent/script | automation | other
      providers_models: []   # e.g. ["Anthropic claude-opus-4.8","Anthropic claude-sonnet-4.6"]
      model_choice: ""       # deliberate | default | mixed
      access_path: ""        # direct_api_key | truefoundry_gateway | subscription | cloud_bedrock_vertex | unknown
      what_for: ""           # rough purpose (e.g. "coding across ~6 side projects", "research", "PR review")
      cadence: ""            # daily_heavy | regular | occasional | scheduled_automated
      interactive_or_automated: ""  # interactive | automated | both
      rough_volume: ""       # $/mo, tokens, or unknown

  production_workflows:      # OPTIONAL — only if they run an app/service/agent calling models in volume
    - name: ""
      purpose: ""
      providers_models: []
      access_path: ""        # direct_api_key | truefoundry_gateway | subscription | cloud_bedrock_vertex
      latency_class: ""      # interactive | async_tolerant | mixed
      stable_prefix: ""      # yes | no | unknown  (large reused system prompt/tools/docs?)
      eval_coverage: ""      # yes | partial | no | unknown
      monthly_spend_estimate: ""  # USD or unknown
      # Fireworks-only:
      fine_tuning: ""        # none | occasional | frequent | unknown
      dedicated_gpus: ""     # none | yes_well_utilized | yes_some_idle | unknown

  pain_points: ""            # short freeform

  optimization_signals:      # rolled up across all usage; opportunities, NOT dollar claims
    subscription_candidate: ""   # yes | no | unknown + which usage (e.g. "Claude Code interactive → Max seat")
    gateway_routing: ""          # yes | no | already + reason (route direct-API usage through TrueFoundry for budgets/visibility)
    caching_candidate: ""        # yes | no | unknown + reason
    batch_candidate: ""          # yes | no | unknown + reason
    rightsize_candidate: ""      # yes | no | unknown + reason
    gpu_utilization_flag: ""     # yes | no | n/a + reason
    governance_flag: ""          # yes | no | unknown + reason (cross-org / shouldn't-be-on-our-bill / cloud route premium)
  followup_recommended: ""   # none | quick_call | deep_review
```

## Human summary (below the YAML)
3–5 sentences: how they use AI, where the cost/usage concentrates, the top 1–2 opportunities, and the
single recommended next step. Supportive tone. No invented savings figures.
