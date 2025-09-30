/**
 * @jest-environment node
 */
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { app } from '../../../api/index';

// Mock the database connection
jest.mock('../../../api/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

// Mock the services
jest.mock('../../../api/services/productService', () => ({
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

import { getProducts, createProduct } from '../../../api/services/productService';

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

describe('Products API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return all products successfully', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product 1',
          price: '99.99',
          category: 'Electronics',
          stock: 10,
          status: 'active',
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: '149.99',
          category: 'Clothing',
          stock: 5,
          status: 'active',
        },
      ];

      mockGetProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(2);
      expect(response.body.products[0]).toHaveProperty('id', '1');
      expect(response.body.products[0]).toHaveProperty('name', 'Test Product 1');
      expect(mockGetProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      mockGetProducts.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Database connection failed');
    });

    it('should filter products by category when query parameter is provided', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product 1',
          price: '99.99',
          category: 'Electronics',
          stock: 10,
          status: 'active',
        },
      ];

      mockGetProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].category).toBe('Electronics');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product successfully', async () => {
      const newProduct = {
        name: 'New Test Product',
        description: 'A new product for testing',
        price: '199.99',
        category: 'Electronics',
        stock: 20,
        imageUrl: 'https://example.com/image.jpg',
      };

      const createdProduct = {
        id: '3',
        ...newProduct,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateProduct.mockResolvedValue(createdProduct);

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product).toHaveProperty('id');
      expect(response.body.product.name).toBe('New Test Product');
      expect(response.body.product.price).toBe('199.99');
      expect(mockCreateProduct).toHaveBeenCalledWith(newProduct);
    });

    it('should validate required fields', async () => {
      const invalidProduct = {
        name: '', // Empty name should fail validation
        price: 'invalid-price',
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('validation');
    });

    it('should handle service layer errors', async () => {
      const newProduct = {
        name: 'Test Product',
        price: '99.99',
        category: 'Electronics',
        stock: 10,
      };

      mockCreateProduct.mockRejectedValue(new Error('Failed to create product'));

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to create product');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product by ID', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: '99.99',
        category: 'Electronics',
        stock: 10,
        status: 'active',
      };

      mockGetProducts.mockResolvedValue([mockProduct]);

      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product.id).toBe('1');
      expect(response.body.product.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      mockGetProducts.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: '149.99',
      };

      const updatedProduct = {
        id: '1',
        name: 'Updated Product Name',
        price: '149.99',
        category: 'Electronics',
        stock: 10,
        status: 'active',
      };

      // Mock the update function
      const mockUpdateProduct = require('../../../api/services/productService').updateProduct;
      mockUpdateProduct.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put('/api/products/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product.name).toBe('Updated Product Name');
      expect(response.body.product.price).toBe('149.99');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      const mockDeleteProduct = require('../../../api/services/productService').deleteProduct;
      mockDeleteProduct.mockResolvedValue({ id: '1' });

      const response = await request(app)
        .delete('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted successfully');
    });
  });
});
