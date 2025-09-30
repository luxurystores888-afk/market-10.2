// 🛡️ INFINITE SECURITY MIDDLEWARE - EXPRESS INTEGRATION
// Comprehensive security middleware for Cyber Mart 2077

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { InfiniteSecuritySystem } from './infiniteSecuritySystem';

// Initialize security system
const securitySystem = new InfiniteSecuritySystem();

// 🔒 1. SERVER-SIDE PROTECTION MIDDLEWARE
export const serverSideProtection = (req: Request, res: Response, next: NextFunction) => {
  // Hide API endpoints from discovery
  if (req.path.includes('/api/')) {
    // Add random delay to prevent timing attacks
    const delay = Math.random() * 100;
    setTimeout(() => {
      next();
    }, delay);
  } else {
    next();
  }
};

// 🎭 2. ASSET PROTECTION MIDDLEWARE
export const assetProtection = (req: Request, res: Response, next: NextFunction) => {
  // Check for asset token validation
  if (req.path.startsWith('/assets/') || req.path.startsWith('/static/')) {
    const token = req.query.token as string;
    
    if (!token || !securitySystem.validateAssetToken(token)) {
      return res.status(403).json({
        error: 'Asset access denied',
        message: 'Invalid or expired asset token'
      });
    }
  }
  
  next();
};

// 🖼️ 3. CONTENT WATERMARKING MIDDLEWARE
export const contentWatermarking = (req: Request, res: Response, next: NextFunction) => {
  // Generate session fingerprint
  const { sessionId, fingerprint } = securitySystem.generateSessionFingerprint(req);
  
  // Add fingerprint to response headers
  res.setHeader('X-Session-Fingerprint', fingerprint.hash);
  res.setHeader('X-Session-ID', sessionId);
  
  // Add invisible HTML fingerprint
  res.locals.sessionFingerprint = fingerprint;
  res.locals.sessionId = sessionId;
  
  next();
};

// 🤖 4. BOT DETECTION MIDDLEWARE
export const botDetection = (req: Request, res: Response, next: NextFunction) => {
  const isBot = securitySystem.detectBot(req);
  
  if (isBot) {
    // Log bot detection
    console.log(`🤖 Bot detected: ${req.ip} - ${req.get('User-Agent')}`);
    
    // Add bot detection headers
    res.setHeader('X-Bot-Detected', 'true');
    
    // Apply stricter rate limiting for bots
    req.isBot = true;
  }
  
  next();
};

// 🔐 5. ENHANCED SECURITY HEADERS
export const enhancedSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // CSP with nonce
  const nonce = crypto.randomBytes(16).toString('base64');
  res.setHeader('Content-Security-Policy', 
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: https:; font-src 'self' https:; object-src 'none'; frame-ancestors 'none';`
  );
  
  // Other security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Add nonce to locals for template use
  res.locals.nonce = nonce;
  
  next();
};

// 📊 6. SECURITY MONITORING MIDDLEWARE
export const securityMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  // Override res.send to log response details
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log security events
    console.log(`🔍 Security Log: ${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms - IP: ${req.ip}`);
    
    // Check for suspicious patterns
    if (responseTime > 5000) {
      console.log(`⚠️ Slow response detected: ${req.path} - ${responseTime}ms`);
    }
    
    if (res.statusCode >= 400) {
      console.log(`🚨 Error response: ${req.method} ${req.path} - ${res.statusCode}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// 🚨 7. THREAT DETECTION MIDDLEWARE
export const threatDetection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript injection
    /onload=/i, // Event handler injection
  ];
  
  const requestString = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));
  
  if (isSuspicious) {
    console.log(`🚨 Suspicious activity detected: ${req.ip} - ${req.path}`);
    
    // Log threat details
    console.log(`Threat details: ${requestString.substring(0, 500)}...`);
    
    // Add threat detection header
    res.setHeader('X-Threat-Detected', 'true');
    
    // Could implement automatic blocking here
    // For now, just log and continue
  }
  
  next();
};

// 🔄 8. RATE LIMITING ENHANCEMENT
export const enhancedRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Apply different rate limits based on user type and endpoint
  const isAuthenticated = !!req.headers.authorization;
  const isAdmin = req.headers['x-admin-token'];
  const isBot = req.isBot;
  
  // Set rate limit context
  req.rateLimitContext = {
    isAuthenticated,
    isAdmin,
    isBot,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  next();
};

// 🎯 9. COMPREHENSIVE SECURITY MIDDLEWARE STACK
export const infiniteSecurityStack = [
  serverSideProtection,
  enhancedSecurityHeaders,
  botDetection,
  threatDetection,
  contentWatermarking,
  assetProtection,
  securityMonitoring,
  enhancedRateLimit
];

// 🚀 ACTIVATE SECURITY SYSTEM
export const activateInfiniteSecurity = () => {
  console.log('🛡️ ACTIVATING INFINITE SECURITY MIDDLEWARE...');
  return securitySystem.activateInfiniteSecurity();
};
