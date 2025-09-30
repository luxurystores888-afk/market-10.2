// 🚀 CYBER MART 2077 - PRODUCTION DEPLOYMENT SCRIPT
// This script helps deploy the platform to various hosting services

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createProductionEnv() {
  const productionEnv = `# 🚀 CYBER MART 2077 - PRODUCTION ENVIRONMENT

# Database Configuration (Required)
DATABASE_URL="postgresql://username:password@hostname:5432/cybermart2077"

# Authentication & Security (Required - CHANGE THESE!)
JWT_SECRET="CHANGE_THIS_TO_A_SUPER_SECURE_SECRET_IN_PRODUCTION"

# AI Service API Keys (Recommended for full functionality)
OPENAI_API_KEY="your_production_openai_key"
ANTHROPIC_API_KEY="your_production_anthropic_key"
GOOGLE_AI_API_KEY="your_production_gemini_key"

# Payment Gateway Configuration
STRIPE_SECRET_KEY="sk_live_your_live_stripe_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_live_publishable_key"

# Production Configuration
NODE_ENV="production"
PORT="3001"
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Email Service
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your_email_password"

# Redis Configuration (Recommended for production)
REDIS_URL="redis://your-redis-url:6379"

# File Upload Configuration
MAX_FILE_SIZE="10mb"
UPLOAD_PATH="./uploads"

# Rate Limiting Configuration (Tightened for production)
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="50"

# Automation Configuration
AUTOMATION_ENABLED="true"
PRODUCT_GENERATION_INTERVAL="6"
PRICING_UPDATE_INTERVAL="30"
MARKETING_CAMPAIGN_INTERVAL="2"

# Analytics Configuration
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"

# Security Headers
ENABLE_HELMET="true"
ENABLE_CORS="true"

# Logging
LOG_LEVEL="info"
ENABLE_REQUEST_LOGGING="true"
`;

  fs.writeFileSync('.env.production', productionEnv);
  log('✅ Created .env.production template', 'green');
}

function createDockerfile() {
  const dockerfile = `# 🚀 CYBER MART 2077 - Production Dockerfile

# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
`;

  fs.writeFileSync('Dockerfile', dockerfile);
  log('✅ Created Dockerfile', 'green');
}

