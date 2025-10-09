# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN npm ci

# Copy source files
COPY apps/api/ ./apps/api/

# Build the application
RUN npm run build --workspace=api

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --production

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/src/db ./apps/api/src/db

# Create upload directory
RUN mkdir -p /app/uploads

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# Start the application
CMD ["node", "apps/api/dist/index.js"]
