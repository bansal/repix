# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install Sharp dependencies for Alpine
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    build-base \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY config.example.js ./config.js

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S imageserver -u 1001

# Change ownership of app directory
RUN chown -R imageserver:nodejs /app
USER imageserver

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["npm", "start"]
