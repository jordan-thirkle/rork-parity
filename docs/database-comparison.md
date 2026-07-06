# Database & Backend Comparison for RorkParity
## July 2026 — Free Tier Analysis

### Our Requirements (ranked)
| Need | Priority | Why |
|------|----------|-----|
| **Auth (built-in)** | P0 | User accounts, project ownership, credit tracking |
| **File/asset storage** | P0 | Generated game HTML files need hosting/serving |
| **Project metadata DB** | P0 | Game specs, configs, user data — small records |
| **Free tier longevity** | P0 | Must stay $0 until meaningful traffic |
| **Serverless functions** | P1 | Game backend APIs, webhooks, credit operations |
| **Scaling cost predictability** | P1 | Prevent surprise bills |
| **Real-time / multiplayer** | P2 | Future collaboration, live game state sync |
| **AI vector search** | P3 | Future: semantic template search |

---

### The Candidates

| Feature | Supabase | Turso + CF Workers | Neon + Vercel | Cloudflare D1 + Workers |
|---------|----------|-------------------|---------------|------------------------|
| **Type** | Postgres + Backend-as-a-Service | Edge SQLite | Serverless Postgres | Edge SQLite |
| **Free DB** | 500MB, 2 projects | 5GB, 100 DBs | 500MB, 100 projects | 5GB, ~10 DBs |
| **Free reads** | ~5GB transfer/mo | 10M rows/month | 50 compute hrs/project | 5M reads/day (150M/mo) |
| **Free writes** | Included in compute | Included | Included | 100K writes/day |
| **Built-in Auth** | **Yes** — Supabase Auth | No (DIY) | No (DIY) | No (DIY) |
| **File Storage** | **Yes** — 1GB free | No (use R2/S3) | No (use S3) | **Yes** — R2, 10GB free |
| **Serverless Funcs** | **Yes** — Edge Functions | CF Workers | Vercel Functions | **Yes** — Workers |
| **Real-time** | **Yes** — Realtime Subscriptions | No (DIY WebSockets) | No | No (Durable Objects) |
| **Credit card req?** | No | No | No | No |
| **Pivot risk** | Low (stable, well-funded) | Medium (pivoted 2025, staff cuts) | Low (well-funded) | Low (Cloudflare stable) |

---

### Cost Scaling (when free tier outgrown)

| Service | Entry paid | Scale cost pattern | Gotcha |
|---------|-----------|-------------------|--------|
| **Supabase** | $25/mo Pro (1 project) | ~$25 + $10/project + egress | Egress is expensive — biggest bill shock source |
| **Turso** | $5/mo Hobby (unlimited DBs) | Usage-based, $0.03/GB reads | Pivot risk, less ecosystem |
| **Neon** | $19/mo Launch | Compute-based, $0.10/hr | Compute hours burn fast under constant load |
| **Cloudflare** | $5/mo Workers Paid | Purely usage, zero egress | Hard budget cap only on some services |

---

### RorkParity Fit Score

| Criterion | Supabase | Turso+CF | Neon+Vercel | CF D1+Workers |
|-----------|----------|----------|-------------|---------------|
| Auth built-in | ✅✅ | ❌ | ❌ | ❌ |
| File storage built-in | ✅✅ | ❌ (+R2) | ❌ (+R2/S3) | ✅✅ (R2) |
| Free tier generous enough for MVP | ✅ | ✅ | ⚠️ (50hrs) | ✅✅ |
| Real-time | ✅✅ | ❌ | ❌ | ⚠️ (Durable Obj) |
| Serverless functions | ✅ | ✅ (Workers) | ✅ (Vercel) | ✅ |
| No pivot risk | ✅ | ⚠️ | ✅ | ✅ |
| Predictable scaling | ⚠️ (egress) | ✅ | ⚠️ (compute) | ✅ |
| **Total** | **Strong** | **Good (multi-service)** | **Good** | **Strong** |

---

### Recommendation: Supabase first — then evaluate

**Phase 2:** Supabase — best single-vendor fit:
- Auth, storage, DB, real-time, serverless in one platform
- 500MB DB + 1GB storage + 2 projects free — enough for MVP
- No credit card needed
- Fastest path to working backend

**Escape hatch:** If Supabase bills become a problem at moderate scale, migrate to:
- **Database:** Neon or Turso (Postgres-compatible or SQLite)
- **Auth:** Clerk, Lucia, or NextAuth
- **Storage:** R2 (zero egress)
- **Functions:** CF Workers or Vercel

**Why not all-in on Cloudflare:**
- D1's free reads are insane (5M/day) but no built-in auth or real-time
- Auth is a significant build cost we don't need yet
- Better to have one backend to start

**Recommendation:** Start with Supabase. Build the auth + project storage + credit system there.
If Supabase bills grow painful at scale, the data is in Postgres — portable to Neon or any
Postgres-compatible host.

### Decision: Supabase Free Tier for Phase 2
- **Up to 2 active projects** (1 dev + 1 staging)
- **500MB database** — enough for thousands of game project records
- **1GB file storage** — hundreds of generated HTML games
- **Built-in auth** — email + OAuth (Google/GitHub)
- **Edge Functions** — for credit tracking, export APIs
- **Realtime** — for future live collaboration
- **Zero cost** until we need Pro
