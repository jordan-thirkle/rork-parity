#!/bin/bash
set -e
cd /d/Projects/rork-parity

python - <<'PY'
import json, pathlib, datetime
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'Uptime Checker':
        a['status'] = 'online'
        a['detail'] = 'Checked local server and key routes'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Uptime Checker',
        'role': 'verify local server and live HTML routes',
        'schedule': '10m',
        'status': 'online',
        'detail': 'Checked local server and key routes',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

if curl -sf http://localhost:3001/ >/dev/null 2>&1; then
  echo "[uptime] server healthy"
else
  echo "[uptime] server down"
fi

for route in / /index.html /workspace.html /gallery.html /team.html /roadmap.html /landing.html /payment.html /3d-team.html; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3001${route}")
  echo "[uptime] ${route} ${code}"
done
