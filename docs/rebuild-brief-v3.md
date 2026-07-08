# RorkParity — Rebuild Brief v3
## Target: Exact feature/design parity with rork.com

### Research findings — what rork.com actually ships
- Chat-first AI builder with file uploads: free tier max 10MB, paid up to 5GB
- Real native apps, not web wrappers:
  - Pro: React Native + Expo (iOS/Android/Web)
  - Max: SwiftUI native iOS/iPadOS/watchOS/Vision Pro
- 3D worlds with real physics, multiplayer games — natively at 60fps
- Device preview via Expo Go / Simulator streaming
- App Store and Play Store publishing
- Code export and GitHub sync
- Credits, subscriptions, RevenueCat payments
- Supabase/Firebase auth and backend
- OpenAI/voice/image integrations
- Figma import, Google Sheets/Airtable/Notion integrations
- Teams/collaboration, version history/restore
- Multiple AI models, web search in chat
- Documentation, Discord, support

### Hard product constraints
- Public brand is **RorkParity** under ByJTT.
- We do not copy Rork’s code/assets. We match functionality and UX pattern.
- No copyrighted assets, music, or branding.
- Static deploy target remains Vercel for the web surface; app generation targets Expo/React Native + optional SwiftUI via cloud toolchain.

### Exact parity requirements
1. Chat-first builder with drag/drop uploads
2. Native export: Expo/React Native for Pro, SwiftUI for Max tier
3. 3D templates with physics at 60fps
4. Multiplayer templates with matchmaking
5. Real billing: Stripe + credit enforcement
6. Auth: Supabase email + OAuth
7. GitHub export/sync
8. Device preview: Expo Go QR + web fallback
9. Team workspaces with roles
10. Version history with restore

### Rebuild architecture
| Layer | Choice | Reason |
|---|---|---|
| Web surface | Next.js 16 on Vercel | Matches rork.com stack, SSR, fast |
| App engine | AI prompt → scaffolded Expo/React Native project | Real native output |
| Native tier | EAS Build + optional cloud Xcode for SwiftUI | App Store/Play distribution |
| Preview | Expo Go + web preview fallback | Instant test, then device install |
| Auth | Supabase Auth | Already scaffolded |
| Database | Supabase Postgres | Projects, versions, assets, credits |
| Storage | Supabase Storage + R2 fallback | Asset uploads |
| Payments | Stripe | Credits, subscriptions, webhooks |
| AI | Multi-model via Hermes + hosted providers | Switchable models in chat |
| Backend functions | Supabase Edge Functions + Cloudflare Workers | Serverless, secrets safe |
| GitHub | GitHub App OAuth + repo creation | Code export/import |
| CI | GitHub Actions | Build/test/publish pipelines |

### Phase 0 — Foundation (Week 1) IN PROGRESS
**Goal:** Replace the web-game toy with a real app-builder skeleton.
- [x] Initialize Next.js 16 app in `next/` with routing
- [x] Install shared UI kit: Tailwind, shadcn/ui, motion
- [ ] Wire Supabase auth scaffold with email + OAuth
- [ ] Wire Stripe checkout scaffold with webhook handler
- [ ] Create project schema: `projects`, `versions`, `assets`, `credits`, `team_members`
- [ ] Create `generators/` package with:
  - Prompt parser
  - Expo project scaffolder
  - SwiftUI project scaffolder (optional, cloud only)
  - Asset injector
- [ ] Replace old static HTML with Next.js components
- [ ] Deploy preview to Vercel

**Owner:** FORGEMASTER
**Daily cron:** scaffold review + dependency audit

### Phase 1 — Core chat + generation (Week 2-3)
**Goal:** Match Rork’s primary UX: chat + generate + preview.
- [ ] Chat UI with:
  - Text input + file drag/drop
  - Quick-start prompts
  - Model selector
  - Attachment previews
- [ ] Agent pipeline:
  - FORGEMASTER: prompt interpretation, architecture decisions
  - SMITH: code generation, file writing
  - WHETSTONE: UI/UX validation, contrast, polish
  - LOREKEEPER: docs, schema, consistency
  - CRIER: packaging, validation, release prep
- [ ] Generation output:
  - Expo/React Native project structure
  - `app.json`, `package.json`, navigation, screens
  - Basic components from prompt
- [ ] Preview:
  - Web preview via Expo web
  - QR code for Expo Go
  - Device frame toggle
- [ ] State management: project, version, credits, chat history

**Owner:** SMITH + FORGEMASTER
**Daily cron:** generation smoke test + preview validation

### Phase 2 — Native + 3D + multiplayer (Week 4-5)
**Goal:** Match Rork’s headline differentiators.
- [ ] 3D templates:
  - Expo Three.js / React Three Fiber
  - SceneKit SwiftUI bridge
  - Physics: Cannon.js / Rapier
- [ ] Multiplayer templates:
  - WebRTC data channels
  - Colyseus server scaffold
  - Matchmaking UI
- [ ] Performance budget:
  - 60fps target tracking in preview
  - Bundle size warnings
- [ ] Native capabilities:
  - Camera, gyroscope, haptics
  - Push notifications scaffold
  - HealthKit/HomeKit stubs for Max tier

**Owner:** WHETSTONE + SMITH
**Daily cron:** template validation + performance benchmark

### Phase 3 — Publishing + integrations (Week 6-7)
**Goal:** Ship to App Store / Play Store, match integrations.
- [ ] EAS Build integration:
  - Auto-build on generation
  - AAB/IPA artifacts
  - Install profiles
- [ ] Store publishing:
  - App Store Connect API scaffold
  - Play Console upload
  - Metadata generation
- [ ] Integrations:
  - Supabase auth + database
  - Firebase config generator
  - OpenAI API injection
  - RevenueCat scaffold
  - Apple Sign In
  - Google Sheets/Airtable/Notion API wrappers
- [ ] GitHub sync:
  - OAuth flow
  - Repo creation
  - Two-way sync

**Owner:** CRIER + LOREKEEPER
**Daily cron:** integration smoke tests + auth flow check

### Phase 4 — Teams + billing + polish (Week 8)
**Goal:** Match Rork’s collaboration and business layer.
- [ ] Teams/workspaces:
  - Invite by email
  - Shareable links
  - Editor/viewer roles
- [ ] Version history:
  - Auto-save versions
  - Restore/compare
  - Branch naming
- [ ] Billing:
  - Credit enforcement
  - Subscription tiers
  - Usage tracking
  - Invoice generation
- [ ] Support/docs:
  - Docs site
  - Discord bot scaffold
  - In-app help
- [ ] SEO/performance:
  - Lighthouse budget
  - OG/schema
  - Sitemap/robots

**Owner:** LOREKEEPER + FORGEMASTER
**Daily cron:** billing audit + support queue review

### Success metrics
- Every prompt produces a valid Expo project that runs in Expo Go
- 3D templates maintain 60fps on mid-range devices
- Multiplayer templates connect 2 players in <5s
- App Store publish flow completes end-to-end
- GitHub export produces a clean, buildable repo
- Credit system enforces usage without blocking happy path
- Public pages score 90+ Lighthouse all categories
