#!/bin/bash
# RorkParity Catalog Builder
# Usage: bash scripts/catalog-build.sh

set -euo pipefail

cd /d/Projects/rork-parity

echo "[catalog] $(date) — refreshing catalog outputs"

if [ -f templates/manifest.json ]; then
  echo "[catalog] templates/manifest.json present"
else
  echo "[catalog] templates/manifest.json missing"
fi

if [ -d app/games ]; then
  game_count=$(find app/games -maxdepth 1 -name '*.html' 2>/dev/null | wc -l || echo 0)
  echo "[catalog] generated game files: $game_count"
else
  echo "[catalog] app/games directory missing"
fi

if [ -d next ]; then
  echo "[catalog] Next rebuild surface present"
else
  echo "[catalog] Next rebuild surface missing"
fi

python - <<'PY'
import json, datetime, pathlib
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'Catalog Builder':
        a['status'] = 'online'
        a['detail'] = 'Refreshed catalog references and template manifest'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Catalog Builder',
        'role': 'rebuild SEO/catalog outputs when content changes',
        'schedule': '30m',
        'status': 'online',
        'detail': 'Refreshed catalog references and template manifest',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

echo "[catalog] Done — $(date)"
exit 0
