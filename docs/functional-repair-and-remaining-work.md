# ForgeLoop — Functional Repair & Remaining Work
_Completed: 2026-07-07_
_Working base: `localhost:8888` serving `app/`_

## What’s now working
- All public routes return HTTP 200:
  - `/`, `/index.html`, `/workspace.html`, `/gallery.html`, `/team.html`, `/roadmap.html`, `/landing.html`, `/payment.html`, `/3d-team.html`
  - `/games/zone-brawler-v1.html`, `/games/auto-20260706-medieval-castle-defense.html`
  - `/status.json`, `/ops-history.json`, `/robots.txt`, `/sitemap.xml`
  - static assets: `style.css`, `app.js`, `chat.js`, `preview.js`, `supabase.js`, `api.js`
- Dead-link sweep: 0 unresolved bad internal links across checked routes
- Branding enforced:
  - removed `RorkParity`, `rork-parity.vercel.app`, and `games.byjtt.com` from public-facing surfaces
  - public brand is now `ForgeLoop` with build-phase domain `forgeloop.byjtt.com`
- Internal canonical naming:
  - repo/docs/agents may still use `RorkParity` as internal codename/namespace
- Ops/autonomy surface:
  - `app/status.json` and `app/ops-history.json` reflect active cron/gateway state
  - 12+ Hermes cron jobs scheduled under ForgeLoop naming
- Squashed broken server behavior and pinned working local dev port/scripts to `8888`

## Remaining Gaps / Current Incomplete Work
1. **Live Supabase-backed catalog**
   - migration file created: `supabase/migrations/002_published_games.sql`
   - local/ gallery pages can read catalog manifest
   - missing: actual Supabase publish flow + verified real-time query path in production
2. **Payment/credits flow**
   - scaffold exists at `/payment.html`
   - missing: checkout integration, credit balance enforcement, purchase completion flow
3. **Production deployment verification**
   - local serving works; production deploy path exists but is not yet verified live
4. **3D team view completeness**
   - page exists at `/3d-team.html`
   - missing: real Hermes agent online/offline state visualized, not just text status
5. **Workspace auth readiness**
   - Supabase client scaffold exists
   - missing: verified public-safe auth/config gate and clean fallback if unconfigured
6. **Asset polish**
   - no `favicon.ico`; minimal OG assets
7. **Security/cron hygiene**
   - security scan false-positive patterns partly tamed; continuous review needed

## Parity Notes vs. Rork-like Product
- Functional site foundation: done
- Autonomous operation: done
- Public branding + distribution domain clarity: done
- Live user-facing catalog + payment: not yet
- Stable production URL + publishing workflow: not yet
