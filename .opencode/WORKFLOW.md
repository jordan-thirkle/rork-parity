# WORKFLOW.md — RorkParity Phase Gates

Agents are specced up front (see .opencode/agents/) but only activated as gates are met.
This file is the single source of truth for what's currently live. Update the "Active
phase" line in CONTEXT.md whenever a gate is crossed.

| Phase | What ships | Gate to activate | Agents live |
|---|---|---|---|
| **1. Core chat + web gen** | Chat → single-file web game, live preview, iterate | Always on | FORGEMASTER, SMITH, WHETSTONE |
| **2. Projects + credits** | Saved projects, history, basic usage tracking | Phase 1 used across ≥3 real sessions with real games | + Supabase schema, dashboard UI |
| **3. Template library** | Reusable starter templates across genres | ≥2 genres independently validated in Phase 1 | LOREKEEPER activates |
| **4. Publishing** | One-click package + listing to games.byjtt.com | First project the user actually wants live | CRIER activates |
| **5. Mobile export (RN/Expo)** | Generate Expo project, QR preview | Explicit user demand — not a default assumption | New agent: FLETCHER (not yet specced — write its instructions when this gate is actually reached, not before) |
| **6. Native/cloud build parity** | SwiftUI, cloud Xcode, streamed simulator | Only if Phase 5 sees real use and is explicitly requested | Out of scope for this profile — revisit as a separate initiative when reached |

## Why gates exist

Rork has a funded team building all six phases in parallel. This profile doesn't have
that, and pretending otherwise by pre-building Phase 5/6 tooling burns effort on
capabilities nobody's used yet. Every phase gate requires evidence from real usage of
the previous phase, not just "it seems like the next logical step."

## Bug tracking

Use BUG_REGISTRY.md following the same convention as Glitchfront. One entry per
confirmed bug, ID format `RP-001`, `RP-002`, etc. WHETSTONE-caught-and-fixed issues don't
need registry entries unless they recur across 3+ generations — that pattern indicates a
systemic prompt/instruction problem worth tracking, not a one-off.
