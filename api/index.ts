import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes';
import { errorHandler, securityHeaders, requestLogger } from './middleware';
import { requireAdmin } from './middleware/auth';
import { responseTimeTracker } from './middleware/performanceMonitoring';
import { cyberMartRateLimit, aiProcessingLimit, ddosProtection } from './middleware/advancedRateLimit';
import { EnhancedPersonalizationEngine } from './services/enhancedPersonalization';
import { CyberRealtimeEngine } from './services/realtimeEngine';
import { infiniteSecurityStack, activateInfiniteSecurity } from '../security/securityMiddleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3001;

// Initialize enhanced services
const personalizationEngine = new EnhancedPersonalizationEngine();
const realtimeEngine = new CyberRealtimeEngine();

// Security and CORS middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

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

// Make enhanced services available globally BEFORE registering routes
app.locals.personalizationEngine = personalizationEngine;
app.locals.realtimeEngine = realtimeEngine;

// API routes
app.use('/api', registerRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Serve static files in production or development
const staticPath = path.join(__dirname, '../dist');
app.use(express.static(staticPath));

// Health check at root
app.get('/health', (req, res) => {
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
    res.sendFile(indexPath, (err) => {
      if (err) {
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
  });
}

// Start server with enhanced real-time capabilities
const server = app.listen(port, '0.0.0.0', () => {
  console.log('🚀 PULSE - ULTIMATE AI-POWERED PLATFORM!');
  console.log(`📱 Server running on http://0.0.0.0:${port}`);
  console.log(`🔗 API available at http://0.0.0.0:${port}/api`);
  console.log(`⚡ Real-time engine activated`);
  console.log(`🛡️ Advanced security enabled`);
  console.log(`🧠 AI personalization enhanced`);
  console.log(`📱 PWA capabilities added`);
  console.log(`🔥 Enhanced routes: /api/enhanced/*`);
  console.log(`📊 WebSocket endpoint: ws://0.0.0.0:${port}`);
  
  // 🛡️ ACTIVATE INFINITE SECURITY SYSTEM
  const securityStatus = activateInfiniteSecurity();
  console.log(`🛡️ ${securityStatus.message}`);
});

// Initialize enhanced real-time engine with WebSocket support
realtimeEngine.initialize(server);