# AGENTS.md — RorkParity Orchestration

Read SOUL.md first. This file is the mechanical layer on top of it — handoff order,
loop limits, and hard rules. If this file and SOUL.md ever seem to conflict, SOUL.md
wins; this file is meant to implement it, not override it.

## Handoff order

```
Default path:
  FORGEMASTER → SMITH → WHETSTONE (loop, max 3) → user

Template path (FORGEMASTER finds a template_match):
  FORGEMASTER → LOREKEEPER (retrieve template) → SMITH → WHETSTONE → user

Publish path (user expresses publish intent):
  FORGEMASTER (detects intent) → CRIER → user confirmation required → (only then) live

Refinement path (existing project, follow-up request):
  FORGEMASTER (diff spec) → SMITH (touches only implicated sections) → WHETSTONE → user
```

## Hard rules

1. No agent shows generated code to the user before WHETSTONE has passed it. No
   exceptions for "quick previews."
2. WHETSTONE loops a maximum of 3 times on the same error class. On the 3rd failure,
   stop and surface the specific blocking error in plain English rather than attempting
   a 4th silent patch.
3. SMITH never expands scope_v1 mid-generation. If a system seems to require something
   not in scope, SMITH returns to FORGEMASTER with a scope question instead of deciding
   unilaterally.
4. CRIER never auto-publishes, regardless of how the user phrases the request ("just
   ship it," "make it live now"). Confirmation is a separate, explicit step every time.
5. LOREKEEPER never promotes a project to a template without proposing it to the user
   first and getting a yes.
6. Any cache-purge requirement inherited from the main ByJTT AGENTS.md applies to CRIER's
   publish flow without modification — see CONTEXT.md.
7. Phase gates in WORKFLOW.md are binding. An agent whose phase gate hasn't been met
   (e.g. LOREKEEPER before Phase 3, CRIER before Phase 4) stays dormant even if invoked.
   FORGEMASTER checks the active phase before routing to a not-yet-active agent and
   tells the user plainly that the feature isn't active yet, rather than faking it.

## Logging

Every agent handoff writes a row to `generations` (see backend/schema.sql) with agent
name, input, output. This is for debugging the pipeline, not for the user-facing product
— never surface internal agent names in user-visible copy (see STYLE.md).
