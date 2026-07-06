#!/bin/bash
set -e
cd /d/Projects/rork-parity

echo '[safe-deploy] running checks...'
bash scripts/autopilot.sh
bash scripts/seo-generate.sh

echo '[safe-deploy] git status:'
git status --short

echo '[safe-deploy] creating safety commit'
git add -A
git commit -m "deploy: safe snapshot before release" || true

echo '[safe-deploy] verify routes'
curl -sL http://localhost:3001/ >/dev/null
curl -sL http://localhost:3001/gallery.html >/dev/null
curl -sL http://localhost:3001/team.html >/dev/null
curl -sL http://localhost:3001/payment.html >/dev/null

echo '[safe-deploy] ready for Vercel deploy'
