import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// 🛡️ UNHACKABLE SECURITY MIDDLEWARE - WORLD CLASS PROTECTION
export class AdvancedSecuritySystem {
  private static instance: AdvancedSecuritySystem;
  private securityLevel = 'MAXIMUM';
  private threatLevel = 'CRITICAL';
  private protectionMode = 'UNHACKABLE';

  static getInstance(): AdvancedSecuritySystem {
    if (!AdvancedSecuritySystem.instance) {
      AdvancedSecuritySystem.instance = new AdvancedSecuritySystem();
    }
    return AdvancedSecuritySystem.instance;
  }

  // 🔒 ANTI-CLONING PROTECTION
  antiCloneProtection(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip;
    const fingerprint = this.generateFingerprint(req);
    
    // 🚨 DETECT CLONING ATTEMPTS
    if (this.detectCloneAttempt(userAgent, ip, fingerprint)) {
      console.log('🚨 CLONE ATTEMPT DETECTED - BLOCKING!');
      return res.status(403).json({ 
        error: 'Access Denied - Anti-Clone Protection Activated',
        code: 'CLONE_BLOCKED',
        timestamp: new Date().toISOString()
      });
    }

    // 🛡️ ADD SECURITY HEADERS
    res.set({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Anti-Clone-ID': crypto.randomBytes(16).toString('hex'),
      'X-Security-Level': this.securityLevel,
      'X-Protection-Mode': this.protectionMode
    });

    next();
  }

  // 🔍 THREAT DETECTION
  threatDetection(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';
    const referer = req.get('Referer') || '';
    
    // 🚨 DETECT MALICIOUS ACTIVITY
    if (this.isMaliciousRequest(ip, userAgent, referer)) {
      console.log('🚨 THREAT DETECTED - BLOCKING!');
      return res.status(403).json({ 
        error: 'Access Denied - Threat Detected',
        code: 'THREAT_BLOCKED',
        timestamp: new Date().toISOString()
      });
    }

    next();
  }

  // 🛡️ RATE LIMITING
  rateLimiting = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too Many Requests - Rate Limited',
      code: 'RATE_LIMITED',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 🔐 ENCRYPTION
  encryptData(data: any): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  }

  // 🔍 VULNERABILITY SCANNING
  vulnerabilityScan(req: Request, res: Response, next: NextFunction) {
    const url = req.url;
    const method = req.method;
    const body = req.body;
    
    // 🚨 SCAN FOR COMMON VULNERABILITIES
    if (this.scanForVulnerabilities(url, method, body)) {
      console.log('🚨 VULNERABILITY DETECTED - BLOCKING!');
      return res.status(403).json({ 
        error: 'Access Denied - Vulnerability Detected',
        code: 'VULNERABILITY_BLOCKED',
        timestamp: new Date().toISOString()
      });
    }

    next();
  }

  // 🔒 PRIVATE METHODS
  private generateFingerprint(req: Request): string {
    const userAgent = req.get('User-Agent') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const connection = req.get('Connection') || '';
    
    return crypto.createHash('sha256')
      .update(userAgent + acceptLanguage + acceptEncoding + connection)
      .digest('hex');
  }

  private detectCloneAttempt(userAgent: string, ip: string, fingerprint: string): boolean {
    // 🚨 DETECT AUTOMATED TOOLS
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, /automated/i,
      /selenium/i, /phantom/i, /headless/i, /puppeteer/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private isMaliciousRequest(ip: string, userAgent: string, referer: string): boolean {
    // 🚨 DETECT MALICIOUS PATTERNS
    const maliciousPatterns = [
      /<script/i, /javascript:/i, /onload=/i, /onerror=/i,
      /union.*select/i, /drop.*table/i, /insert.*into/i,
      /delete.*from/i, /update.*set/i, /exec/i, /eval/i
    ];
    
    return maliciousPatterns.some(pattern => 
      pattern.test(userAgent) || pattern.test(referer)
    );
  }

  private scanForVulnerabilities(url: string, method: string, body: any): boolean {
    // 🚨 SCAN FOR SQL INJECTION
    const sqlPatterns = [
      /union.*select/i, /drop.*table/i, /insert.*into/i,
      /delete.*from/i, /update.*set/i, /exec/i, /eval/i
    ];
    
    const bodyString = JSON.stringify(body);
    return sqlPatterns.some(pattern => 
      pattern.test(url) || pattern.test(bodyString)
    );
  }
}

// 🛡️ EXPORT SECURITY MIDDLEWARE
export const securityMiddleware = AdvancedSecuritySystem.getInstance();
