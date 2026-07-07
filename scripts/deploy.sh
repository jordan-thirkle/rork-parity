#!/bin/bash
# Deploy ForgeLoop to Vercel
# Usage: bash scripts/deploy.sh

set -e

cd /d/Projects/rork-parity

echo "=== ForgeLoop Deploy ==="
echo "Date: $(date)"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "✗ Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
  echo "✗ Not logged in to Vercel. Run: vercel login"
  exit 1
fi

echo "✓ Vercel CLI ready"

# Deploy to production
echo "Deploying to production..."
vercel --prod --yes

echo "✓ Deploy complete"
echo "URL: https://forgeloop.byjtt.com"
# Commit deploy tag
git tag "deploy-$(date +%Y%m%d-%H%M%S)"
git push origin master --tags

echo "✓ Deployment tagged and pushed"
