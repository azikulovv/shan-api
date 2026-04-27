# ---------- Build stage ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY src ./src

ENV NODE_ENV=production
ENV SHANYRAQ_DATABASE_URL=file:/app/data/shan.db

RUN yarn prisma:generate
RUN yarn build


# ---------- Production stage ----------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY prisma.config.ts ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma

COPY --from=builder /app/src/generated ./dist/src/generated

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV SHANYRAQ_PORT=3001
ENV SHANYRAQ_DATABASE_URL=file:/app/data/shan.db

EXPOSE 3001

CMD ["sh", "-c", "yarn prisma:migrate:deploy && yarn start"]
