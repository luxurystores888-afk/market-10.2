import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { app } from '../../index';
import { db } from '../../services/database';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { users, chats, documents } from '../../db/schema';
import jwt from 'jsonwebtoken';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Run migrations
    await migrate(db, { migrationsFolder: './src/db/migrations' });
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(users).where({ email: 'test@example.com' });
    await db.delete(chats).where({ userId: testUserId });
    await db.delete(documents).where({ ownerId: testUserId });
    
    // Close database connection
    await db.$client.end();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await db.delete(users).where({ email: 'test@example.com' });
  });

  describe('Authentication', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: 'SecurePassword123!',
            name: 'Test User'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('tokens');
        expect(response.body.user.email).toBe('test@example.com');
        expect(response.body.tokens).toHaveProperty('accessToken');
        expect(response.body.tokens).toHaveProperty('refreshToken');

        testUserId = response.body.user.id;
        authToken = response.body.tokens.accessToken;
      });

      it('should not register duplicate email', async () => {
        // First registration
        await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: 'SecurePassword123!',
            name: 'Test User'
          });

        // Duplicate registration
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: 'AnotherPassword123!',
            name: 'Another User'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/v1/auth/login', () => {
      beforeEach(async () => {
        // Create test user
        await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: 'SecurePassword123!',
            name: 'Test User'
          });
      });

      it('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: 'SecurePassword123!'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('tokens');
        expect(response.body.user.email).toBe('test@example.com');
      });

      it('should not login with invalid password', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: 'WrongPassword123!'
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('Protected Routes', () => {
    beforeEach(async () => {
      // Create and login test user
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
          name: 'Test User'
        });

      testUserId = response.body.user.id;
      authToken = response.body.tokens.accessToken;
    });

    describe('GET /api/v1/user/profile', () => {
      it('should get user profile with valid token', async () => {
        const response = await request(app)
          .get('/api/v1/user/profile')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('test@example.com');
      });

      it('should not get profile without token', async () => {
        const response = await request(app)
          .get('/api/v1/user/profile');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('AI Features', () => {
    beforeEach(async () => {
      // Create and login test user
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
          name: 'Test User'
        });

      authToken = response.body.tokens.accessToken;
    });

    describe('POST /api/v1/ai/chat', () => {
      it('should create AI chat completion', async () => {
        const response = await request(app)
          .post('/api/v1/ai/chat')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            message: 'Hello, AI!',
            model: 'gpt-4'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
        expect(response.body).toHaveProperty('usage');
      });
    });

    describe('POST /api/v1/ai/translate', () => {
      it('should translate text', async () => {
        const response = await request(app)
          .post('/api/v1/ai/translate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            text: 'Hello, world!',
            targetLanguage: 'es'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('translatedText');
        expect(response.body).toHaveProperty('sourceLanguage');
      });
    });
  });

  describe('Real-time Features', () => {
    beforeEach(async () => {
      // Create and login test user
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
          name: 'Test User'
        });

      authToken = response.body.tokens.accessToken;
    });

    describe('POST /api/v1/chat/rooms', () => {
      it('should create a new chat room', async () => {
        const response = await request(app)
          .post('/api/v1/chat/rooms')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Room',
            description: 'A test chat room'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('room');
        expect(response.body.room.name).toBe('Test Room');
      });
    });

    describe('POST /api/v1/documents', () => {
      it('should create a new document', async () => {
        const response = await request(app)
          .post('/api/v1/documents')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Document',
            content: 'Initial content'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('document');
        expect(response.body.document.title).toBe('Test Document');
      });
    });
  });

  describe('Payment Features', () => {
    beforeEach(async () => {
      // Create and login test user
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
          name: 'Test User'
        });

      authToken = response.body.tokens.accessToken;
    });

    describe('GET /api/v1/payments/crypto/prices', () => {
      it('should get cryptocurrency prices', async () => {
        const response = await request(app)
          .get('/api/v1/payments/crypto/prices')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('bitcoin');
        expect(response.body).toHaveProperty('ethereum');
        expect(response.body).toHaveProperty('usdc');
      });
    });

    describe('POST /api/v1/payments/crypto/address', () => {
      it('should generate payment address', async () => {
        const response = await request(app)
          .post('/api/v1/payments/crypto/address')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            cryptocurrency: 'bitcoin',
            amount: 0.001
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('address');
        expect(response.body).toHaveProperty('qrCode');
        expect(response.body).toHaveProperty('expiresAt');
      });
    });
  });

  describe('Health Checks', () => {
    describe('GET /health', () => {
      it('should return health status', async () => {
        const response = await request(app)
          .get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('timestamp');
      });
    });

    describe('GET /api/health', () => {
      it('should return API health status', async () => {
        const response = await request(app)
          .get('/api/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('services');
      });
    });
  });
});
