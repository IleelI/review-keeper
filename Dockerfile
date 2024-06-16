FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=s/eea25b3e-04ae-48f7-b8dc-24eb7aaa6ded-cache-pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=s/eea25b3e-04ae-48f7-b8dc-24eb7aaa6ded-cache-pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

CMD [ "pnpm", "start" ]

