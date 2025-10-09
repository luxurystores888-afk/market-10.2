import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { z } from 'zod';
import { eq, and, gt } from 'drizzle-orm';
import { DatabaseService } from './database.js';
import { users, userSessions } from '../db/schema.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

// Types
export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  googleClientId?: string;
  googleClientSecret?: string;
  githubClientId?: string;
  githubClientSecret?: string;
  baseUrl: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator' | 'developer';
  isEmailVerified: boolean;
  privacyMode: boolean;
  preferences: {
    language: string;
    timezone: string;
    theme: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthSession {
  id: string;
  userId: string;
  deviceInfo: any;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export class AuthService {
  private db: DatabaseService;
  private config: AuthConfig;

  constructor(db: DatabaseService, config: AuthConfig) {
    this.db = db;
    this.config = config;
    this.setupPassportStrategies();
  }

  private setupPassportStrategies(): void {
    // JWT Strategy
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.config.jwtSecret,
      issuer: 'ai-platform',
      audience: 'ai-platform-users',
    }, async (payload, done) => {
      try {
        const user = await this.getUserById(payload.sub);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }));

    // Google OAuth Strategy
    if (this.config.googleClientId && this.config.googleClientSecret) {
      passport.use(new GoogleStrategy({
        clientID: this.config.googleClientId,
        clientSecret: this.config.googleClientSecret,
        callbackURL: `${this.config.baseUrl}/auth/google/callback`,
        scope: ['profile', 'email'],
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await this.handleOAuthLogin('google', profile);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }));
    }

    // GitHub OAuth Strategy
    if (this.config.githubClientId && this.config.githubClientSecret) {
      passport.use(new GitHubStrategy({
        clientID: this.config.githubClientId,
        clientSecret: this.config.githubClientSecret,
        callbackURL: `${this.config.baseUrl}/auth/github/callback`,
        scope: ['user:email'],
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await this.handleOAuthLogin('github', profile);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }));
    }
  }

  // User registration
  public async register(userData: z.infer<typeof registerSchema>): Promise<{
    user: AuthUser;
    tokens: AuthTokens;
    requiresEmailVerification: boolean;
  }> {
    const validatedData = registerSchema.parse(userData);

    // Check if user already exists
    const existingUser = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Check username uniqueness if provided
    if (validatedData.username) {
      const existingUsername = await this.db.getDb()
        .select()
        .from(users)
        .where(eq(users.username, validatedData.username))
        .limit(1);

      if (existingUsername.length > 0) {
        throw new Error('Username already taken');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const [newUser] = await this.db.getDb()
      .insert(users)
      .values({
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        username: validatedData.username,
        role: 'user',
        isEmailVerified: false,
        isActive: true,
        language: 'en',
        timezone: 'UTC',
        theme: 'system',
      })
      .returning();

    const authUser = this.mapUserToAuthUser(newUser);
    const tokens = await this.generateTokens(authUser);

    // Send email verification
    await this.sendEmailVerification(authUser.email);

    return {
      user: authUser,
      tokens,
      requiresEmailVerification: !authUser.isEmailVerified,
    };
  }

  // User login
  public async login(
    credentials: z.infer<typeof loginSchema>,
    deviceInfo?: any
  ): Promise<{
    user: AuthUser;
    tokens: AuthTokens;
    session: AuthSession;
  }> {
    const validatedCredentials = loginSchema.parse(credentials);

    // Find user by email
    const [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.email, validatedCredentials.email))
      .limit(1);

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedCredentials.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Update last login
    await this.db.getDb()
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const authUser = this.mapUserToAuthUser(user);
    const tokens = await this.generateTokens(authUser);
    const session = await this.createSession(authUser.id, tokens.refreshToken, deviceInfo);

    return {
      user: authUser,
      tokens,
      session,
    };
  }

  // OAuth login handler
  private async handleOAuthLogin(provider: 'google' | 'github', profile: any): Promise<AuthUser> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error('No email provided by OAuth provider');
    }

    // Find existing user
    let [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user) {
      // Update OAuth ID if not set
      const updateData: any = {};
      if (provider === 'google' && !user.googleId) {
        updateData.googleId = profile.id;
      } else if (provider === 'github' && !user.githubId) {
        updateData.githubId = profile.id;
      }

      if (Object.keys(updateData).length > 0) {
        await this.db.getDb()
          .update(users)
          .set(updateData)
          .where(eq(users.id, user.id));
      }
    } else {
      // Create new user
      const userData: any = {
        email,
        firstName: profile.name?.givenName || profile.displayName?.split(' ')[0],
        lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' '),
        avatar: profile.photos?.[0]?.value,
        role: 'user',
        isEmailVerified: true, // OAuth providers verify emails
        isActive: true,
        language: 'en',
        timezone: 'UTC',
        theme: 'system',
      };

      if (provider === 'google') {
        userData.googleId = profile.id;
      } else if (provider === 'github') {
        userData.githubId = profile.id;
        userData.username = profile.username;
      }

      [user] = await this.db.getDb()
        .insert(users)
        .values(userData)
        .returning();
    }

    return this.mapUserToAuthUser(user);
  }

  // Refresh tokens
  public async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.config.jwtRefreshSecret) as any;
      
      // Find session
      const [session] = await this.db.getDb()
        .select()
        .from(userSessions)
        .where(
          and(
            eq(userSessions.refreshToken, refreshToken),
            eq(userSessions.isActive, true),
            gt(userSessions.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!session) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await this.getUserById(session.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update session with new refresh token
      await this.db.getDb()
        .update(userSessions)
        .set({
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        .where(eq(userSessions.id, session.id));

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout
  public async logout(sessionId: string): Promise<void> {
    await this.db.getDb()
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, sessionId));
  }

  // Logout from all devices
  public async logoutAll(userId: string): Promise<void> {
    await this.db.getDb()
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, userId));
  }

  // Password reset request
  public async requestPasswordReset(email: string): Promise<void> {
    const [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = this.generateSecureToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token (you'd typically have a separate table for this)
    await this.db.getDb()
      .update(users)
      .set({
        metadata: {
          ...user.metadata as any,
          passwordResetToken: resetToken,
          passwordResetExpiry: resetExpiry.toISOString(),
        },
      })
      .where(eq(users.id, user.id));

    // Send reset email
    await this.sendPasswordResetEmail(email, resetToken);
  }

  // Reset password
  public async resetPassword(data: z.infer<typeof resetPasswordSchema>): Promise<void> {
    const validatedData = resetPasswordSchema.parse(data);

    // Find user with valid reset token
    const [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.id, validatedData.token)) // This would be more complex in real implementation
      .limit(1);

    if (!user) {
      throw new Error('Invalid reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(validatedData.newPassword, 12);

    // Update password and clear reset token
    await this.db.getDb()
      .update(users)
      .set({
        passwordHash,
        metadata: {
          ...user.metadata as any,
          passwordResetToken: null,
          passwordResetExpiry: null,
        },
      })
      .where(eq(users.id, user.id));

    // Logout all sessions
    await this.logoutAll(user.id);
  }

  // Change password
  public async changePassword(
    userId: string,
    data: z.infer<typeof changePasswordSchema>
  ): Promise<void> {
    const validatedData = changePasswordSchema.parse(data);

    const [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.passwordHash) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(validatedData.newPassword, 12);

    // Update password
    await this.db.getDb()
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));
  }

  // Verify email
  public async verifyEmail(token: string): Promise<void> {
    // In a real implementation, you'd validate the token and update the user
    // For now, this is a placeholder
    console.log('Email verification requested for token:', token);
  }

  // Get user by ID
  public async getUserById(id: string): Promise<AuthUser | null> {
    const [user] = await this.db.getDb()
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ? this.mapUserToAuthUser(user) : null;
  }

  // Get user sessions
  public async getUserSessions(userId: string): Promise<AuthSession[]> {
    const sessions = await this.db.getDb()
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true)
        )
      )
      .orderBy(userSessions.createdAt);

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      deviceInfo: session.deviceInfo as any,
      ipAddress: session.ipAddress || '',
      userAgent: session.userAgent || '',
      isActive: session.isActive,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }));
  }

  // Generate tokens
  private async generateTokens(user: AuthUser): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iss: 'ai-platform',
      aud: 'ai-platform-users',
    };

    const accessToken = jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
    });

    const refreshToken = jwt.sign(
      { sub: user.id },
      this.config.jwtRefreshSecret,
      { expiresIn: this.config.jwtRefreshExpiresIn }
    );

    // Parse expiration time
    const expiresIn = this.parseExpirationTime(this.config.jwtExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  // Create session
  private async createSession(
    userId: string,
    refreshToken: string,
    deviceInfo?: any
  ): Promise<AuthSession> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [session] = await this.db.getDb()
      .insert(userSessions)
      .values({
        userId,
        sessionToken: this.generateSecureToken(),
        refreshToken,
        deviceInfo: deviceInfo || {},
        ipAddress: deviceInfo?.ipAddress || '',
        userAgent: deviceInfo?.userAgent || '',
        isActive: true,
        expiresAt,
      })
      .returning();

    return {
      id: session.id,
      userId: session.userId,
      deviceInfo: session.deviceInfo as any,
      ipAddress: session.ipAddress || '',
      userAgent: session.userAgent || '',
      isActive: session.isActive,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    };
  }

  // Utility methods
  private mapUserToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      privacyMode: user.privacyMode,
      preferences: {
        language: user.language || 'en',
        timezone: user.timezone || 'UTC',
        theme: user.theme || 'system',
      },
    };
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  private parseExpirationTime(expiresIn: string): number {
    // Simple parser for JWT expiration times
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default to 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit as keyof typeof multipliers] || 3600);
  }

  // Email sending methods (placeholders)
  private async sendEmailVerification(email: string): Promise<void> {
    console.log('Sending email verification to:', email);
    // Implement actual email sending
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    console.log('Sending password reset email to:', email, 'with token:', token);
    // Implement actual email sending
  }

  // Check permissions
  public hasPermission(user: AuthUser, permission: string): boolean {
    const rolePermissions = {
      user: ['read:own', 'write:own'],
      moderator: ['read:own', 'write:own', 'moderate:content'],
      admin: ['read:all', 'write:all', 'delete:all', 'admin:all'],
      developer: ['read:all', 'write:all', 'delete:all', 'admin:all', 'dev:all'],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  }

  // GDPR compliance methods
  public async exportUserData(userId: string): Promise<any> {
    // Export all user data for GDPR compliance
    const userData = await this.getUserById(userId);
    // Include all related data (messages, documents, etc.)
    return {
      user: userData,
      // Add other data exports here
    };
  }

  public async deleteUserData(userId: string, keepLegal: boolean = true): Promise<void> {
    if (keepLegal) {
      // Anonymize user data but keep for legal requirements
      await this.db.getDb()
        .update(users)
        .set({
          email: `deleted_${userId}@example.com`,
          firstName: null,
          lastName: null,
          avatar: null,
          isActive: false,
          privacyMode: true,
        })
        .where(eq(users.id, userId));
    } else {
      // Complete deletion (only when legally allowed)
      await this.db.getDb()
        .delete(users)
        .where(eq(users.id, userId));
    }
  }
}
