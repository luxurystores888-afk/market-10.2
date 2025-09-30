# 🚀 CYBER MART 2077 - COMPLETE SETUP INSTRUCTIONS

## Prerequisites Installation

### 1. Install Node.js and npm
- Download and install Node.js (v18 or higher) from: https://nodejs.org/
- This will automatically install npm as well
- Verify installation: 
  ```bash
  node --version
  npm --version
  ```

### 2. Install PostgreSQL Database
- Download and install PostgreSQL from: https://www.postgresql.org/download/
- During installation, remember your postgres user password
- Create a new database:
  ```sql
  CREATE DATABASE cybermart2077;
  ```

## 🚀 Quick Setup Steps

### Step 1: Environment Configuration
1. Create a `.env` file in the project root with this content:

```env
# 🚀 CYBER MART 2077 - ENVIRONMENT CONFIGURATION

# Database Configuration (Required)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cybermart2077"

# Authentication & Security (Required)
JWT_SECRET="cyber_mart_2077_super_secure_jwt_secret_change_this"

# AI Service API Keys (Optional but recommended)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""

# Payment Gateway Configuration (Optional)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# Production Configuration
NODE_ENV="development"
PORT="3001"
ALLOWED_ORIGINS="http://localhost:5000,http://localhost:3000"

# Automation Configuration
AUTOMATION_ENABLED="true"
PRODUCT_GENERATION_INTERVAL="2"
PRICING_UPDATE_INTERVAL="5"
MARKETING_CAMPAIGN_INTERVAL="1"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup
```bash
npm run db:push
```

### Step 4: Build Application
```bash
npm run build
```

### Step 5: Start Development Servers

**Option A: Start Both Servers Automatically**
```bash
npm run quick-start
```

**Option B: Start Servers Manually**
```bash
# Terminal 1 - Backend (Port 3001)
npm run dev:server

# Terminal 2 - Frontend (Port 5000)  
npm run dev
```

## 🌐 Access Your Platform

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3001
- **Automation Dashboard**: http://localhost:5000/automation
- **Admin Dashboard**: http://localhost:5000/admin

## 🤖 Automation Features

### Start Automation Systems
```bash
npm run automation:start
```

### Check Automation Status
```bash
npm run automation:status
```

### Stop Automation
```bash
npm run automation:stop
```

## 🔑 API Keys Configuration (Optional)

### OpenAI API Key
1. Visit: https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env`: `OPENAI_API_KEY="your_key_here"`

### Anthropic API Key
1. Visit: https://console.anthropic.com/
2. Create a new API key
3. Add to `.env`: `ANTHROPIC_API_KEY="your_key_here"`

### Google AI (Gemini) API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env`: `GOOGLE_AI_API_KEY="your_key_here"`

### Stripe API Keys (for payments)
1. Visit: https://dashboard.stripe.com/apikeys
2. Get your secret and publishable keys
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_your_key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
   ```

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
- Set `NODE_ENV="production"`
- Use secure JWT_SECRET
- Configure production database URL
- Add production domain to ALLOWED_ORIGINS

## 🎮 Features Overview

### Automated Revenue Systems
- 🤖 AI Product Generation (every 2 hours)
- 💰 Dynamic Pricing (every 5 minutes)
- 📢 Marketing Campaigns (every hour)
- 📦 Smart Inventory (every 30 minutes)

### Revenue Engines
- 💎 **Mega Profit Engine**: 2.5x-5.8x revenue boost
- 🚀 **Viral Growth Engine**: Exponential user growth
- 👑 **Premium Subscription Engine**: Recurring revenue

### Advanced Features
- 🌐 Web3 & Crypto payments
- 🎨 NFT marketplace
- 🤖 AI shopping assistant
- 📊 Real-time analytics
- 🎮 Gaming elements

## 🛠️ Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `CREATE DATABASE cybermart2077;`

### Port Already in Use
- Change PORT in .env file
- Kill existing processes: `npx kill-port 3001`

### Build Failures
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

### API Key Issues
- Verify API keys are valid
- Check for extra spaces in .env
- Restart server after changing .env

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are configured
4. Check database connection

## 🎉 Success!

Once setup is complete, you'll have:
- ✅ Complete cyberpunk e-commerce platform
- ✅ AI-powered automation systems
- ✅ Multiple revenue generation engines
- ✅ Real-time analytics dashboard
- ✅ Web3 integration ready
- ✅ Mobile-responsive design

Your cyberpunk e-commerce empire is ready to dominate the digital world! 🚀
