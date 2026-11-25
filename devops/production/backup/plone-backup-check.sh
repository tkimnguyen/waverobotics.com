#!/bin/bash
# Fail when the last successful nightly backup is too old (or missing), so
# that plone-backup-check.service fails and notify-failure@ emails the admin.
# Catches backups that stopped running (timer disabled or broken), which
# plone-backup.service's own failure alert can't see.
set -euo pipefail

STAMP=/home/plone/backups/last-success
MAX_AGE_HOURS=${1:-30}

if [ ! -f "$STAMP" ]; then
  echo "plone-backup-check: $STAMP is missing: no backup has ever succeeded"
  exit 1
fi
age_h=$(( ($(date +%s) - $(stat -c %Y "$STAMP")) / 3600 ))
if [ "$age_h" -ge "$MAX_AGE_HOURS" ]; then
  echo "plone-backup-check: last successful backup was $age_h hours ago ($(cat "$STAMP")); limit $MAX_AGE_HOURS hours"
  systemctl list-timers --all --no-pager plone-backup.timer || true
  exit 1
fi
echo "plone-backup-check: last successful backup $age_h hours ago ($(cat "$STAMP"))"
