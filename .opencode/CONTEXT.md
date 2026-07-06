# CONTEXT.md — RorkParity

Background any agent in this profile should assume as known, so it doesn't ask the user
to re-explain the ecosystem it's operating in.

## Where this lives

RorkParity is the internal project codename for the ForgeLoop product line under ByJTT. Public game surfaces currently use the ForgeLoop subdomain (forgeloop.byjtt.com) rather than games.byjtt.com. The wider ByJTT ecosystem includes byjtt.com (main site), freetier.byjtt.com, ui.byjtt.com (shared UI Kit), affiliate.byjtt.com, and ForgeLoop as the game-builder product surface. The UI should use the UI Kit for its own chat/dashboard interface where practical, not invent a parallel design system.

## Project location

`D:/Projects/rork-parity` — the working repo for all RorkParity code.
Hermes profile: `rork-parity` — agent identity in this session.

## Known platform quirks to respect

- Cloudflare cache on ByJTT subdomains has previously caused false pass states in other
  agent gates (SENTINEL) by serving stale content after a deploy. Any publish-adjacent
  agent (CRIER) must include a cache-purge step before treating a deployment as verified
  live — this is already codified in the main ByJTT AGENTS.md; don't reinvent it here,
  just inherit it.
- The main ByJTT agent system (PATCH, HERALD, WARDEN, SENTINEL, ARCHITECT) is a separate
  profile from RorkParity's (FORGEMASTER, SMITH, WHETSTONE, LOREKEEPER, CRIER). Keep logs
  and naming distinct so the two systems are never conflated when debugging.

## Reference product (competitive context, not a template to imitate)

Rork is a chat-to-app builder with a Pro tier (React Native/Expo) and Max tier (native
SwiftUI, cloud Xcode builds, streamed simulator). It's used here as a capability
benchmark for what "chat to working software" can look like, not as a brand or UX to
copy. RorkParity's actual differentiation is being game-specific and deeply integrated
with an existing publishing destination Rork doesn't have.

## Owner's working style (so agents calibrate output accordingly)

The person operating this profile is a solo full-stack developer running ByJTT as a
one-person studio. Decisions get made fast; planning and implementation happen in the
same session. Agents should default to producing complete, usable output rather than
partial drafts awaiting further clarification — ambiguity gets resolved with a stated
assumption (per SOUL.md's decision heuristic), not a clarifying question, unless the
ambiguity is about scope expansion or publishing.

## Current phase (update this line as phases activate — see WORKFLOW.md)

**Active phase: 1 — Core chat + web generation.**

What's been delivered in Phase 1 as of 2026-07-06:
- `app/index.html` — split-pane chat + preview UI with ByJTT styling
- `app/style.css` — dark theme with UI Kit tokens, quick-start templates styling
- `app/app.js` — application orchestrator (model indicator, quick-start wires, preview controls)
- `app/chat.js` — chat interface with send/display
- `app/preview.js` — sandboxed iframe game preview
- `docs/agent-pipeline.md` — FORGEMASTER → SMITH → WHETSTONE flow
- `templates/brawler-zone-crawler.html` — first validated template (482 lines, 5 zones)
- `templates/manifest.json` — populated template registry
- `app/games/zone-brawler-v1.html` — generated game accessible at :3001/games/
- `docs/rork-deconstruction.md` — complete competitive analysis of Rork.com
- Pipeline demo: FORGEMASTER spec → SMITH codegen → WHETSTONE 9/9 pass → Preview
- Quick-start template buttons in chat UI (Brawler, Idle RPG, Arena, 3D World)
- Model/credit indicators in nav bar
- Resizable split pane (280–600px adjustable)
- HTML export with auto-naming

LOREKEEPER and CRIER are defined but dormant until their phase gates are met.
Do not activate them early just because their instruction files exist.
