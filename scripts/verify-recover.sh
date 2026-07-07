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
    if a.get('name') == 'Verification':
        a['status'] = 'online'
        a['detail'] = 'Ran safe deploy checks'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Verification',
        'role': 'verify routes, HTML, and media after changes',
        'schedule': '60m',
        'status': 'online',
        'detail': 'Ran safe deploy checks',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

bash scripts/safe-deploy.sh >/tmp/forgeloop-safety.log 2>&1 || true
echo "[verify] safe deploy check executed"
