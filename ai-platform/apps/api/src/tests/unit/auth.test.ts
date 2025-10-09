import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthService } from '../../services/auth';
import { db } from '../../services/database';
import { users } from '../../db/schema';

// Mock dependencies
jest.mock('../../services/database');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = 'test-user-id';
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      (jwt.sign as jest.Mock).mockReturnValueOnce(mockAccessToken);
      (jwt.sign as jest.Mock).mockReturnValueOnce(mockRefreshToken);

      const tokens = await authService.generateTokens(userId);

      expect(tokens).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      });

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const isValid = await authService.validatePassword(password, hashedPassword);

      expect(isValid).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should reject incorrect password', async () => {
      const password = 'wrongPassword';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const isValid = await authService.validatePassword(password, hashedPassword);

      expect(isValid).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('hashPassword', () => {
    it('should hash password with salt rounds', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await authService.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', async () => {
      const token = 'valid-token';
      const decoded = { userId: 'test-user-id', type: 'access' };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = await authService.verifyToken(token, 'access');

      expect(result).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    });

    it('should verify valid refresh token', async () => {
      const token = 'valid-refresh-token';
      const decoded = { userId: 'test-user-id', type: 'refresh' };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = await authService.verifyToken(token, 'refresh');

      expect(result).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_REFRESH_SECRET);
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken(token, 'access')).rejects.toThrow('Invalid token');
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      const hashedPassword = 'hashedPassword';
      const newUser = {
        id: 'new-user-id',
        ...userData,
        password: hashedPassword
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([newUser])
        })
      });

      const result = await authService.createUser(userData);

      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });
  });

  describe('checkPermission', () => {
    it('should allow admin to perform any action', async () => {
      const hasPermission = await authService.checkPermission('admin', 'delete', 'users');
      expect(hasPermission).toBe(true);
    });

    it('should allow user to read their own data', async () => {
      const hasPermission = await authService.checkPermission('user', 'read', 'profile');
      expect(hasPermission).toBe(true);
    });

    it('should deny user from deleting data', async () => {
      const hasPermission = await authService.checkPermission('user', 'delete', 'users');
      expect(hasPermission).toBe(false);
    });

    it('should allow moderator to update content', async () => {
      const hasPermission = await authService.checkPermission('moderator', 'update', 'content');
      expect(hasPermission).toBe(true);
    });
  });
});
