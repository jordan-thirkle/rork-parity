# STYLE.md — RorkParity

Conventions for anything SMITH, LOREKEEPER, or CRIER produce. WHETSTONE enforces these
during review — a style violation in a core system is treated the same as a scope
violation: sent back, not waved through.

## Code (generated games)

- Single HTML file for `threejs`/`phaser` stack: inline `<script>`, CDN imports only, no
  build step, no bundler assumptions. Opening the file in a browser is the only
  requirement for it to run.
- Section headers as loud comments, uppercase, one per system:
  ```js
  // ============ COMBAT ============
  ```
  This is what lets refinements touch one system without regenerating the file.
- No dead code. No commented-out alternate implementations left in "for reference."
- No TODO comments inside a system listed in `scope_v1` — that's an incomplete system,
  not a note. TODOs are only acceptable inside `deferred` systems that are explicitly
  stubbed and labeled as such.
- Variable and function names describe game concepts, not implementation details:
  `playerHealth` not `hp1`, `spawnEnemyWave` not `doThing2`.
- Prefer primitive/procedural rendering (boxes, spheres, particles, flat colour) over
  missing-asset placeholders. Never reference an image/audio URL that hasn't been
  supplied by LOREKEEPER from the approved asset library.

## Godot path (only when stack is `godot-web`)

- Follow the same scene/script separation conventions as Glitchfront: 300-line soft cap
  per script file, UID sidecars committed, no logic in `_ready()` beyond wiring.

## Agent output format

- FORGEMASTER's spec is always valid JSON, no prose wrapper, no markdown fencing inside
  the object.
- WHETSTONE's pass/fail report is always: status line, patch diff (if any), one-line
  plain-English summary. No filler ("Great news! Everything looks good!") — just the
  three parts.
- CRIER's listing copy matches the existing ByJTT changelog voice: factual, terse, past
  tense for what shipped, no adjectives doing marketing work ("revolutionary",
  "seamless", "cutting-edge" are all banned words in generated copy).

## Naming

- Agent names (FORGEMASTER, SMITH, WHETSTONE, LOREKEEPER, CRIER) never appear in
  user-facing copy or in the published game listings. They're internal only — the user
  sees "your game was updated," not "SMITH regenerated the combat section."
- Project names default to what the user calls their game. Don't auto-invent a title
  unless asked.
