// ENHANCED RATE LIMITING & SECURITY
// Extracted patterns from tocontiniue-building-web(4) and enhanced for CYBER MART 2077

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Advanced rate limiting with dynamic thresholds
export const cyberMartRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: Request) => {
    // Dynamic limits based on user type and endpoint
    if (req.path.includes('/api/ai/')) return 100; // AI endpoints - more restrictive
    if (req.path.includes('/api/admin/')) return 50; // Admin endpoints
    if (req.headers.authorization) return 2000; // Authenticated users
    return 1000; // Anonymous users
  },
  message: {
    error: 'Neural network overload detected. Please reduce request frequency.',
    code: 'CYBER_RATE_LIMIT',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Multi-factor key generation for better security
    return `${req.ip}:${req.headers['user-agent'] || ''}:${req.headers.authorization ? 'auth' : 'anon'}`;
  },
  // Enhanced logging handled by skip function instead of deprecated onLimitReached
  skip: (req: Request) => {
    // Log rate limit info when not skipping
    if (req.rateLimit && req.rateLimit.remaining === 0) {
      console.log(`🚨 Rate limit exceeded for ${req.ip} on ${req.path}`);
    }
    return false; // Don't skip any requests
  }
});

// Specialized rate limit for AI-intensive operations
export const aiProcessingLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Very restrictive for AI calls
  message: {
    error: 'AI processing capacity reached. Please wait before making more AI requests.',
    code: 'AI_RATE_LIMIT'
  }
});

// Dynamic DDoS protection
export const ddosProtection = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Very high threshold
  message: {
    error: 'Cyberpunk defense systems activated. Access temporarily restricted.',
    code: 'DDOS_PROTECTION'
  },
  skip: (req: Request) => {
    // Skip for trusted IPs or internal services
    const trustedIPs = ['127.0.0.1', '::1'];
    return trustedIPs.includes(req.ip);
  }
});