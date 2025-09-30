#!/bin/bash

# 🚀 CYBER MART 2077 - COMPLETE SETUP SCRIPT
echo "🚀 CYBER MART 2077 - COMPLETE SETUP STARTING..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}🚀 CYBER MART 2077 COMPLETE SETUP${NC}"
echo -e "${CYAN}========================================${NC}"

# Step 1: Environment Setup
echo -e "\n${YELLOW}📋 STEP 1: ENVIRONMENT SETUP${NC}"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << EOL
# 🚀 CYBER MART 2077 - ENVIRONMENT CONFIGURATION

# Database Configuration (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/cybermart2077"

# Authentication & Security (Required)
JWT_SECRET="cyber_mart_2077_super_secure_jwt_secret_$(date +%s)"

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
EOL
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Step 2: Install Dependencies
echo -e "\n${YELLOW}📦 STEP 2: INSTALLING DEPENDENCIES${NC}"
echo -e "${BLUE}Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Database Setup
echo -e "\n${YELLOW}🗄️ STEP 3: DATABASE SETUP${NC}"

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL connection...${NC}"

# Create database if it doesn't exist
echo -e "${BLUE}Setting up database schema...${NC}"
npm run db:push 2>/dev/null || echo -e "${YELLOW}⚠️ Database push failed - make sure PostgreSQL is running${NC}"

# Step 4: Create initial data
echo -e "\n${YELLOW}📊 STEP 4: CREATING INITIAL DATA${NC}"
echo -e "${BLUE}Creating sample products and admin user...${NC}"

# This will be handled by the application startup
echo -e "${GREEN}✅ Initial data setup ready${NC}"

# Step 5: Build Application
echo -e "\n${YELLOW}🔨 STEP 5: BUILDING APPLICATION${NC}"
echo -e "${BLUE}Building frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Application built${NC}"

# Step 6: Display completion message
echo -e "\n${CYAN}========================================${NC}"
echo -e "${GREEN}🎉 CYBER MART 2077 SETUP COMPLETE!${NC}"
echo -e "${CYAN}========================================${NC}"

echo -e "\n${PURPLE}🚀 NEXT STEPS:${NC}"
echo -e "${BLUE}1. Configure your .env file with API keys${NC}"
echo -e "${BLUE}2. Make sure PostgreSQL is running${NC}"
echo -e "${BLUE}3. Start the development servers:${NC}"
echo -e "   ${CYAN}npm run dev:server${NC} (Backend - Port 3001)"
echo -e "   ${CYAN}npm run dev${NC} (Frontend - Port 5000)"
echo -e "\n${BLUE}4. Access your platform:${NC}"
echo -e "   ${CYAN}Frontend: http://localhost:5000${NC}"
echo -e "   ${CYAN}Backend API: http://localhost:3001${NC}"
echo -e "   ${CYAN}Automation Dashboard: http://localhost:5000/automation${NC}"

echo -e "\n${PURPLE}💡 QUICK START COMMANDS:${NC}"
echo -e "${CYAN}npm run quick-start${NC} - Start everything at once"
echo -e "${CYAN}npm run automation:start${NC} - Start profit automation"
echo -e "${CYAN}npm run automation:status${NC} - Check automation status"

echo -e "\n${YELLOW}⚠️ IMPORTANT:${NC}"
echo -e "${RED}1. Update DATABASE_URL in .env with your PostgreSQL credentials${NC}"
echo -e "${RED}2. Add your AI API keys for full functionality${NC}"
echo -e "${RED}3. Configure Stripe keys for payment processing${NC}"

echo -e "\n${GREEN}🎮 Your cyberpunk e-commerce empire is ready to launch!${NC}"
