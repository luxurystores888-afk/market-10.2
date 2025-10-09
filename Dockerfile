# 🐳 CYBER MART 2077 - PRODUCTION DOCKERFILE
# Multi-stage build for optimal performance and security

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY lib/ ./lib/
COPY api/ ./api/
COPY public/ ./public/
COPY scripts/ ./scripts/

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S cybermart -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=cybermart:nodejs /app/dist ./dist
COPY --from=builder --chown=cybermart:nodejs /app/api ./api
COPY --from=builder --chown=cybermart:nodejs /app/lib ./lib
COPY --from=builder --chown=cybermart:nodejs /app/scripts ./scripts

# Create logs directory
RUN mkdir -p logs && chown cybermart:nodejs logs

# Switch to non-root user
USER cybermart

# Expose ports
EXPOSE 3001 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
