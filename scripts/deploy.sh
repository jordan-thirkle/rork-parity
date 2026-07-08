#!/bin/bash
# RorkParity Deploy helper
# Usage: bash scripts/deploy.sh
set -euo pipefail
cd /d/Projects/rork-parity

echo "=== RorkParity Deploy ==="
echo "Date: $(date)"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run: vercel login"
  exit 1
fi

echo "Deploying to production..."
vercel --prod --yes
echo "Deploy complete"
echo "URL: https://rork-parity.vercel.app"
