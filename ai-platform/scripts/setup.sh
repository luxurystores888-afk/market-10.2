#!/bin/bash

# AI Platform Setup Script
# This script sets up the development environment for the AI Platform

set -e

echo "🚀 AI Platform Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js version
echo -e "\n${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Error: Node.js 20+ is required${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version is compatible${NC}"

# Check if Docker is installed
echo -e "\n${YELLOW}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
echo -e "\n${YELLOW}Checking Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Create .env file if it doesn't exist
echo -e "\n${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Generate SSL certificates for local development
echo -e "\n${YELLOW}Generating SSL certificates...${NC}"
mkdir -p nginx/ssl
if [ ! -f nginx/ssl/cert.pem ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo -e "${GREEN}✓ SSL certificates generated${NC}"
else
    echo -e "${GREEN}✓ SSL certificates already exist${NC}"
fi

# Start Docker services
echo -e "\n${YELLOW}Starting Docker services...${NC}"
docker-compose up -d postgres redis elasticsearch minio
echo -e "${GREEN}✓ Docker services started${NC}"

# Wait for PostgreSQL to be ready
echo -e "\n${YELLOW}Waiting for PostgreSQL...${NC}"
until docker-compose exec -T postgres pg_isready -U aiplatform; do
    echo -n "."
    sleep 1
done
echo -e "\n${GREEN}✓ PostgreSQL is ready${NC}"

# Run database migrations
echo -e "\n${YELLOW}Running database migrations...${NC}"
npm run db:migrate --workspace=api
echo -e "${GREEN}✓ Database migrations completed${NC}"

# Seed database with demo data (optional)
echo -e "\n${YELLOW}Seeding database with demo data...${NC}"
npm run db:seed --workspace=api
echo -e "${GREEN}✓ Database seeded${NC}"

# Build the applications
echo -e "\n${YELLOW}Building applications...${NC}"
npm run build
echo -e "${GREEN}✓ Applications built${NC}"

# Generate API documentation
echo -e "\n${YELLOW}Generating API documentation...${NC}"
npm run docs:generate --workspace=api
echo -e "${GREEN}✓ API documentation generated${NC}"

# Create necessary directories
echo -e "\n${YELLOW}Creating directories...${NC}"
mkdir -p uploads logs
echo -e "${GREEN}✓ Directories created${NC}"

# Display success message
echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Edit .env file with your configuration"
echo -e "2. Run 'npm run dev' to start development servers"
echo -e "3. Visit http://localhost:3000 for the frontend"
echo -e "4. Visit http://localhost:3001/api/docs for API documentation"
echo -e "5. Visit http://localhost:3000/admin for the admin dashboard"

echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "npm run dev              - Start development servers"
echo -e "npm run test             - Run tests"
echo -e "npm run lint             - Run linting"
echo -e "npm run db:migrate       - Run database migrations"
echo -e "docker-compose up        - Start all services"
echo -e "docker-compose logs -f   - View logs"

echo -e "\n${GREEN}Happy coding! 🚀${NC}"
