# Multi-stage Dockerfile for NestJS API with Stockfish
FROM node:20-bookworm-slim AS base

# Install Stockfish chess engine and OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
    stockfish \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS builder

# Copy root configurations and workspace manifests
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN npm ci

# Copy source files
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma Client
WORKDIR /app/apps/api

# Prisma needs a DATABASE_URL during the build.
# This is only a dummy URL for prisma generate.
ENV DATABASE_URL=postgresql://localhost:5432/chess_game

RUN npx prisma generate

# Build API application
WORKDIR /app
RUN DATABASE_URL=postgresql://localhost:5432/chess_game npx turbo run build --filter=api

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV STOCKFISH_PATH=/usr/games/stockfish

# Copy package manifests and installed dependencies
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts

WORKDIR /app/apps/api

EXPOSE 3000

# Render provides the real DATABASE_URL at runtime.
# Apply Prisma migrations before starting NestJS.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
