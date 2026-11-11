# waverobotics.com

Website of [Wave Robotics](https://waverobotics.com), FIRST Robotics team 2826.

Plone 6.2.3 backend + Volto 19.7.0 frontend. The project started from
[plone/2024.ploneconf.org](https://github.com/plone/2024.ploneconf.org) and keeps
its layout and some of its tooling.

## Repository layout

- `backend/`: Plone, installed with pip and mxdev (no buildout). Policy package
  `ploneconf` in `backend/src/ploneconf`. Versions are pinned in
  `backend/constraints.txt` (the Plone release constraints plus add-ons).
- `frontend/`: Volto with volto-light-theme. The site's add-on is
  `frontend/packages/volto-ploneconf` (logo, header, footer, navigation, theme
  customizations). Its Header, Footer, Navigation, MobileNavigation and Tags
  replace the theme's through `config.settings.vlt.components` (see its
  `src/index.js`); there are no shadowed theme files. Volto itself is checked
  out into `frontend/core` at the tag in `frontend/mrs.developer.json`;
  dependencies are locked in `frontend/pnpm-lock.yaml`.
- `devops/production/compose.yml`: the production stack.
- `devops/production/backup/`: the nightly content backup (script and systemd units).
- `.github/workflows/`: checks and Docker image builds.

## Local development

Requirements: Python 3.10 to 3.13 (CI and the Docker image use 3.13), Node 22
(Volto 19 supports Node 22 and 24), pnpm 10.20.0 (via `corepack enable`), git.

### Backend

```shell
cd backend
make build
make start        # http://localhost:8080
```

If the checkout path contains spaces, the Makefile breaks. Use a path without
spaces (a symlink is fine) and pass it explicitly:

```shell
make build BACKEND_FOLDER=/path/without/spaces/backend
```

`make create-site` creates an empty site; for real content, start from a copy of
the production data (`instance/var/filestorage` and `instance/var/blobs`).

### Frontend

```shell
cd frontend
make install      # checks out Volto core, installs dependencies, builds @plone/registry
make start        # development server on http://localhost:3000
```

Production build, as the Docker image does it:

```shell
pnpm build
pnpm start:prod   # run from frontend/: the server must start in core/packages/volto
```

Set `RAZZLE_INTERNAL_API_PATH` (e.g. `http://localhost:8080/Plone`) and `PORT` to
point the frontend at another backend or port.

### Checks

These run in CI and must pass before images are built:

```shell
cd frontend && make lint && make ci-i18n && make test
```

The backend runs black, isort, flake8 and zpretty (via `plone/code-analysis-action`)
and `pytest tests`.

## Docker images

On every push that touches `backend/` or `frontend/`, GitHub Actions runs the
checks and pushes images to GHCR:

- `ghcr.io/tkimnguyen/waverobotics.com-backend`
- `ghcr.io/tkimnguyen/waverobotics.com-frontend`

Tags: `sha-<short commit>` for every build, the branch name, and `latest` for
`main`. Images are `linux/amd64`.

The root `docker-compose.yml` and the `stack-*` Makefile targets are the
upstream local stack (Traefik + Postgres) and are not used for production.

## Production

The server runs the two images with `devops/production/compose.yml`, behind nginx
on the host, which proxies to `127.0.0.1:3000` (frontend) and `127.0.0.1:8080`
(backend, `++api++`). The compose file sits in its own directory on the server
with an `.env` file that pins the image tag:

```shell
TAG=sha-abc1234
```

The backend container runs as the host user that owns the instance data. It mounts
the existing instance `var` directory as `/data` (database in `filestorage/`,
blobs in `blobs/`), so the data stays where it was before the move to containers.
Container logs go to Docker (`docker compose logs`), capped at 5 × 10 MB per
container.

### Deploying a new build

1. Wait for the GitHub Actions run to pass and note the `sha-...` tag.
2. On the server, in the compose directory: set `TAG` in `.env`, then

   ```shell
   docker compose pull
   docker compose up -d
   ```

3. Check the site. If something is wrong, set the previous tag and run the same
   two commands.

CI builds a new image only for the side that changed (`backend/` or `frontend/`).
When only one side has a new tag, set `BACKEND_TAG` or `FRONTEND_TAG` in `.env`
instead of `TAG`; each overrides `TAG` for its own service.

### Upgrading Plone

A new Plone version usually needs a database migration, and the old version
cannot run on the migrated database. Plan a short maintenance window:

1. Pull the new images first (`docker compose pull`), with the site still up.
2. Try the migration on a copy of the data, using a separate compose project and
   port, with `devops/production/upgrade_site.py` (it runs
   the core and add-on upgrade steps for each site; usage is in the file):

   ```shell
   DATA_DIR=/path/to/copy BACKEND_PORT=8090 docker compose -p trial run --rm --no-deps \
       -v "$PWD/upgrade_site.py:/scripts/upgrade_site.py:ro" \
       backend run /scripts/upgrade_site.py </dev/null
   ```

3. In the window: `docker compose stop`, back up `filestorage/` and `blobs/`, run
   the same command on the real data (without `DATA_DIR`, `BACKEND_PORT` and
   `-p trial`), then `docker compose up -d`.
4. Rollback after a migration means restoring that backup and the previous tag.
   Changes made on the site after the migration are lost.

When scripting `docker compose run` over ssh, redirect stdin (`</dev/null`):
otherwise it consumes the rest of the script.

### Backups

`devops/production/backup/plone-backup.sh` backs up the site content every night
at 03:15 (server time), run by the systemd units next to it:

- the database: a full, compressed `repozo` backup of `Data.fs`, made with the
  current backend image in a throwaway container that mounts the data read-only;
- the blobs: an `rsync` copy per night, with unchanged files hard-linked to the
  previous night's copy, so each night only adds what changed.

It keeps 7 nights in `/home/plone/backups`, readable only by `plone` (the
backups include user accounts), and skips the run when less than 1 GB is free.

Install or update on the server, as root:

```shell
install -m 750 plone-backup.sh /usr/local/sbin/plone-backup.sh
install -m 644 plone-backup.service plone-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now plone-backup.timer
```

Check: `cat /home/plone/backups/last-success`, `journalctl -u plone-backup`.
Restoring is described at the top of the script.

## Credits

Based on the [2024 Plone Conference site](https://github.com/plone/2024.ploneconf.org)
by the Plone Foundation and contributors, generated with
[cookiecutter-plone-starter](https://github.com/collective/cookiecutter-plone-starter).
