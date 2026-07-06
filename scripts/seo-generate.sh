#!/bin/bash
# RorkParity SEO Optimizer — generates sitemaps, OG tags, structured data
# Runs after new game generation and on daily cron
# Usage: bash scripts/seo-generate.sh

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

echo "[seo] $(date) — Generating SEO assets"
mkdir -p publish

# === SITEMAP.XML ===
SITEMAP="publish/sitemap.xml"
BASE_URL="https://forgeloop.byjtt.com"
TIMESTAMP=$(date -u +%Y-%m-%d)

cat > "$SITEMAP" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TIMESTAMP}</lastmod>
    <priority>1.0</priority>
  </url>
EOF

# Add each template as a game page
for tmpl in templates/*.html; do
  if [ -f "$tmpl" ]; then
    name=$(basename "$tmpl" .html)
    # Skip non-game templates
    [[ "$name" == "manifest" ]] && continue
    cat >> "$SITEMAP" << EOF
  <url>
    <loc>${BASE_URL}/games/${name}.html</loc>
    <lastmod>${TIMESTAMP}</lastmod>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/games/${name}.html"/>
  </url>
EOF
  fi
done

# Add generated games
for game in app/games/*.html; do
  if [ -f "$game" ]; then
    name=$(basename "$game" .html)
    [[ "$name" == ".gitkeep" ]] && continue
    cat >> "$SITEMAP" << EOF
  <url>
    <loc>${BASE_URL}/games/${name}.html</loc>
    <lastmod>${TIMESTAMP}</lastmod>
    <priority>0.6</priority>
  </url>
EOF
  fi
done

echo "</urlset>" >> "$SITEMAP"
echo "[seo] Sitemap: $(wc -l < "$SITEMAP") lines"

# === ROBOTS.TXT ===
cat > "publish/robots.txt" << EOF
User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
EOF
echo "[seo] robots.txt written"

python - <<'PY'
import json, pathlib
p = pathlib.Path('app/status.json')
data = json.loads(p.read_text())
for a in data.get('agents', []):
    if a.get('name') == 'SEO':
        a['status'] = 'online'
        a['detail'] = 'Generated sitemap + robots + OG meta'
p.write_text(json.dumps(data, indent=2) + '\n')
PY

# === JSON-LD GAME SCHEMA ===
cat > "publish/games-schema.json" << EOF
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "ForgeLoop Games",
  "description": "Instant-play browser games built with ForgeLoop — the AI game builder by ByJTT.",
  "url": "${BASE_URL}",
  "publisher": {
    "@type": "Organization",
    "name": "ByJTT",
    "url": "https://byjtt.com"
  }
}
EOF

# === OG META GENERATOR ===
# Generate individual OG meta files for each game
mkdir -p publish/og

for tmpl in templates/*.html; do
  if [ -f "$tmpl" ]; then
    name=$(basename "$tmpl" .html)
    [[ "$name" == "manifest" ]] && continue
    
    # Extract title from HTML
    title=$(grep '<title>' "$tmpl" | sed 's/.*<title>//;s/<\/title>.*//' 2>/dev/null || echo "ForgeLoop Game")
    
    # Extract description
    desc=$(grep 'name="description"' "$tmpl" | sed 's/.*content="//;s/".*//' 2>/dev/null || echo "An instant-play browser game built with ForgeLoop.")
    
    cat > "publish/og/${name}.json" << EOF
{
  "title": "${title}",
  "description": "${desc}",
  "url": "${BASE_URL}/games/${name}.html",
  "image": "${BASE_URL}/og/${name}.png",
  "type": "game",
  "locale": "en_US"
}
EOF
    echo "[seo] OG meta: ${name}"
  fi
done

echo "[seo] Complete — $(date)"
echo "[seo] Generated: sitemap.xml, robots.txt, games-schema.json, $(ls -1 publish/og/*.json 2>/dev/null | wc -l) OG meta files"
