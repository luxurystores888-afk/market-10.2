# 🚀 CYBER MART 2077 - COMPLETE SETUP SCRIPT (PowerShell)

Write-Host "🚀 CYBER MART 2077 - COMPLETE SETUP STARTING..." -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 CYBER MART 2077 COMPLETE SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Environment Setup
Write-Host "`n📋 STEP 1: ENVIRONMENT SETUP" -ForegroundColor Yellow

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Blue
    
    $envContent = @"
# 🚀 CYBER MART 2077 - ENVIRONMENT CONFIGURATION

# Database Configuration (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/cybermart2077"

# Authentication & Security (Required)
JWT_SECRET="cyber_mart_2077_super_secure_jwt_secret_$(Get-Date -Format 'yyyyMMddHHmmss')"

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
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Step 2: Install Dependencies
Write-Host "`n📦 STEP 2: INSTALLING DEPENDENCIES" -ForegroundColor Yellow
Write-Host "Installing npm dependencies..." -ForegroundColor Blue
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 3: Database Setup
Write-Host "`n🗄️ STEP 3: DATABASE SETUP" -ForegroundColor Yellow
Write-Host "Setting up database schema..." -ForegroundColor Blue

# Try to push database schema
try {
    npm run db:push
    Write-Host "✅ Database schema created" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Database push failed - make sure PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "You can run 'npm run db:push' manually later" -ForegroundColor Yellow
}

# Step 4: Build Application
Write-Host "`n🔨 STEP 4: BUILDING APPLICATION" -ForegroundColor Yellow
Write-Host "Building frontend..." -ForegroundColor Blue
npm run build
Write-Host "✅ Application built" -ForegroundColor Green

# Step 5: Display completion message
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 CYBER MART 2077 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Magenta
Write-Host "1. Configure your .env file with API keys" -ForegroundColor Blue
Write-Host "2. Make sure PostgreSQL is running" -ForegroundColor Blue
Write-Host "3. Start the development servers:" -ForegroundColor Blue
Write-Host "   npm run dev:server  (Backend - Port 3001)" -ForegroundColor Cyan
Write-Host "   npm run dev         (Frontend - Port 5000)" -ForegroundColor Cyan

Write-Host "`n4. Access your platform:" -ForegroundColor Blue
Write-Host "   Frontend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Automation Dashboard: http://localhost:5000/automation" -ForegroundColor Cyan

Write-Host "`n💡 QUICK START COMMANDS:" -ForegroundColor Magenta
Write-Host "npm run quick-start      - Start everything at once" -ForegroundColor Cyan
Write-Host "npm run automation:start - Start profit automation" -ForegroundColor Cyan
Write-Host "npm run automation:status- Check automation status" -ForegroundColor Cyan

Write-Host "`n⚠️ IMPORTANT:" -ForegroundColor Yellow
Write-Host "1. Update DATABASE_URL in .env with your PostgreSQL credentials" -ForegroundColor Red
Write-Host "2. Add your AI API keys for full functionality" -ForegroundColor Red
Write-Host "3. Configure Stripe keys for payment processing" -ForegroundColor Red

Write-Host "`n🎮 Your cyberpunk e-commerce empire is ready to launch!" -ForegroundColor Green
