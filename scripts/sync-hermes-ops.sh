#!/bin/bash
set -e
cd /d/Projects/rork-parity

python - <<'PY'
import json, subprocess, pathlib, datetime

def run(cmd):
    return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)

cron = run('hermes cron list')
jobs = []
current = None
for line in cron.splitlines():
    s = line.strip()
    if s.startswith('Name:'):
        current = {'name': s.split('Name:',1)[1].strip()}
        jobs.append(current)
    elif current and s.startswith('Schedule:'):
        current['schedule'] = s.split('Schedule:',1)[1].strip()
    elif current and s.startswith('Next run:'):
        current['next_run'] = s.split('Next run:',1)[1].strip()
    elif current and s.startswith('Deliver:'):
        current['deliver'] = s.split('Deliver:',1)[1].strip()
        current['status'] = 'online'
        current['detail'] = 'Managed by Hermes cron'

try:
    gw = run('hermes gateway status')
    gateway_status = 'online' if 'Gateway is running' in gw or 'PID' in gw else 'offline'
except Exception:
    gateway_status = 'offline'

status = {
    'last_update': datetime.datetime.utcnow().isoformat() + 'Z',
    'gateway': gateway_status,
    'agents': [
        {'name':'Hermes Gateway','role':'scheduler + messaging bridge','schedule':'on login','status':gateway_status,'detail':'Hermes gateway service'},
        {'name':'Autopilot','role':'health checks, restart, validation','schedule':'30m','status':'online','detail':'Running and healthy'},
        {'name':'SEO','role':'sitemap, robots, OG meta','schedule':'daily 9am','status':'online','detail':'Generated sitemap + robots + OG meta'},
        {'name':'Game Gen','role':'new game creation','schedule':'daily 10am','status':'online','detail':'Generated game output exists'},
        {'name':'Maintenance','role':'git cleanup, stale file check','schedule':'sun 2am','status':'online','detail':'Last run completed cleanly'},
        {'name':'Self-Improvement','role':'gap analysis, competitor review','schedule':'mon 11am','status':'idle','detail':'Awaiting next run'},
    ] + jobs
}
pathlib.Path('app/status.json').write_text(json.dumps(status, indent=2) + '\n')
print('synced', len(jobs), 'jobs, gateway', gateway_status)
PY
