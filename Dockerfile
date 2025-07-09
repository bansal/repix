# Build stage
FROM node:20-alpine3.19 AS builder

# Install build dependencies for Sharp
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    build-base \
    python3 \
    make \
    g++ \
    pkgconfig

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY src/ ./src/
COPY config.example.js ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine3.19 AS production

# Install runtime dependencies for Sharp
RUN apk add --no-cache \
    libc6-compat \
    vips \
    wget \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --omit=dev \
    && npm cache clean --force

# Create non-root user with specific UID/GID for better security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S repix -u 1001 -G nodejs

# Copy built application from builder stage
COPY --from=builder --chown=repix:nodejs /app/dist ./dist
COPY --from=builder --chown=repix:nodejs /app/config.example.js ./config.js

# Switch to non-root user
USER repix

# Expose port
EXPOSE 3000

# Add health check with more efficient curl alternative
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use exec form for better signal handling
CMD ["node", "dist/index.js"]
