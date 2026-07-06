#!/bin/bash
set -e
cd /d/Projects/rork-parity

if curl -sf http://localhost:3001 >/dev/null 2>&1; then
  echo '[watchdog] server healthy'
else
  echo '[watchdog] server down, restarting'
  nohup npx serve app -l 3001 > /tmp/forgeloop-serve.log 2>&1 &
  disown || true
  sleep 2
  if curl -sf http://localhost:3001 >/dev/null 2>&1; then
    echo '[watchdog] restart confirmed'
  else
    echo '[watchdog] restart pending'
  fi
fi

python - <<'PY'
import json, pathlib, datetime
p = pathlib.Path('app/status.json')
data = json.loads(p.read_text())
for a in data.get('agents', []):
    if a.get('name') == 'Server Watchdog':
        a['status'] = 'online'
        a['detail'] = 'Checked workspace server and restarted if needed'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Server Watchdog',
        'role': 'keep the local workspace server alive',
        'schedule': '10m',
        'status': 'online',
        'detail': 'Checked workspace server and restarted if needed',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY
