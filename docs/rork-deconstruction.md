# Rork.com — First-Principles Deconstruction
# Analysis Date: 2026-07-06

## 1. What Rork Actually Is

**Product category:** AI-powered mobile app builder (chat-to-production-app).
**Not a game platform.** Not a code playground. Not a prototyping tool.

Rork takes a natural language description and produces a *production-ready mobile app* that can be submitted to the App Store and Play Store. The output is real code (React Native/Expo, or native Swift/SwiftUI for Max tier), and the workflow covers the full lifecycle: idea → generate → preview on-device → iterate → publish.

## 2. Tier Structure (as of July 2026)

| Tier | Price | Output | Key Limitations |
|------|-------|--------|-----------------|
| Free | $0 | React Native / Expo | Very limited credits, basic models |
| Pro | ~$20–100/mo (credit packs) | React Native / Expo | More credits, better models |
| Max | **$200/mo** | Native Swift/SwiftUI + all Apple platforms | Best models (Fable 5, Opus 4.6, Claude Code), one-shot complex apps, auto App Store pages, AR/3D, marketing tools |
| Super Max | **$1,800/mo** | Everything | 10k credits/month, priority |

**Business model:** Credit-based consumption (generations, iterations, asset creation, publishing all cost credits). ~$20 per 100 credits is the rough rate.

## 3. Core Capabilities (Ranked by Differentiation)

### Tier 1: Table stakes (what any competitor must match)
- Natural language → working app in minutes
- React Native + Expo generation
- Iterative chat refinement
- On-device preview (Expo Go / Rork Companion)
- Project persistence
- Code export

### Tier 2: Differentiators
- **Native Swift/SwiftUI generation** (Max tier — real native code, not RN wrappers)
- **Browser-based iOS simulator** (no Xcode install needed for testing)
- **Multi-platform output from single prompt:** iOS, watchOS, iPadOS, tvOS, visionOS
- **Direct App Store submission pipeline** (2-click flow, auto-generates screenshots, icons, descriptions)
- **RevenueCat integration** (monetization baked in)
- **Website-to-mobile sync** (mirrors existing websites as native apps)

### Tier 3: Game-specific capabilities
- 3D worlds with physics (RealityKit + Metal)
- Multiplayer games
- AR / Vision Pro
- 60fps native performance

**Note:** Rork is NOT game-specialized — games are just one use case among many. Their game capabilities are impressive but general-purpose (same pipeline as any other app).

### Tier 4: Platform features
- Integrated backend (Supabase, Firebase, custom REST)
- App Store marketing assets generation
- Claude Code / Fable 5 model integration
- File uploads (images, assets)
- Community / guides / Discord

## 4. What Rork Does NOT Do (Gaps)

| Gap | Relevance to us |
|-----|-----------------|
| No web output (apps only) | We do web + mobile |
| No dedicated game-first workflow | Our PRIMARY focus |
| No Godot / Unity / Roblox generation | We can own this |
| No multiplayer hosting | We have games.byjtt.com |
| No leaderboard/social features | We have platform hooks |
| No AI-agent-driven orchestration | We have Hermes |
| No template library for games | We're building one |
| No instant web preview (requires device) | We do browser preview |
| No "playable URL to share" | Our games.byjtt.com does this |

## 5. UX / Design Philosophy

From rork.com's landing page and docs:

- **Minimalist, dark-themed Next.js app** with heavy glass-morphism UI.
- **Single input field** ("Describe the app you want to build…") — one-shot prompt or ongoing chat.
- **File upload support** in chat (Max 10MB free, 5GB paid).
- **Template quick-starts** ("Create a Multiplayer Game", "Create a 3D Game", "Lovable to Mobile App").
- **Model selector** visible in UI (Claude, Fable 5).
- **Credits displayed** prominently — usage-awareness by design.
- **Publishing pipeline** treated as first-class feature, not afterthought.

