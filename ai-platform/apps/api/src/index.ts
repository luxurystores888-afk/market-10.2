import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import aiRoutes from './routes/ai.js';
import cryptoRoutes from './routes/crypto.js';
import chatRoutes from './routes/chat.js';
import documentsRoutes from './routes/documents.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import webhooksRoutes from './routes/webhooks.js';
import healthRoutes from './routes/health.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestValidator } from './middleware/validation.js';
import { auditLogger } from './middleware/audit.js';
import { performanceMonitor } from './middleware/performance.js';
import { securityHeaders } from './middleware/security.js';

// Import services
import { DatabaseService } from './services/database.js';
import { RedisService } from './services/redis.js';
import { SocketService } from './services/socket.js';
import { AIService } from './services/ai.js';
import { CryptoService } from './services/crypto.js';
import { EmailService } from './services/email.js';
import { QueueService } from './services/queue.js';
import { MonitoringService } from './services/monitoring.js';
import { CacheService } from './services/cache.js';

// Import types
import type { Express, Request, Response, NextFunction } from 'express';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  API_VERSION: z.string().default('v1'),
  
  // Database
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_KEY_FILE: z.string().optional(),
  
  // Crypto
  INFURA_PROJECT_ID: z.string().optional(),
  ALCHEMY_API_KEY: z.string().optional(),
  
  // Payment
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Monitoring
  PROMETHEUS_PORT: z.string().transform(Number).default('9090'),
  GRAFANA_URL: z.string().optional(),
  
  // Security
  CORS_ORIGIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Features
  ENABLE_SWAGGER: z.string().transform(Boolean).default('true'),
  ENABLE_METRICS: z.string().transform(Boolean).default('true'),
  ENABLE_REAL_TIME: z.string().transform(Boolean).default('true'),
  ENABLE_AI: z.string().transform(Boolean).default('true'),
  ENABLE_CRYPTO: z.string().transform(Boolean).default('true'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

class Application {
  private app: Express;
  private server: any;
  private io: SocketIOServer | undefined;
  private services: {
    database: DatabaseService;
    redis: RedisService;
    socket: SocketService;
    ai: AIService;
    crypto: CryptoService;
    email: EmailService;
    queue: QueueService;
    monitoring: MonitoringService;
    cache: CacheService;
  };

  constructor() {
    this.app = express();
    this.services = this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private initializeServices() {
    const database = new DatabaseService(env.DATABASE_URL);
    const redis = new RedisService(env.REDIS_URL);
    const cache = new CacheService(redis);
    const monitoring = new MonitoringService();
    const queue = new QueueService(redis);
    const email = new EmailService({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    });
    const ai = new AIService({
      openaiApiKey: env.OPENAI_API_KEY,
      anthropicApiKey: env.ANTHROPIC_API_KEY,
      googleCloudProjectId: env.GOOGLE_CLOUD_PROJECT_ID,
      googleCloudKeyFile: env.GOOGLE_CLOUD_KEY_FILE,
    });
    const crypto = new CryptoService({
      infuraProjectId: env.INFURA_PROJECT_ID,
      alchemyApiKey: env.ALCHEMY_API_KEY,
    });
    const socket = new SocketService();

    return {
      database,
      redis,
      socket,
      ai,
      crypto,
      email,
      queue,
      monitoring,
      cache,
    };
  }

  private setupMiddleware(): void {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'", "'unsafe-eval'"], // unsafe-eval needed for AI models
          connectSrc: ["'self'", "wss:", "https:"],
          mediaSrc: ["'self'", "blob:"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Required for SharedArrayBuffer in AI models
    }));

    // CORS configuration
    this.app.use(cors({
      origin: (origin, callback) => {
        const allowedOrigins = env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
    }));

    // Compression
    this.app.use(compression());

    // Request parsing
    this.app.use(express.json({ 
      limit: '50mb',
      verify: (req: any, res, buf) => {
        // Store raw body for webhook verification
        req.rawBody = buf;
      }
    }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Logging
    this.app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Custom middleware
    this.app.use(securityHeaders);
    this.app.use(performanceMonitor);
    this.app.use(auditLogger);

    // Add services to request object
    this.app.use((req: any, res, next) => {
      req.services = this.services;
      next();
    });
  }

  private setupRoutes(): void {
    // Health check (no auth required)
    this.app.use('/health', healthRoutes);

    // API routes
    const apiRouter = express.Router();
    
    // Public routes
    apiRouter.use('/auth', authRoutes);
    apiRouter.use('/webhooks', webhooksRoutes);
    
    // Protected routes
    apiRouter.use('/users', authenticateToken, userRoutes);
    apiRouter.use('/ai', authenticateToken, aiRoutes);
    apiRouter.use('/crypto', authenticateToken, cryptoRoutes);
    apiRouter.use('/chat', authenticateToken, chatRoutes);
    apiRouter.use('/documents', authenticateToken, documentsRoutes);
    apiRouter.use('/analytics', authenticateToken, analyticsRoutes);
    apiRouter.use('/admin', authenticateToken, adminRoutes);

    this.app.use(`/api/${env.API_VERSION}`, apiRouter);

    // Swagger documentation (development only)
    if (env.NODE_ENV === 'development' && env.ENABLE_SWAGGER) {
      this.setupSwagger();
    }

    // Metrics endpoint
    if (env.ENABLE_METRICS) {
      this.app.get('/metrics', this.services.monitoring.getMetrics.bind(this.services.monitoring));
    }

    // Catch-all route
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupSwagger(): void {
    import('swagger-ui-express').then((swaggerUi) => {
      import('./docs/swagger.js').then((swaggerDocument) => {
        this.app.use('/api-docs', swaggerUi.default.serve, swaggerUi.default.setup(swaggerDocument.default));
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('UNHANDLED_REJECTION');
    });

    // Handle process signals
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private async initializeRealTime(): Promise<void> {
    if (!env.ENABLE_REAL_TIME) return;

    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    });

    // Initialize socket service
    this.services.socket.initialize(this.io);

    console.log('🔄 Real-time features initialized');
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await this.services.database.initialize();
      console.log('📊 Database connected');

      // Initialize Redis
      await this.services.redis.initialize();
      console.log('🔄 Redis connected');

      // Initialize real-time features
      await this.initializeRealTime();

      // Start monitoring
      if (env.ENABLE_METRICS) {
        this.services.monitoring.start(env.PROMETHEUS_PORT);
        console.log(`📈 Monitoring started on port ${env.PROMETHEUS_PORT}`);
      }

      // Start queue processing
      await this.services.queue.start();
      console.log('🔄 Queue processing started');

      // Start server
      const server = this.server || this.app;
      server.listen(env.PORT, () => {
        console.log(`
🚀 AI-Powered Platform API Server Started
🌐 Environment: ${env.NODE_ENV}
📡 Port: ${env.PORT}
📋 API Version: ${env.API_VERSION}
📚 Documentation: http://localhost:${env.PORT}/api-docs
🏥 Health Check: http://localhost:${env.PORT}/health
📊 Metrics: http://localhost:${env.PORT}/metrics
⚡ Real-time: ${env.ENABLE_REAL_TIME ? 'Enabled' : 'Disabled'}
🤖 AI Features: ${env.ENABLE_AI ? 'Enabled' : 'Disabled'}
₿ Crypto Features: ${env.ENABLE_CRYPTO ? 'Enabled' : 'Disabled'}
        `);
      });

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

    try {
      // Stop accepting new connections
      if (this.server) {
        this.server.close(() => {
          console.log('🔌 HTTP server closed');
        });
      }

      // Close Socket.IO
      if (this.io) {
        this.io.close(() => {
          console.log('🔄 Socket.IO server closed');
        });
      }

      // Stop queue processing
      await this.services.queue.stop();
      console.log('🔄 Queue processing stopped');

      // Stop monitoring
      this.services.monitoring.stop();
      console.log('📈 Monitoring stopped');

      // Close database connections
      await this.services.database.close();
      console.log('📊 Database connections closed');

      // Close Redis connections
      await this.services.redis.close();
      console.log('🔄 Redis connections closed');

      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new Application();
app.start().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});

export default app;
