# 🛒 Cyber Mart 2077

> A modern, full-stack e-commerce platform with cyberpunk aesthetics, built with React, TypeScript, and Express.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

## ✨ Features

- 🎨 **Modern UI** - Cyberpunk-themed design with smooth animations
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 💳 **Payment Integration** - Stripe payment processing
- 📊 **Analytics Dashboard** - Real-time business insights
- 🌐 **Multi-language Support** - i18n internationalization
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Optimized with Vite and code splitting
- 🔍 **SEO Optimized** - Server-side rendering support
- 🛡️ **Security** - Helmet, CORS, rate limiting, and SQL injection protection

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 14+ database

### Installation

```bash
# Clone the repository
git clone https://github.com/luxurystores888-afk/market-10.2.git
cd market-10.2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push

# Start development servers
npm run dev:all
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3001

## 📁 Project Structure

```
market-10.2/
├── src/                # Frontend React application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── api/                # Backend Express API
│   ├── routes/         # API route handlers
│   ├── middleware/     # Express middleware
│   └── db/             # Database models and queries
├── public/             # Static assets
├── scripts/            # Build and deployment scripts
└── tests/              # Test suites
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Query** - Data fetching
- **Recharts** - Data visualization

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **JWT** - Authentication
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

### DevOps
- **Docker** - Containerization
- **PM2** - Process management
- **GitHub Actions** - CI/CD
- **Cypress** - E2E testing
- **Jest** - Unit testing

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server
npm run dev:server       # Start backend API server
npm run dev:all          # Start both frontend and backend

# Building
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push database schema changes

# Testing
npm run lint             # Run ESLint
npm test                 # Run tests

# Production
npm run production       # Start with PM2
npm run production:stop  # Stop PM2 processes
npm run production:logs  # View PM2 logs
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cybermart

# Authentication
JWT_SECRET=your-secret-key-here

# API Keys (Optional)
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=3001
NODE_ENV=development
```

### Database Setup

The application uses PostgreSQL with Drizzle ORM. Run migrations:

```bash
npm run db:push
```

## 🔐 Security

This application implements multiple security best practices:

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention via parameterized queries
- ✅ XSS protection with helmet
- ✅ Input validation and sanitization
- ✅ Secure HTTP headers

## 🚀 Deployment

### Deploy to Production

```bash
# Build the application
npm run build

# Start with PM2
npm run production
```

### Docker Deployment

```bash
# Build Docker image
docker build -t cyber-mart-2077 .

# Run container
docker-compose up -d
```

### Platform-Specific Guides

- [Deploy to Railway](./DEPLOY.md#railway)
- [Deploy to Vercel](./DEPLOY.md#vercel)
- [Deploy to Heroku](./DEPLOY.md#heroku)
- [Deploy to AWS](./DEPLOY.md#aws)

## 📊 Performance

- ⚡ Lighthouse Score: 95+
- 🎯 First Contentful Paint: <1.5s
- 📦 Bundle Size: Optimized with code splitting
- 🔄 API Response Time: <100ms average

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from cyberpunk aesthetics
- Icons from Lucide React
- UI components from Radix UI
- Community contributors

## 📞 Support

- 📧 Email: support@cybermart2077.com
- 💬 Discord: [Join our community](https://discord.gg/cybermart)
- 🐛 Issues: [GitHub Issues](https://github.com/luxurystores888-afk/market-10.2/issues)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment gateway integrations (PayPal, Crypto)
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace
- [ ] AI-powered product recommendations
- [ ] Social commerce features

---

**Made with ❤️ by the Cyber Mart team**
