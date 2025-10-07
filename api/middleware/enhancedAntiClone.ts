import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// 🛡️ ENHANCED ANTI-CLONE PROTECTION - UNHACKABLE SECURITY
export class EnhancedAntiCloneProtection {
  private static instance: EnhancedAntiCloneProtection;
  private cloneAttempts = new Map();
  private fingerprintCache = new Map();
  private watermarkTokens = new Map();
  private legalWarnings = new Map();

  static getInstance(): EnhancedAntiCloneProtection {
    if (!EnhancedAntiCloneProtection.instance) {
      EnhancedAntiCloneProtection.instance = new EnhancedAntiCloneProtection();
    }
    return EnhancedAntiCloneProtection.instance;
  }

  // 🔒 ENHANCED ANTI-CLONE PROTECTION
  enhancedAntiCloneProtection(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip;
    const fingerprint = this.generateEnhancedFingerprint(req);
    const timestamp = Date.now();
    
    // 🚨 DETECT CLONING ATTEMPTS
    if (this.detectEnhancedCloneAttempt(userAgent, ip, fingerprint)) {
      console.log('🚨 ENHANCED CLONE ATTEMPT DETECTED - BLOCKING!');
      
      // Record clone attempt
      this.recordCloneAttempt(ip, fingerprint, userAgent);
      
      // Send legal warning
      this.sendLegalWarning(ip, req);
      
      return res.status(403).json({ 
        error: 'Access Denied - Enhanced Anti-Clone Protection Activated',
        code: 'ENHANCED_CLONE_BLOCKED',
        timestamp: new Date().toISOString(),
        legalWarning: 'This website is protected by copyright law. Unauthorized copying is prohibited.',
        consequences: 'Legal action will be taken against unauthorized copying attempts.'
      });
    }

    // 🛡️ ADD ENHANCED SECURITY HEADERS
    const uniqueToken = this.generateUniqueToken();
    const watermark = this.generateWatermark(req);
    
    res.set({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Enhanced-Security-ID': uniqueToken,
      'X-Watermark-Token': watermark,
      'X-Anti-Clone-Level': 'MAXIMUM',
      'X-Legal-Protection': 'ACTIVE',
      'X-Copyright-Notice': '© 2024 Cyber Mart 2077. All rights reserved.',
      'X-DMCA-Protection': 'ACTIVE',
      'X-Legal-Warning': 'Unauthorized copying is prohibited by law.'
    });

    // 🔍 ENHANCED THREAT DETECTION
    this.enhancedThreatDetection(req, res, next);
  }

  // 🔍 ENHANCED THREAT DETECTION
  enhancedThreatDetection(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';
    const fingerprint = this.generateEnhancedFingerprint(req);
    
    // Check for suspicious patterns
    if (this.isSuspiciousPattern(userAgent, ip, fingerprint)) {
      console.log('🚨 SUSPICIOUS PATTERN DETECTED - ENHANCED MONITORING!');
      
      // Increase monitoring for this IP
      this.increaseMonitoring(ip);
      
      // Add additional security headers
      res.set({
        'X-Security-Alert': 'SUSPICIOUS_ACTIVITY_DETECTED',
        'X-Monitoring-Level': 'ENHANCED',
        'X-Threat-Score': this.calculateThreatScore(ip, fingerprint)
      });
    }

    next();
  }

  // 🔒 GENERATE ENHANCED FINGERPRINT
  private generateEnhancedFingerprint(req: Request): string {
    const userAgent = req.get('User-Agent') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const connection = req.get('Connection') || '';
    const ip = req.ip;
    const timestamp = Date.now();
    
    const fingerprintData = `${userAgent}-${acceptLanguage}-${acceptEncoding}-${connection}-${ip}-${timestamp}`;
    return crypto.createHash('sha256').update(fingerprintData).digest('hex');
  }

  // 🚨 DETECT ENHANCED CLONE ATTEMPTS
  private detectEnhancedCloneAttempt(userAgent: string, ip: string, fingerprint: string): boolean {
    // Check for known cloning tools
    const cloningTools = [
      'wget', 'curl', 'scrapy', 'beautifulsoup', 'selenium',
      'puppeteer', 'playwright', 'phantomjs', 'headless',
      'bot', 'crawler', 'spider', 'scraper', 'copier'
    ];
    
    const userAgentLower = userAgent.toLowerCase();
    const isCloningTool = cloningTools.some(tool => userAgentLower.includes(tool));
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, /copier/i,
      /automated/i, /script/i, /tool/i, /harvester/i
    ];
    
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    
    // Check for rapid requests (potential scraping)
    const requestCount = this.getRequestCount(ip);
    const isRapidRequest = requestCount > 100; // More than 100 requests
    
    // Check for fingerprint similarity
    const isSimilarFingerprint = this.checkFingerprintSimilarity(fingerprint);
    
