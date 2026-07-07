# ForgeLoop Overnight Roadmap
_Goal: move from “working local prototype” to “production-ready autonomous product”._

## Phase 1 — Close Live Catalog
- [ ] Run `002_published_games.sql` against Supabase
- [ ] Seed initial published rows from manifest
- [ ] Make `/gallery`, `/`, `/landing` fetch from Supabase when available, falling back to `/games/manifest.json`

## Phase 2 — Payment/Credits
- [ ] Replace `/payment.html` with real purchase flow scaffolding
- [ ] Implement credit checks in generation flow
- [ ] Verify Edge Function `consume-credit` end-to-end

## Phase 3 — Production Hardening
- [ ] Deploy via `scripts/safe-deploy.sh`
- [ ] Verify public routes on live domain
- [ ] Add cache-purge step to deploy path

## Phase 4 — Team/3D Experience
- [ ] Make `/team.html` and `/3d-team.html` reactive to Hermes cron state
- [ ] Show offline/online transitions from `/ops-history.json`

## Phase 5 — Continuous Overnight Improvement
- [ ] Keep cron jobs healthy
- [ ] Expand game catalog daily
- [ ] Run security scan weekly
- [ ] Optimize public SEO assets
