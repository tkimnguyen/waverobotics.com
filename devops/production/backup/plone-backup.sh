#!/bin/bash
# Nightly backup of the Plone site content (run by plone-backup.timer).
#
# - Database: a full, compressed repozo backup of Data.fs, made with the
#   backend image in a throwaway container that mounts the data read-only.
# - Uploaded files (blobs): one rsync copy per night; unchanged files are
#   hard links to the previous night's copy, so each night adds only changes.
# - Keeps KEEP_DAYS nights. Database first, then blobs, so every blob the
#   database copy refers to is in the blob copy of the same night.
#
# Restore (stop the backend first: docker compose stop backend):
#   docker run --rm --user 1000:1000 --network none --entrypoint /app/bin/repozo \
#     -v $BACKUP_DIR/filestorage:/backup:ro -v /some/empty/dir:/out \
#     <backend image> -R -r /backup -o /out/Data.fs [-D YYYY-MM-DD-HH-MM-SS]
#   then put Data.fs into $VAR/filestorage and copy $BACKUP_DIR/blobs/<date>/
#   back to $VAR/blobs/ (rsync -a --delete), owned by plone (1000).
set -euo pipefail

COMPOSE_DIR=/home/plone/waverobotics-docker
VAR=/home/plone/2024.ploneconf.org/backend/instance/var
BACKUP_DIR=/home/plone/backups
KEEP_DAYS=7
MIN_FREE_MB=1024

log() { echo "plone-backup: $*"; }

install -d -o plone -g plone -m 700 "$BACKUP_DIR" "$BACKUP_DIR/filestorage" "$BACKUP_DIR/blobs"

free_mb=$(df -Pm "$BACKUP_DIR" | awk 'NR==2 {print $4}')
if [ "$free_mb" -lt "$MIN_FREE_MB" ]; then
  log "only ${free_mb} MB free, need ${MIN_FREE_MB} MB; not backing up"
  exit 1
fi

tag=$(sed -n 's/^BACKEND_TAG=//p' "$COMPOSE_DIR/.env")
image="ghcr.io/tkimnguyen/waverobotics.com-backend:${tag}"
stamp=$(date +%F)


repozo() {
  docker run --rm --user 1000:1000 --network none --memory 256m \
    --entrypoint /app/bin/repozo \
    -v "$VAR/filestorage:/fs:ro" -v "$BACKUP_DIR/filestorage:/backup" \
    "$image" "$@"
}

log "database: full backup with $image"
repozo -B -F -z -f /fs/Data.fs -r /backup
repozo -V -r /backup

log "blobs: copy to blobs/$stamp"
link_dest=()
if [ -d "$BACKUP_DIR/blobs/latest/" ]; then
  link_dest=(--link-dest="$BACKUP_DIR/blobs/latest/")
fi
rsync -a --delete "${link_dest[@]}" "$VAR/blobs/" "$BACKUP_DIR/blobs/$stamp.tmp/"
rm -rf "$BACKUP_DIR/blobs/$stamp"
mv "$BACKUP_DIR/blobs/$stamp.tmp" "$BACKUP_DIR/blobs/$stamp"
ln -sfn "$stamp" "$BACKUP_DIR/blobs/latest"
chown -h plone:plone "$BACKUP_DIR/blobs/latest" "$BACKUP_DIR/blobs/$stamp"

log "removing backups older than $KEEP_DAYS days"
find "$BACKUP_DIR/filestorage" -maxdepth 1 -type f -mtime +$((KEEP_DAYS - 1)) -print -delete
# Blob copies by the date in their name (rsync gives them the source's mtime).
cutoff=$(date -d "-$((KEEP_DAYS - 1)) days" +%F)
for d in "$BACKUP_DIR"/blobs/20??-??-??; do
  [ -d "$d" ] || continue
  if [[ "$(basename "$d")" < "$cutoff" ]]; then
    echo "$d"
    rm -rf "$d"
  fi
done

date '+%F %T' > "$BACKUP_DIR/last-success"
log "done; $(du -sh "$BACKUP_DIR" | cut -f1) in $BACKUP_DIR, $(df -Ph "$BACKUP_DIR" | awk 'NR==2 {print $4}') free"
