# Trilogy AI CoE — Skill Marketplace

Internal marketplace of **Agent Skills** authored by the Trilogy AI Center of Excellence.
Skills are written once in the open [`SKILL.md`](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
format and installed into Claude Code, Cowork, and any other SKILL.md-compatible runtime.

This repo is the **single source of truth**. The catalog UI and cross-runtime installer
CLI (planned) are generated from the same skill folders.

---

## Install (Claude Code / Cowork)

Add the marketplace once, then install any skill from it:

```bash
# Add the marketplace
/plugin marketplace add trilogy-group/aicoe-skills

# Install a specific skill
/plugin install coe-skill-template@aicoe-skills
```

Update later with `/plugin marketplace update aicoe-skills`.

> Private repo? Claude Code uses your existing git credentials (`gh auth login`, SSH,
> or a credential helper). For background auto-updates, set `GITHUB_TOKEN` in your shell.

### Auto-prompt your team

To have teammates prompted to add this marketplace automatically when they trust a project,
add it to that project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "aicoe-skills": {
      "source": { "source": "github", "repo": "trilogy-group/aicoe-skills" }
    }
  },
  "enabledPlugins": {
    "coe-skill-template@aicoe-skills": true
  }
}
```

## Install (Codex CLI)

From the terminal:

```bash
codex plugin marketplace add trilogy-group/aicoe-skills
codex plugin install ai-usage-assessment@aicoe-skills
```

From inside a Codex session:

```
/plugins marketplace add trilogy-group/aicoe-skills
/plugins install ai-usage-assessment@aicoe-skills
```

## Install (opencode / OpenClaw / other SKILL.md runtimes)

Place the skill folder into the runtime's skills directory (typically `~/.<runtime>/skills/<name>/`).
Each `plugins/<name>/skills/<name>/` folder in this repo is a drop-in skill — copy it in whole.

---

## Repository structure

```
aicoe-skills/
├── .claude-plugin/
│   └── marketplace.json          # marketplace catalog (lists every plugin/skill)
├── plugins/
│   └── <skill-name>/             # one plugin per skill = its own install button
│       ├── .claude-plugin/
│       │   └── plugin.json        # plugin manifest
│       └── skills/
│           └── <skill-name>/
│               └── SKILL.md       # the skill itself (frontmatter + instructions)
├── CONTRIBUTING.md
└── README.md
```

We use **one plugin per skill** so each skill appears and installs independently in the
Discover tab. To bundle related skills, add multiple `skills/<name>/` folders under one
plugin instead.

## Add a skill

See [CONTRIBUTING.md](./CONTRIBUTING.md). The short version: copy
`plugins/coe-skill-template`, rename the folder and its `skills/<name>/` directory, update
`plugin.json` and the `SKILL.md` frontmatter, then add an entry to
`.claude-plugin/marketplace.json`.

## Validate before pushing

```bash
claude plugin validate .                     # checks marketplace.json
claude plugin validate ./plugins/<skill>     # checks a plugin's manifest + SKILL.md
```

---

Maintained by the Trilogy AI Center of Excellence · david.proctor@trilogy.com
