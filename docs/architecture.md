# Architecture & Decisions

## Stack choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Chat UI | Plain HTML/CSS/JS | Zero build step, matches SOUL.md constraint |
| Preview | Sandboxed iframe + Blob URL | Security isolation, no server needed for Phase 1 |
| Game rendering | Canvas2D (default), Three.js CDN, Phaser CDN | No build step for the game either |
| Template format | Single HTML file | Open in browser, no bundler assumed |
| Agent execution | Hermes session (this agent) | No server needed for Phase 1 MVP |

## Why no framework

The SOUL.md is explicit: "opening the file in a browser is the only requirement for it
to run." A React/Vite/Astro app would need a build step and dev server. Phase 1 should
ship a working thing first.

## Future framework migration

When Phase 2 activates (projects, auth, persistence), the app will need a backend.
The plan is:
- Replace `app/` with a Next.js app (more reliable on Windows than Astro per experience)
- Use Supabase for auth, DB, storage
- Keep the chat UI components from the ByJTT UI Kit
- Game generation still produces single HTML files with no build step

## Publishing target

`forgeloop.byjtt.com` is the destination. Current structure (to be confirmed when CRIER
activates):
- Static site hosting (Vercel or Cloudflare Pages)
- Each game gets its own path: `forgeloop.byjtt.com/games/<game-slug>/`
- Game assets served alongside the HTML file
- Auto-generated listing with title, description, genre tag

## Asset policy

All game graphics are procedural (shapes, particles, colors). No external sprite/images
unless from CC0 library (Kenney, OpenGameArt.org).
No copyrighted assets ever — this is absolute per SOUL.md.
