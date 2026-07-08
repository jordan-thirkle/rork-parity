#!/bin/bash
# RorkParity Credibility Monitor
# Usage: bash scripts/credibility-monitor.sh

set -euo pipefail

cd /d/Projects/rork-parity

echo "[credibility] $(date) — credibility monitor"

python - <<'PY'
import json, datetime, pathlib
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'Credibility Monitor':
        a['status'] = 'online'
        a['detail'] = 'Monitor placeholder; no external scraping on this host'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Credibility Monitor',
        'role': 'watch public sentiment and brand mentions',
        'schedule': '15m',
        'status': 'online',
        'detail': 'Monitor placeholder; no external scraping on this host',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

echo "[credibility] Done — $(date)"
exit 0
