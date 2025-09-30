import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validateBody } from '../validation';
import { apiLimiter, strictApiLimiter } from '../middleware';
import { storage } from '../storage';
import type { InsertUser } from '../../lib/schema';
import nodemailer from 'nodemailer';
import { ethers } from 'ethers';

export const authRoutes = express.Router();

// 🔒 SECURITY FIX: JWT Secret must be provided via environment - no fallback
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}
const JWT_EXPIRES_IN = '7d'; // 7 days

// Validation schemas
const registerSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase, one uppercase, and one number'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .trim()
  // 🔒 SECURITY FIX: Role removed from registration - admin roles must be manually assigned
});

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
});

const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase, one uppercase, and one number')
});

// Utility function to generate JWT token
const generateJWT = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Utility function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // High security for cyberpunk platform
  return await bcrypt.hash(password, saltRounds);
};

/**
 * POST /api/auth/register
 * Register new user account
 */
authRoutes.post('/register', 
  strictApiLimiter, // Strict limit for registration
  validateBody(registerSchema),
  async (req, res) => {
    try {
      const { email, username, password, name } = req.body;
      // 🔒 SECURITY FIX: All new registrations are customers - admin role requires manual elevation

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
      }

      // Check if username is taken (if provided)
      if (username) {
        const existingUsername = await storage.getUserByUsername(username);
        if (existingUsername) {
          return res.status(409).json({
            error: 'Username taken',
            message: 'This username is already taken'
          });
        }
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create new user - ALWAYS as customer (security measure)
      const userData: InsertUser = {
        email,
        username: username || null,
        passwordHash,
        name,
        role: 'customer', // 🔒 FORCED: All registrations are customers
        emailVerified: false, // Email verification can be implemented later
        lastLogin: new Date()
      };

      const newUser = await storage.createUser(userData);

      // Generate JWT token
      const token = generateJWT(newUser.id, newUser.email, newUser.role);

      // Return user data (excluding sensitive info) and token
      res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt
        },
        token,
        expiresIn: JWT_EXPIRES_IN
      });

      console.log(`🆕 New user registered: ${email} (customer)`);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: 'Unable to create account. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/login
 * User login
 */
authRoutes.post('/login',
  apiLimiter,
  validateBody(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Generate JWT token
      const token = generateJWT(user.id, user.email, user.role);

      // Return user data and token
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          lastLogin: new Date()
        },
        token,
        expiresIn: JWT_EXPIRES_IN
      });

      console.log(`🔐 User logged in: ${email} (${user.role})`);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'Unable to process login. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
authRoutes.post('/forgot-password',
  strictApiLimiter, // Strict limit to prevent abuse
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Return success even if user doesn't exist to prevent email enumeration
        return res.json({
          message: 'If an account with this email exists, a password reset link has been sent.'
        });
      }

      // Generate reset token (in production, use crypto.randomBytes)
      const resetToken = jwt.sign(
        { userId: user.id, purpose: 'password-reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Store reset token in database
      await storage.setPasswordResetToken(user.id, resetToken);

      const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      await transporter.sendMail(mailOptions);

      console.log(`🔄 Password reset email sent to: ${email}`);

      res.json({
        message: 'If an account with this email exists, a password reset link has been sent.',
        // In development, include token for testing
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Request failed',
        message: 'Unable to process password reset request.'
      });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
authRoutes.post('/reset-password',
  strictApiLimiter,
  validateBody(resetPasswordSchema),
  async (req, res) => {
    try {
      const { token, password } = req.body;

      // Verify reset token
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Reset token is invalid or expired'
        });
      }

      if (decoded.purpose !== 'password-reset') {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Token is not valid for password reset'
        });
      }

      // Get user and verify hashed token matches
      const user = await storage.getUserById(decoded.userId);
      if (!user || !user.resetPasswordToken) {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Reset token is invalid or expired'
        });
      }

      // 🔒 SECURITY FIX: Verify hashed password reset token
      const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
      if (!isValidToken) {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Reset token is invalid or expired'
        });
      }

      // Hash new password
      const passwordHash = await hashPassword(password);

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, passwordHash);

      res.json({
        message: 'Password reset successful. You can now log in with your new password.'
      });

      console.log(`🔒 Password reset completed for user: ${user.email}`);

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        error: 'Reset failed',
        message: 'Unable to reset password. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/web3-login
 * Verify Ethereum signature and issue JWT
 */
authRoutes.post('/web3-login', async (req, res) => {
  const { address, sig } = req.body;
  // Verify sig with ethers
  const recovered = ethers.utils.verifyMessage('Sign to login', sig);
  if (recovered === address) {
    // Find or create user, generate JWT
    res.json({ token: generateJWT(address, 'web3', 'user') });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
authRoutes.get('/me',
  apiLimiter,
  async (req, res) => {
    try {
      // Authentication middleware will populate req.user
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Profile fetch failed',
        message: 'Unable to retrieve profile.'
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * User logout (client-side token removal)
 */
authRoutes.post('/logout',
  apiLimiter,
  async (req, res) => {
    // Since we're using stateless JWT, logout is handled client-side
    // In a production system, you might want to maintain a blacklist of tokens
    res.json({
      message: 'Logout successful'
    });
  }
);

// Export JWT verification utility for use in other middleware
export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string; iat: number };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export { JWT_SECRET };