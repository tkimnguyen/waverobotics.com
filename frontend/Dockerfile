# syntax=docker/dockerfile:1
# Volto frontend for waverobotics.com.
# Builds the same way as a local checkout: Volto core from mrs.developer.json,
# dependencies from pnpm-lock.yaml (frozen), then a production bundle.
ARG NODE_IMAGE=node:22.23.4-bookworm-slim

FROM ${NODE_IMAGE} AS builder

RUN <<EOT
    set -e
    apt-get update
    apt-get install -y --no-install-recommends ca-certificates git python3 make g++
    rm -rf /var/lib/apt/lists/*
    corepack enable
    mkdir /app && chown node:node /app
EOT

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
USER node

COPY --chown=node . .

RUN --mount=type=cache,id=pnpm,target=/home/node/pnpm-store,uid=1000 <<EOT
    set -e
    pnpm config set store-dir /home/node/pnpm-store
    pnpm dlx mrs-developer missdev --no-config --fetch-https
    pnpm install --frozen-lockfile
    pnpm build:deps
    pnpm build
    # pnpm 10 asks before replacing node_modules; CI=1 answers for it.
    CI=1 pnpm install --prod --frozen-lockfile
EOT


FROM ${NODE_IMAGE}

LABEL org.opencontainers.image.title="waverobotics.com frontend" \
      org.opencontainers.image.description="Volto frontend for waverobotics.com"

ENV NODE_ENV=production \
    PORT=3000

# Owned by root and read-only for the node user: nothing is written at runtime.
COPY --from=builder /app /app

WORKDIR /app/core/packages/volto
USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
