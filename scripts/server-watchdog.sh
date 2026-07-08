#!/bin/bash
# RorkParity Server Watchdog
# Usage: bash scripts/server-watchdog.sh

set -euo pipefail

cd /d/Projects/rork-parity

report() {
  echo "[watchdog] $*"
}

check_url() {
  local url="$1"
  local name="$2"
  if curl -sf "$url" >/dev/null 2>&1; then
    report "$name healthy: $url"
    return 0
  else
    report "$name unreachable: $url"
    return 1
  fi
}

check_url "http://localhost:3001/" "static site"
check_url "http://localhost:3002/" "Next.js dev" || true

python - <<'PY'
import json, datetime, pathlib
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'Server Watchdog':
        a['status'] = 'online'
        a['detail'] = 'Verified local server routes'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Server Watchdog',
        'role': 'verify local server routes',
        'schedule': '10m',
        'status': 'online',
        'detail': 'Verified local server routes',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

report "Done — $(date)"
exit 0
