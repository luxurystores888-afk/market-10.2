import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../routes/authRoutes';
import { storage } from '../storage';
import type { User } from '../../lib/schema';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = verifyJWT(token);
    
    // Get user from database to ensure they still exist and haven't been disabled
    const user = await storage.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User account not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      error: 'Access denied',
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Authorization middleware factory
 * Requires specific roles to access the route
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: `This action requires ${roles.join(' or ')} privileges`
      });
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = authorize('admin');

/**
 * Customer or Admin middleware (authenticated users)
 */
export const requireAuth = authenticate;

/**
 * Optional authentication middleware
 * Attaches user if token is provided, but doesn't require it
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      try {
        const decoded = verifyJWT(token);
        const user = await storage.getUserById(decoded.userId);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but that's okay for optional auth
        console.log('Optional auth failed:', error);
      }
    }

    next();
  } catch (error) {
    // Don't fail the request for optional auth errors
    next();
  }
};

/**
 * Rate limiting based on user authentication status
 * Authenticated users get higher limits
 */
export const authBasedRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // This will be used in combination with express-rate-limit
  // Authenticated users can be given higher limits
  const isAuthenticated = !!req.user;
  const userRole = req.user?.role;
  
  // Store auth status for rate limiting middleware
  (req as any).isAuthenticated = isAuthenticated;
  (req as any).userRole = userRole;
  
  next();
};

/**
 * Security logging middleware
 * Logs authentication and authorization events
 */
export const securityLogger = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const timestamp = new Date().toISOString();
    
    console.log(`🔐 [${timestamp}] Security Event: ${action}`);
    console.log(`   User: ${userEmail || 'Anonymous'} (${userRole || 'No role'})`);
    console.log(`   IP: ${ip}`);
    console.log(`   Route: ${req.method} ${req.originalUrl}`);
    console.log(`   User-Agent: ${userAgent}`);
    
    next();
  };
};