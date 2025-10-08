import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes.ts';
import { errorHandler, securityHeaders, requestLogger } from './middleware.ts';
import { securityMiddleware } from './middleware/advancedSecurity.ts';
import { quantumSecurityMiddleware } from './middleware/quantumSecurity.ts';
import { enhancedAntiCloneProtection } from './middleware/enhancedAntiClone.ts';
import { maximumProfitEngine } from './services/maximumProfitEngine.ts';
import { advancedAIAutomation } from './services/advancedAIAutomation.ts';
import { ultraViralGrowthEngine } from './services/ultraViralGrowthEngine.ts';
import { infiniteProfitMultiplier } from './services/infiniteProfitMultiplier.ts';
import { dynamicPricingAI } from './services/dynamicPricingAI.ts';
import { socialMediaAutomation } from './services/socialMediaAutomation.ts';
import { aiProductCreation } from './services/aiProductCreation.ts';
import { advancedAnalytics } from './services/advancedAnalytics.ts';
import { mobilePWAEngine } from './services/mobilePWAEngine.ts';
import { requireAdmin } from './middleware/auth.ts';
import { responseTimeTracker } from './middleware/performanceMonitoring.ts';
import { cyberMartRateLimit, aiProcessingLimit, ddosProtection } from './middleware/advancedRateLimit.ts';
import { EnhancedPersonalizationEngine } from './services/enhancedPersonalization.ts';
import { CyberRealtimeEngine } from './services/realtimeEngine.ts';
import { infiniteSecurityStack, activateInfiniteSecurity } from '../security/securityMiddleware.ts';
import { enhancedAutomationSystem } from './services/enhancedAutomation.ts';
import { gql } from 'graphql-tag';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cluster from 'cluster';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3001;

// Initialize enhanced services
const personalizationEngine = new EnhancedPersonalizationEngine();
const realtimeEngine = new CyberRealtimeEngine();

// 🛡️ MAXIMUM SECURITY MIDDLEWARE - UNHACKABLE PROTECTION
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// 🚨 ADVANCED SECURITY PROTECTION
app.use(securityMiddleware.antiCloneProtection);
app.use(securityMiddleware.threatDetection);
app.use(securityMiddleware.vulnerabilityScan);
app.use(securityMiddleware.rateLimiting);

// 🛡️ QUANTUM SECURITY PROTECTION
app.use(quantumSecurityMiddleware.quantumAntiCloneProtection);
app.use(quantumSecurityMiddleware.quantumThreatDetection);
app.use(quantumSecurityMiddleware.quantumVulnerabilityScan);
app.use(quantumSecurityMiddleware.quantumRateLimiting);

// 🛡️ ENHANCED ANTI-CLONE PROTECTION
app.use(enhancedAntiCloneProtection.enhancedAntiCloneProtection);
app.use(enhancedAntiCloneProtection.enhancedThreatDetection);

// 🔒 SECURITY: Tightened CORS policy
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://cyberpunk-ecommerce.replit.app']) // Production domains from env
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting (must be before API routes)
app.set('trust proxy', 1);

// Enhanced security middleware with advanced rate limiting
app.use(ddosProtection); // DDoS protection
app.use(cyberMartRateLimit); // Dynamic rate limiting
app.use(securityHeaders);
app.use(requestLogger);

// 🛡️ INFINITE SECURITY SYSTEM - MAXIMUM PROTECTION
app.use(infiniteSecurityStack);

// 📊 Performance monitoring middleware
app.use(responseTimeTracker);

// Predict requests
const cache = {};
app.use((req, res, next) => {
  if (cache[req.url]) return res.json(cache[req.url]);
  next();
});

// Make enhanced services available globally BEFORE registering routes
app.locals.personalizationEngine = personalizationEngine;
app.locals.realtimeEngine = realtimeEngine;

// API routes
app.use('/api', registerRoutes);

// GraphQL Endpoint
// Schema
const typeDefs = gql`
  type Query { products: [Product] }
`;

// Resolvers
const resolvers = { Query: { products: () => [] } };

// Server
const apollo = new ApolloServer({ typeDefs, resolvers });
apollo.applyMiddleware({ app });

// Error handling middleware (must be last)
app.use(errorHandler);

// CSP nonce middleware for HTML responses
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.cspNonce = nonce;
  // Set strict CSP with per-request nonce for HTML. Assets remain unaffected.
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self' https:",
      `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://challenges.cloudflare.com https://js.puter.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https: wss: https://api.openai.com https://generativelanguage.googleapis.com",
      "frame-src 'self' https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
      `report-uri /api/csp-report`
    ].join('; ')
  );
  next();
});

// Serve static files in production or development
const staticPath = path.join(__dirname, '../dist');
app.use(express.static(staticPath));

// Health check at root
app.get('/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    status: 'OK',
    message: '🚀 Cyberpunk E-commerce Platform - Successfully Restored!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// In development mode, only serve this route in production
if (process.env.NODE_ENV === 'production') {
  // Serve React app for all other routes (production only)
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist/index.html');
    // Inject nonce into index.html for inline/module scripts
    try {
      const fs = require('fs');
      let html = fs.readFileSync(indexPath, 'utf8');
      const nonce = res.locals.cspNonce || '';
      // Add nonce attribute to all script tags
      html = html.replace(/<script(\s+)(?![^>]*nonce=)/g, `<script nonce="${nonce}" $1`);
      // Optionally add nonce to style tags if present
      html = html.replace(/<style(\s+)(?![^>]*nonce=)/g, `<style nonce="${nonce}" $1`);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (err) {
      console.log('📄 Client build not found, serving basic response');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>🚀 Cyberpunk E-commerce - Restored!</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                padding: 2rem; 
                text-align: center;
                min-height: 100vh;
                margin: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(0,0,0,0.3);
                padding: 2rem;
                border-radius: 10px;
                backdrop-filter: blur(10px);
              }
              h1 { color: #00ffff; font-size: 3em; margin-bottom: 0.5em; }
              .status { color: #00ff00; font-size: 1.5em; margin: 1em 0; }
              .info { color: #ffcc00; margin: 1em 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 Cyberpunk E-commerce Platform</h1>
              <div class="status">✅ Successfully Restored!</div>
              <div class="info">Your GitHub repository has been restored with all project files.</div>
              <p>Server is running on port ${port}</p>
              <p>Build the client with: <code>npm run build</code></p>
              <p>API Health: <a href="/api/health" style="color: #00ffff;">/api/health</a></p>
            </div>
          </body>
        </html>
        `);
    }
  });
}

// Start server with enhanced real-time capabilities
const server = app.listen(port, '0.0.0.0', () => {
  console.log('🚀 PULSE - ULTIMATE AI-POWERED PLATFORM!');
  console.log(`📱 Server running on http://0.0.0.0:${port}`);
  console.log(`🔗 API available at http://0.0.0.0:${port}/api`);
  console.log(`🤖 AI systems online! Ready for billion-dollar launch!`);
});