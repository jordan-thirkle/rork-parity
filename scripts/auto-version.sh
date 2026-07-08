#!/bin/bash
# RorkParity Auto-Version — optional pre-generation snapshot
# Usage: ./scripts/auto-version.sh "Commit message"
set -euo pipefail
cd /d/Projects/rork-parity

MESSAGE="${1:-Auto-version: pre-generation snapshot}"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "auto-version: not a git repo, skipping"
  exit 0
fi

if git diff --quiet && git diff --cached --quiet; then
  echo "auto-version: no changes to commit"
  exit 0
fi

git add -A
git commit -m "$MESSAGE" --no-verify
echo "auto-version: committed ($(git rev-parse --short HEAD))"
exit 0
