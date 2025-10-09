# Deployment Guide

This guide covers deploying Cyber Mart 2077 to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Railway](#railway)
- [Vercel](#vercel)
- [Heroku](#heroku)
- [AWS](#aws)
- [Docker](#docker)
- [VPS/Self-Hosted](#vpsself-hosted)

## Prerequisites

Before deploying, ensure you have:

- ✅ PostgreSQL database (can use hosted services)
- ✅ Environment variables configured
- ✅ Stripe account (for payments)
- ✅ Domain name (optional but recommended)

## Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Server
NODE_ENV=production
PORT=3001

# Payment (Optional)
STRIPE_SECRET_KEY=sk_live_...

# AI Features (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Railway

Railway offers easy deployment with free tier options.

### Steps

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set JWT_SECRET=your-secret-key
   railway variables set NODE_ENV=production
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Run Database Migrations**:
   ```bash
   railway run npm run db:push
   ```

### Configuration

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Vercel

Vercel is great for the frontend, but requires serverless functions for the API.

### Frontend Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all required variables

### Configuration

Your `vercel.json` is already configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

### Backend (Serverless)

Convert Express routes to serverless functions or use a separate backend service (Railway, Heroku).

## Heroku

### Steps

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create App**:
   ```bash
   heroku create cyber-mart-2077
   ```

4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **Run Migrations**:
   ```bash
   heroku run npm run db:push
   ```

8. **Open App**:
   ```bash
   heroku open
   ```

### Procfile

Create a `Procfile` in the root:

```
web: npm start
```

## AWS

### Using Elastic Beanstalk

1. **Install AWS CLI and EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**:
   ```bash
   eb init -p node.js cyber-mart-2077
   ```

3. **Create Environment**:
   ```bash
   eb create production
   ```

4. **Set Environment Variables**:
   ```bash
   eb setenv NODE_ENV=production JWT_SECRET=your-secret DATABASE_URL=postgresql://...
   ```

5. **Deploy**:
   ```bash
   eb deploy
   ```

### Using EC2 (Manual)

1. Launch an EC2 instance (Ubuntu 22.04 recommended)
2. SSH into the instance
3. Install Node.js and PostgreSQL
4. Clone your repository
5. Install dependencies and build
6. Use PM2 to run the application
7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

See [VPS/Self-Hosted](#vpsself-hosted) for detailed instructions.

## Docker

### Build and Run Locally

```bash
# Build image
docker build -t cyber-mart-2077 .

# Run container
docker run -p 3001:3001 --env-file .env cyber-mart-2077
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deploy to Docker Hub

```bash
# Login
docker login

# Tag image
docker tag cyber-mart-2077 yourusername/cyber-mart-2077:latest

# Push
docker push yourusername/cyber-mart-2077:latest
```

## VPS/Self-Hosted

For deploying to a VPS (DigitalOcean, Linode, AWS EC2, etc.):

### 1. Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE cybermart;
CREATE USER cybermartuser WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE cybermart TO cybermartuser;
\q
```

### 3. Application Setup

```bash
# Create app directory
sudo mkdir -p /var/www/cyber-mart-2077
cd /var/www/cyber-mart-2077

# Clone repository
sudo git clone https://github.com/luxurystores888-afk/market-10.2.git .

# Set ownership
sudo chown -R $USER:$USER /var/www/cyber-mart-2077

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Build application
npm run build

# Run database migrations
npm run db:push
```

### 4. PM2 Setup

```bash
# Start application with PM2
pm2 start npm --name "cyber-mart" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/cyber-mart-2077`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cyber-mart-2077 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Firewall Setup

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Post-Deployment Checklist

After deploying, verify:

- [ ] Application is accessible via URL
- [ ] Database connection works
- [ ] Authentication system works (login/signup)
- [ ] Payment processing works (test mode first)
- [ ] SSL certificate is active (HTTPS)
- [ ] Environment variables are set correctly
- [ ] API endpoints respond correctly
- [ ] Frontend assets load properly
- [ ] Mobile responsiveness works
- [ ] Error logging is configured

## Monitoring

### Application Monitoring

- Use PM2 for process monitoring
- Set up error tracking (Sentry, Rollbar)
- Configure logging (Winston, Morgan)
- Monitor uptime (UptimeRobot, Pingdom)

### Performance Monitoring

- Google Analytics
- New Relic or DataDog
- Lighthouse CI for performance testing

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :3001
# Kill process
kill -9 PID
```

**Database connection fails:**
- Check DATABASE_URL format
- Verify database credentials
- Ensure database accepts external connections
- Check firewall rules

**Build fails:**
- Clear node_modules and reinstall
- Check Node.js version (20+ required)
- Verify all environment variables are set

**SSL certificate issues:**
- Ensure DNS points to server
- Check Nginx configuration
- Verify certbot installation

## Scaling

For high-traffic scenarios:

1. **Use Load Balancer** - Distribute traffic across multiple instances
2. **Database Replication** - Set up read replicas
3. **CDN** - Use CloudFlare or AWS CloudFront
4. **Caching** - Implement Redis for caching
5. **Horizontal Scaling** - Deploy multiple instances with PM2 cluster mode

## Backup Strategy

```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backups
0 2 * * * pg_dump $DATABASE_URL > /backups/db_$(date +\%Y\%m\%d).sql
```

## Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/luxurystores888-afk/market-10.2/issues)
- Join our Discord community
- Email: support@cybermart2077.com

---

**Happy Deploying! 🚀**