function createDockerCompose() {
  const dockerCompose = `# 🚀 CYBER MART 2077 - Docker Compose Configuration
version: '3.8'

services:
  # Main Application
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cybermart2077
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-database.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis for Caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;

  fs.writeFileSync('docker-compose.prod.yml', dockerCompose);
  log('✅ Created docker-compose.prod.yml', 'green');
}

function createNginxConfig() {
  const nginxConfig = `# 🚀 CYBER MART 2077 - Nginx Configuration

events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static Files
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        # Main App
        location / {
            limit_req zone=web burst=50 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
`;

  fs.writeFileSync('nginx.conf', nginxConfig);
  log('✅ Created nginx.conf', 'green');
}

function createDeploymentScripts() {
  // Railway deployment
  const railwayDeploy = `#!/bin/bash
# 🚀 CYBER MART 2077 - Railway Deployment

echo "🚀 Deploying to Railway..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
railway login

# Create new project or link existing
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set AUTOMATION_ENABLED=true

# Deploy
railway up

echo "✅ Deployed to Railway!"
echo "🌐 Your app will be available at: https://your-app.railway.app"
`;

  // Vercel deployment
  const vercelDeploy = `#!/bin/bash
# 🚀 CYBER MART 2077 - Vercel Deployment

echo "🚀 Deploying to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
vercel login

# Deploy
vercel --prod

echo "✅ Deployed to Vercel!"
echo "🌐 Your app will be available at your Vercel domain"
`;

  // Heroku deployment
  const herokuDeploy = `#!/bin/bash
# 🚀 CYBER MART 2077 - Heroku Deployment

echo "🚀 Deploying to Heroku..."

# Install Heroku CLI if not installed
if ! command -v heroku &> /dev/null; then
    echo "Please install Heroku CLI first: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
heroku login

# Create Heroku app
heroku create cyber-mart-2077

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Add Redis addon
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set AUTOMATION_ENABLED=true

# Deploy
git push heroku main

echo "✅ Deployed to Heroku!"
echo "🌐 Your app will be available at: https://cyber-mart-2077.herokuapp.com"
`;

  fs.writeFileSync('deploy-railway.sh', railwayDeploy);
  fs.writeFileSync('deploy-vercel.sh', vercelDeploy);
  fs.writeFileSync('deploy-heroku.sh', herokuDeploy);
  
  log('✅ Created deployment scripts', 'green');
}

function createVercelConfig() {
  const vercelConfig = {
    "name": "cyber-mart-2077",
    "version": 2,
    "builds": [
      {
        "src": "api/index.ts",
        "use": "@vercel/node"
      },
      {
        "src": "package.json",
        "use": "@vercel/static-build",
        "config": { "distDir": "dist" }
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/index.ts"
      },
      {
        "src": "/(.*)",
        "dest": "/dist/$1"
      }
    ],
    "env": {
      "NODE_ENV": "production"
    }
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  log('✅ Created vercel.json', 'green');
}

function createProcfile() {
  const procfile = `web: npm start
worker: node api/index.js
release: npm run db:push`;

  fs.writeFileSync('Procfile', procfile);
  log('✅ Created Procfile for Heroku', 'green');
}

function displayDeploymentInstructions() {
  log('\n🚀 CYBER MART 2077 - DEPLOYMENT READY!', 'cyan');
  log('==========================================', 'cyan');
  
  log('\n📋 Files Created:', 'yellow');
  log('   • .env.production - Production environment template', 'blue');
  log('   • Dockerfile - Container configuration', 'blue');
  log('   • docker-compose.prod.yml - Multi-service setup', 'blue');
  log('   • nginx.conf - Reverse proxy configuration', 'blue');
  log('   • vercel.json - Vercel deployment config', 'blue');
  log('   • Procfile - Heroku deployment config', 'blue');
  log('   • deploy-*.sh - Platform-specific deployment scripts', 'blue');

  log('\n🌐 Deployment Options:', 'yellow');
  log('   1. Docker + VPS: Use docker-compose.prod.yml', 'green');
  log('   2. Railway: Run ./deploy-railway.sh', 'green');
  log('   3. Vercel: Run ./deploy-vercel.sh', 'green');
  log('   4. Heroku: Run ./deploy-heroku.sh', 'green');

  log('\n⚠️ Before Deployment:', 'yellow');
  log('   1. Update .env.production with your values', 'red');
  log('   2. Set up your database (PostgreSQL)', 'red');
  log('   3. Configure your domain and SSL certificates', 'red');
  log('   4. Update ALLOWED_ORIGINS in environment', 'red');
  log('   5. Add your API keys for full functionality', 'red');

  log('\n🔐 Security Checklist:', 'yellow');
  log('   • Change JWT_SECRET to a secure value', 'blue');
  log('   • Use production API keys', 'blue');
  log('   • Enable HTTPS with valid SSL certificates', 'blue');
  log('   • Configure rate limiting', 'blue');
  log('   • Set up monitoring and logging', 'blue');

  log('\n🚀 Your cyberpunk empire is ready for the world!', 'green');
}

// Main deployment setup function
function setupDeployment() {
  log('🚀 Setting up CYBER MART 2077 for production deployment...', 'cyan');
  
  createProductionEnv();
  createDockerfile();
  createDockerCompose();
  createNginxConfig();
  createDeploymentScripts();
  createVercelConfig();
  createProcfile();
  
  displayDeploymentInstructions();
}

// Run if called directly
if (require.main === module) {
  setupDeployment();
}

module.exports = { setupDeployment };