**Design takeaway:** Less "developer tool", more "product studio". The user is a "founder", not a "developer".

## 6. Technical Architecture (Inferred)

- **Frontend:** Next.js (RSC, Turbopack) — heavily chunked with R2 CDN
- **Backend:** Custom AI pipeline + Supabase integration
- **AI models:** Claude Opus, Fable 5, Claude Code — tier-gated
- **Mobile frameworks:** React Native + Expo (standard), Swift/SwiftUI (Max)
- **CDN:** R2 (Cloudflare)
- **Analytics:** Plausible, Facebook, TikTok, Snapchat
- **Toolkit CDN:** toolkit.rork.com (shared component/asset delivery)
- **Publishing:** Deep EAS / TestFlight integration
- **Auth:** Built-in auth + Supabase auth

## 7. Strategic Implications for RorkParity

### Where we're stronger
- **Web games** — instant play, no install, shareable URL. Rork doesn't do this.
- **Game specialization** — we can build game-specific templates, mechanics, and AI agents. Rork is general-purpose.
- **Platform integration** — games.byjtt.com is our distribution channel + social layer.
- **Agent orchestration** — Hermes-style multi-agent pipeline is more sophisticated than single-prompt generation.
- **Cost/iteration speed** — web-first means faster iteration than mobile compile cycles.
- **Godot/Roblox export** — dedicated game engine support Rork doesn't touch.

### Where we're weaker (need to close)
- **Mobile native output** — we need the Expo/RN path for parity
- **On-device preview** — Rork's companion app + Expo Go is smooth
- **App Store publishing pipeline** — we need at least guided export
- **Model quality** — Rork uses top-tier models (Claude Opus, Fable 5). We're on DeepSeek v4 (capable but different tier)
- **Maturity** — Rork has been iterating since early 2025. We're starting now.

### The winning angle
**Don't compete on general app building — dominate the game niche.**
- First web games (instant, playable, shareable)
- Then mobile export for those games (Expo/RN wrapper)
- Then Godot/Roblox expansion
- Keep the chat-to-game pipeline tighter than anything Rork offers for general apps

## 8. Rork Max's Real Moat: Cloud Mac Fleet

The `/max` page reveals their core infrastructure:

- **Fleet of Macs running 24/7** — when you send a message, one becomes yours loaded with Xcode + iOS SDK
- **Real SwiftUI compilation** on real Apple hardware, not simulated
- **Streamed iOS Simulator** in the browser using FaceTime-protocol low-latency streaming
- **Autonomous fix loop**: AI writes code → hits Build → reads errors → fixes → rebuilds. Human-level iteration at machine speed
- **No Xcode install or $99 fee needed** for preview — but real Apple Developer account required for App Store submission
- **Single-click App Store submissions** after initial Apple ID sign-in
- **Cross-Apple-platform**: iPhone, iPad, Watch, TV, Vision Pro, iMessage — all from one prompt

**Strategic takeaway:** We cannot (and should not) replicate the cloud Mac fleet. That's a funded-infrastructure play. Our counter-move:

1. **Web-first, instant play** — no install, no compile, no Apple tax. Shareable URL > Simulator.
2. **Godot/Roblox export** — reach game platforms Apple doesn't control.
3. **Mobile via Expo/RN** — generate standalone projects users can build locally or via EAS.
4. **Game-specific depth** — better templates, better mechanics, better agent pipeline for games.

## 9. Immediate Action Items for Our Phase 1

1. **Our chat UI is the right direction** — single input, file uploads, model awareness ✓
2. **We need quick-start templates** — Rork has them ("Create a Multiplayer Game") — we need "Create a 2D Brawler", "Create an Idle RPG"
3. **Our preview is web-first** — correct for our niche
4. **Deferred features** should explicitly call out mobile/App Store as Phase 3-4
5. **Agent pipeline** (FORGEMASTER → SMITH → WHETSTONE) is our differentiator — Rork doesn't have visible multi-agent orchestration
