# syntax=docker/dockerfile:1
# Repix - Image transformation service with Sharp
# Optimized for Docker distribution with multi-platform support (linux/amd64, linux/arm64)

# Build stage
FROM node:22-alpine3.19 AS builder

# Install build dependencies (minimal - Sharp uses prebuilt binaries, but tsc/vite need deps)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies (use npm ci for reproducible builds)
RUN npm ci --include=dev

# Copy source
COPY src/ ./src/
COPY config.example.js ./

# Build application
RUN npm run build

FROM node:22-alpine3.19 AS production

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

RUN addgroup -g 1001 -S nodejs \
    && adduser -S repix -u 1001 -G nodejs

COPY --from=builder --chown=repix:nodejs /app/dist ./dist
COPY --from=builder --chown=repix:nodejs /app/config.example.js ./config.js

USER repix

EXPOSE 3210

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3210/health || exit 1

CMD ["node", "dist/index.js"]
