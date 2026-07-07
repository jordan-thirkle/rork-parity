# RorkParity — Full-Stack QA & Launch Checklist

## Purpose
This is the single source of truth for release readiness. Every section must be
checked before any public claim of “live/production-ready” is made.

## How to use
1. Audit each section against the current codebase and live deployment.
2. Mark items as PASS / FAIL / DEFER.
3. For every FAIL, create a fix task with owner, target commit, and verification step.
4. Re-run this checklist after every significant change.

---

## 1. Frontend — Public Pages

### 1.1 HTML/CSS correctness
- [ ] All pages return valid HTML5 structure
- [ ] No broken internal links (404s on any route)
- [ ] Consistent navigation across all pages
- [ ] Branding/name consistency: RorkParity everywhere, no stale legacy names
- [ ] Meta tags present: title, description, og:title, og:description, og:url, canonical
- [ ] Language attribute set (`<html lang="en">`)
- [ ] Viewport meta present
- [ ] Favicon present
- [ ] No console errors in browser devtools

### 1.2 UX/UI
- [ ] Loading states for async content
- [ ] Empty states are helpful
- [ ] Error states are actionable
- [ ] Mobile responsive (breakpoints tested)
- [ ] Touch targets >= 44x44px
- [ ] Color contrast meets WCAG AA
- [ ] Focus states visible for keyboard users
- [ ] No text overflow or horizontal scroll on mobile
- [ ] Consistent spacing and typography scale

### 1.3 Performance
- [ ] Lighthouse performance score >= 90
- [ ] Lighthouse accessibility score >= 90
- [ ] Lighthouse best practices score >= 90
- [ ] Lighthouse SEO score >= 90
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s
- [ ] Cumulative layout shift < 0.1
- [ ] Images optimized/compressed
- [ ] No unused CSS/JS in critical path
- [ ] Font loading optimized (preload, swap)

### 1.4 Security
- [ ] HTTPS enforced (HSTS, no mixed content)
- [ ] Content Security Policy set
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options configured appropriately
- [ ] No sensitive data exposed in frontend code
- [ ] No eval() or unsafe inline scripts in public pages
- [ ] External scripts use SRI or come from trusted CDNs

### 1.5 SEO
- [ ] Sitemap.xml present and valid
- [ ] Robots.txt present and correct
- [ ] All public pages discoverable
- [ ] Structured data where appropriate
- [ ] Open Graph images/tags for major pages
- [ ] No duplicate content
- [ ] Clean URL structure

---

## 2. Frontend — Workspace/Builder

### 2.1 Core functionality
- [ ] Chat input accepts text and file uploads
- [ ] Quick-start templates trigger generation
- [ ] Generation produces a preview in iframe
- [ ] Preview loads blob URLs and external game files
- [ ] Viewport switching works (desktop/mobile/tablet/VR)
- [ ] Refresh preview works
- [ ] Open in new tab works
- [ ] QR modal opens and shows URL
- [ ] Export game downloads HTML file
- [ ] Deferred features modal shows when needed
- [ ] Auth modal opens and closes
- [ ] Plan mode toggle works

### 2.2 State management
- [ ] State.js initializes without errors
- [ ] State persists across UI actions
- [ ] State resets on new project
- [ ] No memory leaks from blob URLs
- [ ] No stale references after generation

### 2.3 Agent log
- [ ] Agent log shows FORGEMASTER/SMITH/WHETSTONE/LOREKEEPER/CRIER entries
- [ ] Agent log scrolls to bottom on new entries
- [ ] Clear log button works
- [ ] Log entries have timestamps

### 2.4 Explorer
- [ ] Explorer shows generated files
- [ ] Explorer groups by type
- [ ] Explorer icons correct per file type
- [ ] Explorer updates after generation

### 2.5 Bridge
- [ ] Bridge listens for postMessage
- [ ] Bridge handles FPS updates
- [ ] Bridge handles errors from iframe
- [ ] Bridge injects interceptors when possible
- [ ] Bridge degrades gracefully on cross-origin

### 2.6 Supabase integration
- [ ] Supabase client initializes
- [ ] Auth modal shows when not configured
- [ ] Sign up works
- [ ] Sign in works
- [ ] Google OAuth works (if enabled)
- [ ] Projects list loads
- [ ] Project creation works
- [ ] Credit balance displays
- [ ] Credit consumption works
- [ ] Version save works
- [ ] Error handling for all Supabase calls

---

## 3. Backend / API

### 3.1 Supabase
- [ ] Project linked correctly
- [ ] Migrations up to date
- [ ] Tables exist: profiles, game_projects, game_versions, assets, leaderboard_entries
- [ ] RLS policies configured
- [ ] Auth triggers working (handle_new_user)
- [ ] Edge Function consume-credit deployed
- [ ] Storage buckets configured
- [ ] Row-level security tested

### 3.2 Vercel deployment
- [ ] vercel.json routes correct
- [ ] Clean URLs work
- [ ] Redirects work (/workspace, /gallery)
- [ ] Static files served correctly
- [ ] No 404s on any known route
- [ ] Deployment succeeds on push
- [ ] Preview deployments work (if configured)

