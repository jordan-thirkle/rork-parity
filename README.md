# RorkParity — Chat-to-Game Builder

Describe a game, get a playable web game. Iterate in chat. Publish to the ForgeLoop subdomain under ByJTT.

Built by **ByJTT**. Game-specialized, not general-purpose.

## Status

**Phase 1 active** — Core chat interface + web game generation pipeline.

| Component | Status |
|-----------|--------|
| Landing page | Built — `app/index.html` |
| Chat UI (split-pane) | Built — `app/workspace.html` |
| Preview system | Built — iframe sandbox with blob URL isolation |
| Agent pipeline docs | Spec'd — `docs/agent-pipeline.md` |
| FORGEMASTER → SMITH → WHETSTONE flow | Defined — executed in Hermes session |
| First template (brawler zone crawler) | Built — `templates/brawler-zone-crawler.html` |
| Template manifest | Populated — `templates/manifest.json` |
| Backend schema | Designed — `backend/schema.sql` (Phase 2) |
| LOREKEEPER (templates) | Dormant — Phase 3 gate |
| CRIER (publishing) | Dormant — Phase 4 gate |

## Structure

```
app/                    — Chat UI + preview system
  index.html           — Main split-pane application
  style.css            — ByJTT UI Kit styling
  chat.js              — Chat interface logic
  preview.js           — Game preview iframe management
  state.js             — Project state management
  app.js               — Application orchestrator
  games/               — Generated game files (created on generation)

templates/              — Validated game templates
  manifest.json        — Template registry
  brawler-zone-crawler.html  — 2D arena brawler

backend/                — Phase 2 target
  schema.sql           — Supabase schema

docs/                   — Architecture documentation
  agent-pipeline.md    — FORGEMASTER → SMITH → WHETSTONE flow

.opencode/              — Agent profile (OpenCode format)
  SOUL.md, AGENTS.md, WORKFLOW.md, STYLE.md, CONTEXT.md, BUG_REGISTRY.md
  agents/              — Individual agent instructions
```

## How to use

1. Open `app/index.html` for the landing page and `app/workspace.html` for the builder (or serve via `npx serve app/`).
2. Describe a game in the chat panel.
3. I (the Hermes agent) process through the FORGEMASTER → SMITH → WHETSTONE pipeline.
4. Generated game appears in the preview pane.
5. Iterate with follow-up requests.
6. Export or publish when ready.

## Phase gates

| Phase | What | Status |
|-------|------|--------|
| 1 | Core chat + web generation | **Complete** — pipeline demoed live with 9/9 WHETSTONE validation |
| 2 | Projects + credits | After 3+ real sessions |
| 3 | Template library | After 2+ validated genres |
| 4 | Publishing | First project user wants live |
| 5 | Mobile export (RN/Expo) | On explicit demand |
| 6 | Native/cloud build parity | If Phase 5 sees real use |

## Competitive analysis

See [`docs/rork-deconstruction.md`](docs/rork-deconstruction.md) — complete first-principles
deconstruction of Rork.com (features, pricing, tiers, cloud infrastructure, design philosophy,
and strategic gaps we can exploit).

## Features

- **Quick-start templates** — 1-click prompts (2D Brawler, Idle RPG, Arena, 3D World)
- **Model & credit indicators** in the nav bar
- **Resizable split-pane** chat + preview layout
- **Sandboxed iframe preview** with blob URL isolation
- **HTML export** — download games as standalone files
- **Deferred feature tracking** — scope decisions surfaced transparently

## Tech

- **UI**: Plain HTML/CSS/JS with ByJTT design tokens (Space Grotesk, dark theme)
- **Hosting**: Vercel static deploy with clean URL redirects
- **Preview**: Sandboxed iframe with blob URL isolation
- **Game stack**: Canvas2D (default), Three.js, Phaser, or Godot
- **Backend** (Phase 2): Supabase (auth, Postgres, storage)
- **Publishing**: forgeloop.byjtt.com
