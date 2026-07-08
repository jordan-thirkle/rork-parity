#!/bin/bash
# RorkParity Safe Deploy checks
set -euo pipefail
cd /d/Projects/rork-parity

echo '[safe-deploy] running checks...'
bash scripts/autopilot.sh >/tmp/rorkparity-safe-deploy.log 2>&1 || true
bash scripts/verify-recover.sh >/tmp/rorkparity-verify.log 2>&1 || true

echo '[safe-deploy] git status:'
git status --short || true

echo '[safe-deploy] Next build check:'
if [ -d next ]; then
  (cd next && npm run build >/tmp/rorkparity-build.log 2>&1 || true)
  if grep -q "Compiled successfully" /tmp/rorkparity-build.log; then
    echo '[safe-deploy] Next build ok'
  else
    echo '[safe-deploy] Next build failed; see /tmp/rorkparity-build.log'
  fi
else
  echo '[safe-deploy] Next directory missing'
fi

echo '[safe-deploy] ready for manual Vercel deploy'