### 3.3 GitHub
- [ ] Remote configured
- [ ] All branches pushed
- [ ] Tags present if needed
- [ ] README accurate
- [ ] LICENSE file present

### 3.4 Scripts/jobs
- [ ] autopilot.sh runs without errors
- [ ] seo-generate.sh runs
- [ ] auto-generate.sh runs
- [ ] weekly maintenance runs
- [ ] credibility-monitor.sh runs
- [ ] server-watchdog.sh runs
- [ ] All cron jobs registered and executing

---

## 4. Content & Documentation

### 4.1 Public content
- [ ] Landing page copy accurate
- [ ] Team page shows all roles
- [ ] Roadmap is current
- [ ] Gallery has fallback content
- [ ] No broken images
- [ ] No placeholder text in production

### 4.2 Developer docs
- [ ] README.md accurate and current
- [ ] AGENTS.md present if needed
- [ ] docs/agent-pipeline.md reflects actual flow
- [ ] docs/rork-deconstruction.md current
- [ ] CHANGELOG.md maintained
- [ ] Code comments clear and accurate

### 4.3 Legal/brand
- [ ] Copyright notice present
- [ ] Privacy policy link (if collecting data)
- [ ] Terms of service (if applicable)
- [ ] Brand assets used correctly

---

## 5. Testing & Verification

### 5.1 Manual testing
- [ ] All pages load without errors
- [ ] All links work
- [ ] All buttons/forms submit correctly
- [ ] File upload works
- [ ] Generation works for all template types
- [ ] Preview renders correctly
- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works

### 5.2 Automated testing
- [ ] No console errors on page load
- [ ] No network errors in devtools
- [ ] All scripts load successfully
- [ ] No 404s in network tab
- [ ] No mixed content warnings

### 5.3 Cross-browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if possible)
- [ ] Mobile Safari
- [ ] Chrome Mobile

---

## 6. Monitoring & Ops

### 6.1 Health checks
- [ ] Autopilot reports server running
- [ ] Templates validate
- [ ] Supabase syncs
- [ ] No unhandled errors in scripts

### 6.2 Logs
- [ ] Agent logs visible in workspace
- [ ] Server logs accessible
- [ ] Error logs captured
- [ ] No sensitive data in logs

### 6.3 Alerts
- [ ] Cron failures would be noticed
- [ ] Server downtime would be detected
- [ ] Database errors would be caught

---

## 7. Standards & Principles

### 7.1 Code quality
- [ ] No console.log in production code
- [ ] No debugger statements
- [ ] Consistent formatting
- [ ] Meaningful variable/function names
- [ ] No magic numbers
- [ ] Error handling present
- [ ] No unused code

### 7.2 Web standards
- [ ] Valid HTML5
- [ ] Valid CSS
- [ ] Valid JS (no syntax errors)
- [ ] WCAG 2.1 AA compliance
- [ ] Semantic HTML where appropriate
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works

### 7.3 Performance
- [ ] Minimal bundle size
- [ ] Lazy loading where appropriate
- [ ] Caching headers set
- [ ] CDN used for static assets
- [ ] Images optimized
- [ ] Fonts optimized

### 7.4 Security
- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting (if applicable)
- [ ] Secrets not in frontend code
- [ ] Dependencies up to date

---

## 8. Business/SaaS

### 8.1 Monetization
- [ ] Credits system works
- [ ] Credit balance displays
- [ ] Credit consumption works
- [ ] Payment flow works (if implemented)
- [ ] No free-tier abuse vectors

### 8.2 User experience
- [ ] Onboarding clear
- [ ] Empty states helpful
- [ ] Error messages actionable
- [ ] Success feedback present
- [ ] Loading states present
- [ ] No dead ends

### 8.3 Analytics
- [ ] Analytics tracking configured
- [ ] Events tracked appropriately
- [ ] No PII in analytics
- [ ] Privacy-compliant

---

## 9. Deployment

### 9.1 Vercel
- [ ] Production deployment successful
- [ ] Preview deployments work
- [ ] Environment variables set
- [ ] Domain configured (if applicable)
- [ ] SSL certificate valid

### 9.2 GitHub
- [ ] Repo public/private as intended
- [ ] README renders correctly
- [ ] Issues/discussions enabled (if needed)
- [ ] Actions/CI configured (if needed)

### 9.3 Supabase
- [ ] Project accessible
- [ ] Auth working
- [ ] Database queries working
- [ ] Edge functions deployed
- [ ] Storage accessible

---

## 10. Known Limitations / Deferred

### 10.1 Documented limitations
- [ ] Mobile native export deferred
- [ ] Advanced multiplayer deferred
- [ ] 3D physics complexity deferred
- [ ] All limitations stated plainly to user

### 10.2 Future work visible
- [ ] Roadmap page shows next steps
- [ ] Team page shows collaboration model
- [ ] No hidden features
