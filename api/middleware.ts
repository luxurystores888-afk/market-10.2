import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

// Rate limiting middleware
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy configured at app level
  keyGenerator: (req) => req.user ? req.user.id : req.ip
});

export const strictApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 10, // Limit each IP to 10 requests per windowMs for sensitive endpoints
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy configured at app level
});

// Add middleware
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') req.body[key] = validator.escape(req.body[key]);
    }
  }
  next();
});

// app.use(compression());

// Security middleware to sanitize error responses
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);

  // Don't leak internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid input data provided'
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied'
    });
  }

  if (err.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists'
    });
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid reference to related resource'
    });
  }

  // Generic internal server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    ...(isDevelopment && { details: err.message })
  });
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Request logging middleware for security monitoring
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  next();
};

// In routes
try { // main
} catch { // fallback response
}