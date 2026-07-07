#!/bin/bash
# ForgeLoop Auto-Version — pre-generation git commit
# Called before each SMITH code generation to snapshot state
# Usage: ./scripts/auto-version.sh "Commit message" [tag-name]

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

MESSAGE="${1:-Auto-version: pre-generation snapshot}"
TAG="${2:-}"

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "auto-version: not a git repo, skipping"
  exit 0
fi

# Check for changes
if git diff --quiet && git diff --cached --quiet; then
  echo "auto-version: no changes to commit"
  exit 0
fi

# Stage everything and commit
git add -A
git commit -m "$MESSAGE" --no-verify

# Tag if specified
if [ -n "$TAG" ]; then
  git tag -f "$TAG" HEAD
  echo "auto-version: tagged $TAG"
fi

echo "auto-version: committed ($(git rev-parse --short HEAD))"
exit 0
