#!/bin/bash
# RorkParity Autopilot — lightweight maintenance path
# Intended as cron job: every 30m
# Usage: bash scripts/autopilot.sh

set -euo pipefail

REPORT_FILE="/tmp/rorkparity-autopilot-report.txt"
: > "$REPORT_FILE"

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

echo "[autopilot] $(date) — RorkParity autopilot check" | tee "$REPORT_FILE"

# 1. Template sanity check
for tmpl in templates/*.html; do
  [ -f "$tmpl" ] || continue
  name=$(basename "$tmpl")
  size=$(wc -c < "$tmpl")
  if grep -q '</html>' "$tmpl" 2>/dev/null; then
    echo "[autopilot] Template $name: ok ($size bytes)" | tee -a "$REPORT_FILE"
  else
    echo "[autopilot] Template $name: invalid" | tee -a "$REPORT_FILE"
  fi
done

# 2. Local docs sanity
if [ -f docs/rebuild-brief-v2.md ]; then
  echo "[autopilot] Rebuild brief present" | tee -a "$REPORT_FILE"
else
  echo "[autopilot] Missing rebuild brief" | tee -a "$REPORT_FILE"
fi

# 3. Next build check
if [ -d next ]; then
  if [ -f next/package.json ]; then
    echo "[autopilot] Next scaffold present" | tee -a "$REPORT_FILE"
  else
    echo "[autopilot] Next scaffold missing package.json" | tee -a "$REPORT_FILE"
  fi
else
  echo "[autopilot] Next directory missing" | tee -a "$REPORT_FILE"
fi

# 4. Supabase migration check
if [ -d supabase ] && ls supabase/migrations/*.sql >/dev/null 2>&1; then
  count=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
  echo "[autopilot] $count migration(s) detected; manual review recommended before push" | tee -a "$REPORT_FILE"
else
  echo "[autopilot] No migrations detected" | tee -a "$REPORT_FILE"
fi

# 5. Status heartbeat
python - <<'PY'
import json, datetime, pathlib
p = pathlib.Path('app/status.json')
try:
    data = json.loads(p.read_text())
except Exception:
    data = {"last_update": "unknown", "agents": []}
for a in data.get('agents', []):
    if a.get('name') == 'Autopilot':
        a['status'] = 'online'
        a['detail'] = 'Maintenance path only; no auto-commit'
        a['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'
        break
else:
    data.setdefault('agents', []).append({
        'name': 'Autopilot',
        'role': 'lightweight maintenance path',
        'schedule': '30m',
        'status': 'online',
        'detail': 'Maintenance path only; no auto-commit',
        'last_run': datetime.datetime.utcnow().isoformat() + 'Z'
    })
p.write_text(json.dumps(data, indent=2) + '\n')
PY

echo "[autopilot] Done — $(date)" | tee -a "$REPORT_FILE"
exit 0
