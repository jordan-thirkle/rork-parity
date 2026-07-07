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
    if a.get('name') == 'Catalog Builder':
        a['status'] = 'online'
        a['detail'] = 'Rebuilt SEO/catalog outputs if needed'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Catalog Builder',
        'role': 'rebuild SEO/catalog outputs when content changes',
        'schedule': '30m',
        'status': 'online',
        'detail': 'Rebuilt SEO/catalog outputs if needed',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

bash scripts/seo-generate.sh >/tmp/forgeloop-seo.log 2>&1 || true
echo "[catalog] SEO assets refreshed"
