FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV DATABASE_URL="file:./database.db?connection_limit=1"
ENV JWT_SECRET=a4045146c003ee8275b3ffafa4f3299b8abf1c6a43ee9b4b2a489855dff5da50
ENV APP_SECRET=b3fc6d92de713f9362bbb5181f2656b54356e9893e8ca827887d51b3c080fd5b

RUN corepack enable

COPY . /app
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

FROM base AS prod-deps
RUN --mount=type=cache,id=s/eea25b3e-04ae-48f7-b8dc-24eb7aaa6ded-cache-pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=s/eea25b3e-04ae-48f7-b8dc-24eb7aaa6ded-cache-pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

RUN pnpm run prisma.setup

EXPOSE 3000
CMD [ "pnpm", "start" ]

