# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy lockfile & manifest first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ---- Production stage ----
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

CMD ["sh", "./start.sh"]