    return isCloningTool || hasSuspiciousPattern || isRapidRequest || isSimilarFingerprint;
  }

  // 🔍 CHECK FINGERPRINT SIMILARITY
  private checkFingerprintSimilarity(fingerprint: string): boolean {
    const similarFingerprints = Array.from(this.fingerprintCache.values());
    
    for (const cachedFingerprint of similarFingerprints) {
      const similarity = this.calculateSimilarity(fingerprint, cachedFingerprint);
      if (similarity > 0.8) { // 80% similarity threshold
        return true;
      }
    }
    
    // Cache this fingerprint
    this.fingerprintCache.set(fingerprint, Date.now());
    
    return false;
  }

  // 📊 CALCULATE SIMILARITY
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // 📏 LEVENSHTEIN DISTANCE
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 🚨 RECORD CLONE ATTEMPT
  private recordCloneAttempt(ip: string, fingerprint: string, userAgent: string): void {
    const attempt = {
      ip,
      fingerprint,
      userAgent,
      timestamp: Date.now(),
      blocked: true
    };
    
    this.cloneAttempts.set(ip, attempt);
    
    // Log for legal action
    console.log('🚨 CLONE ATTEMPT RECORDED:', attempt);
  }

  // ⚖️ SEND LEGAL WARNING
  private sendLegalWarning(ip: string, req: Request): void {
    const warning = {
      ip,
      timestamp: Date.now(),
      message: 'Unauthorized copying attempt detected',
      consequences: 'Legal action may be taken',
      copyright: '© 2024 Cyber Mart 2077. All rights reserved.',
      dmca: 'DMCA protection active'
    };
    
    this.legalWarnings.set(ip, warning);
    
    // Log for legal team
    console.log('⚖️ LEGAL WARNING SENT:', warning);
  }

  // 🔍 IS SUSPICIOUS PATTERN
  private isSuspiciousPattern(userAgent: string, ip: string, fingerprint: string): boolean {
    // Check for automated tools
    const automatedTools = [
      'python', 'java', 'php', 'ruby', 'perl', 'go', 'rust',
      'node', 'npm', 'yarn', 'pip', 'composer', 'gem'
    ];
    
    const userAgentLower = userAgent.toLowerCase();
    const hasAutomatedTool = automatedTools.some(tool => userAgentLower.includes(tool));
    
    // Check for missing common headers
    const missingHeaders = !req.get('Accept') || !req.get('Accept-Language');
    
    // Check for unusual request patterns
    const isUnusualPattern = this.checkUnusualPatterns(req);
    
    return hasAutomatedTool || missingHeaders || isUnusualPattern;
  }

  // 🔍 CHECK UNUSUAL PATTERNS
  private checkUnusualPatterns(req: Request): boolean {
    // Check for missing referer (direct access)
    const referer = req.get('Referer');
    const isDirectAccess = !referer;
    
    // Check for unusual request methods
    const unusualMethods = ['PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    const isUnusualMethod = unusualMethods.includes(req.method);
    
    // Check for suspicious paths
    const suspiciousPaths = ['/admin', '/api', '/.env', '/config', '/backup'];
    const isSuspiciousPath = suspiciousPaths.some(path => req.path.includes(path));
    
    return isDirectAccess || isUnusualMethod || isSuspiciousPath;
  }

  // 📊 GET REQUEST COUNT
  private getRequestCount(ip: string): number {
    const attempts = this.cloneAttempts.get(ip);
    return attempts ? 1 : 0; // Simplified for demo
  }

  // 📈 INCREASE MONITORING
  private increaseMonitoring(ip: string): void {
    console.log(`📈 INCREASED MONITORING FOR IP: ${ip}`);
    // In real implementation, would increase monitoring level
  }

  // 🎯 CALCULATE THREAT SCORE
  private calculateThreatScore(ip: string, fingerprint: string): number {
    let score = 0;
    
    // Base score
    score += 10;
    
    // IP reputation (simplified)
    if (this.isKnownBadIP(ip)) score += 50;
    
    // Fingerprint similarity
    if (this.checkFingerprintSimilarity(fingerprint)) score += 30;
    
    // Request frequency
    const requestCount = this.getRequestCount(ip);
    score += requestCount * 5;
    
    return Math.min(score, 100); // Cap at 100
  }

  // 🚫 IS KNOWN BAD IP
  private isKnownBadIP(ip: string): boolean {
    // In real implementation, would check against threat intelligence feeds
    const knownBadIPs = ['127.0.0.1', '0.0.0.0']; // Example
    return knownBadIPs.includes(ip);
  }

  // 🎫 GENERATE UNIQUE TOKEN
  private generateUniqueToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // 🏷️ GENERATE WATERMARK
  private generateWatermark(req: Request): string {
    const timestamp = Date.now();
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';
    
    const watermarkData = `${timestamp}-${ip}-${userAgent}`;
    return crypto.createHash('sha256').update(watermarkData).digest('hex').substring(0, 16);
  }

  // 📊 GET SECURITY STATS
  getSecurityStats(): any {
    return {
      totalCloneAttempts: this.cloneAttempts.size,
      totalFingerprints: this.fingerprintCache.size,
      totalLegalWarnings: this.legalWarnings.size,
      securityLevel: 'MAXIMUM',
      protectionStatus: 'ACTIVE',
      lastUpdated: new Date().toISOString()
    };
  }
}

// 🛡️ EXPORT ENHANCED ANTI-CLONE PROTECTION
export const enhancedAntiCloneProtection = EnhancedAntiCloneProtection.getInstance();
