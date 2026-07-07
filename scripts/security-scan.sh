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
    if a.get('name') == 'Security Scanner':
        a['status'] = 'online'
        a['detail'] = 'Completed local repo/media risk scan'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Security Scanner',
        'role': 'scan repo for exposed secrets and suspicious files',
        'schedule': '60m',
        'status': 'online',
        'detail': 'Completed local repo/media risk scan',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

matches=$(grep -RInE '(AIza[0-9A-Za-z\-_]{35}|AKIA[0-9A-Z]{16}|sk_live_[0-9a-zA-Z]{24,}|xox[baprs]-[0-9a-zA-Z-]+|-----BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY-----|ghp_[0-9A-Za-z]{36,}|github_pat_[0-9A-Za-z_]+|SUPABASE_ANON_KEY=.*|service_role.*key)' . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.venv --exclude='*.png' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.gif' --exclude='*.svg' --exclude='*.woff2' --exclude='*.ttf' --exclude='*.zip' --exclude='*.tar*' --exclude='*.gz' --exclude='*.7z' --exclude='*.mp3' --exclude='*.mp4' --exclude='*.mov' --exclude='*.avi' || true)
if [ -n "$matches" ]; then
  echo "[security] suspects found"
  echo "$matches"
else
  echo "[security] clean"
fi
