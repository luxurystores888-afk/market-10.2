# 🌆 Cyber Mart 2077

> Modern cyberpunk-themed e-commerce platform built with React, TypeScript, and PostgreSQL

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### Core E-commerce
- 🛒 **Shopping Cart** - Real-time cart with quantity management
- 📦 **Product Catalog** - Advanced filtering, sorting, and search
- 💳 **Payment Integration** - Stripe and crypto payment support
- 👤 **User Authentication** - Secure JWT-based authentication
- 📊 **Order Management** - Complete order tracking system
- 📱 **Responsive Design** - Mobile-first responsive approach

### Advanced Features
- 🤖 **AI Recommendations** - OpenAI-powered product suggestions
- 📈 **Real-time Analytics** - Live sales and traffic monitoring
- 🎨 **3D Product Viewer** - Interactive Three.js visualization
- 🔔 **Push Notifications** - Web Push API for order updates
- 🌐 **Internationalization** - Multi-language support
- ⚡ **Progressive Web App** - Offline capability

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/luxurystores888-afk/market-10.2.git
cd market-10.2

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:push

# Start development
npm run dev:all
```

Visit http://localhost:5173

---

## 🏗️ Tech Stack

**Frontend:** React 18, TypeScript 5.6, Vite 7, Tailwind CSS, Radix UI, Three.js, Framer Motion

**Backend:** Express.js, PostgreSQL, Drizzle ORM, JWT, Helmet, Rate Limiting

**AI & Advanced:** OpenAI API, Transformers.js, Ethers.js, Web Push

---

## 📁 Project Structure

```
market-10.2/
├── api/              # Backend Express server
├── src/              # Frontend React app
│   ├── components/   # UI components
│   ├── pages/        # Route pages
│   ├── hooks/        # Custom hooks
│   └── lib/          # Utilities
├── public/           # Static assets
└── scripts/          # Automation
```

---

## 🔧 Scripts

```bash
npm run dev          # Frontend dev server
npm run dev:server   # Backend dev server
npm run dev:all      # Both servers
npm run build        # Production build
npm run db:push      # Database migrations
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker-compose up -d
```

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-32-char-secret
NODE_ENV=production
```

---

## 📚 Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Deployment Guide](./DEPLOY.md)
- [Security Policy](./SECURITY.md)

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

<div align="center">

**⚡ Built for the future of e-commerce ⚡**

[Report Bug](https://github.com/luxurystores888-afk/market-10.2/issues) • [Request Feature](https://github.com/luxurystores888-afk/market-10.2/issues)

</div>
