#!/bin/bash
# RorkParity SEO Generator
# Usage: bash scripts/seo-generate.sh

set -euo pipefail

cd /d/Projects/rork-parity

echo "[seo] $(date) — generating SEO assets"

mkdir -p publish

# Sitemap for existing static site
cat > publish/sitemap.xml <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://rork-parity.vercel.app/</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rork-parity.vercel.app/workspace</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rork-parity.vercel.app/gallery</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://rork-parity.vercel.app/team</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://rork-parity.vercel.app/roadmap</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>0.7</priority>
  </url>
EOF

for game in app/games/*.html; do
  [ -f "$game" ] || continue
  name=$(basename "$game" .html)
  [[ "$name" == ".gitkeep" ]] && continue
  cat >> publish/sitemap.xml <<EOF
  <url>
    <loc>https://rork-parity.vercel.app/games/${name}.html</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <priority>0.6</priority>
  </url>
EOF
done

echo "</urlset>" >> publish/sitemap.xml
echo "[seo] sitemap: $(wc -l < publish/sitemap.xml) lines"

cat > publish/robots.txt <<EOF
User-agent: *
Allow: /
Sitemap: https://rork-parity.vercel.app/sitemap.xml
EOF
echo "[seo] robots.txt written"

python - <<'PY'
import json, pathlib
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'SEO':
        a['status'] = 'online'
        a['detail'] = 'Generated sitemap + robots'
        a['last_run'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'SEO',
        'role': 'sitemap, robots, OG meta',
        'schedule': 'daily 9am',
        'status': 'online',
        'detail': 'Generated sitemap + robots',
        'last_run': __import__('datetime').datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

echo "[seo] Done — $(date)"
exit 0
