# Agent Pipeline — FORGEMASTER → SMITH → WHETSTONE

This document defines how the ForgeLoop agent pipeline executes in the Hermes session.
Unlike the `.opencode/` files (which target an OpenCode-style agent), this is the
**live Hermes implementation** driving Phase 1.

## Pipeline stages

Each stage is a Hermes agent role. In Phase 1, I (the Hermes agent in the rork-parity
profile) perform all roles sequentially.

```
User request → FORGEMASTER (plan) → SMITH (generate) → WHETSTONE (validate) → User sees result
```

### FORGEMASTER — Planner

**Input:** Natural language game description from user.

**Output:** Structured JSON spec:
```json
{
  "project_name": "string",
  "genre": "string",
  "core_loop": "one-paragraph addictive loop description",
  "systems": ["combat", "leveling", "zones", "..."],
  "stack": "threejs | phaser | canvas-2d | godot-web",
  "template_match": "template name or null",
  "scope_v1": ["only what ships in this pass"],
  "deferred": ["explicitly cut features, stated as tradeoffs"]
}
```

**Rules:**
- Always bias toward smallest coherent v1.
- Explicitly defer anything not in scope — user sees tradeoffs.
- If a matching template exists in `templates/manifest.json`, set `template_match`.
- NEVER write code yourself — pass to SMITH.

### SMITH — Generator

**Input:** Spec JSON from FORGEMASTER, optionally a template from LOREKEEPER.

**Output:** Single-file HTML game (or Godot project skeleton for `godot-web` stack).

**Rules:**
- Implement ONLY `scope_v1`. Nothing from `deferred`, even "easy" things.
- Use section headers (`// ============ COMBAT ============`) for every system.
- For `canvas-2d` stack: vanilla Canvas2D, no external deps.
- For `threejs` stack: Three.js via CDN, single HTML file.
- For `phaser` stack: Phaser 3 via CDN, single HTML file.
- On refinements: ONLY touch implicated sections. Do not regenerate untouched systems.
- Output: complete file + changelog of what was changed.

### WHETSTONE — Validator

**Input:** Code output from SMITH.

**Output:** `{ passed: bool, summary: string, patch?: string }`

**Rules:**
- Check: syntax errors, undefined references, runtime crash potential, scope creep.
- If error found: produce minimal patch (not full rewrite). Loop max 3 times.
- On 3rd failure: surface plain-English blocker. Do not attempt 4th patch.
- Style violations = functional bugs per STYLE.md.
- Never approve TODO comments in `scope_v1` systems.

## Template Path

When `template_match` is non-null in the FORGEMASTER spec:

1. Check `templates/manifest.json` for the template.
2. Read the template file.
3. SMITH starts from that template instead of generating from scratch.
4. SMITH applies only the `scope_v1` changes on top.

## File output convention

Generated games are written to `D:/Projects/rork-parity/app/games/`.
The most recent generation is symlinked/updated in the preview pane.

## Refinement flow

When a user follows up on an existing project:

1. FORGEMASTER produces a diff spec (what changes, what stays).
2. SMITH locates the specific section headers and patches only those.
3. WHETSTONE validates only the changed sections.
4. If codebase inconsistency is found, WHETSTONE can ask FORGEMASTER for a broader diff.
