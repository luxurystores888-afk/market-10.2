import express from 'express';
import { storage } from '../storage.ts';
import { 
  validateQuery, 
  validateParams, 
  validateBody,
  getProductsQuerySchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema
} from '../validation.ts';
import { apiLimiter, strictApiLimiter } from '../middleware.ts';
import { requireAdmin, optionalAuth } from '../middleware/auth.ts';
import { aiService } from '../services/aiService.ts'; // Added import for aiService
import { webpush } from '../web3.ts'; // Added import for webpush

// Use cluster module (free in Node.js)
const cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();
}

export const productRoutes = express.Router();

// Get all products with optional filtering
productRoutes.get('/', apiLimiter, validateQuery(getProductsQuerySchema), async (req, res) => {
  try {
    const { category, status, search, limit } = req.query;
    
    const filters: any = {};
    if (category) filters.category = category as string;
    if (status) filters.status = status as string;
    if (search) filters.search = search as string;
    if (limit) filters.limit = parseInt(limit as string);

    const products = await storage.getProducts(filters);
    res.json({ products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
productRoutes.get('/:id', apiLimiter, validateParams(productIdSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await storage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product (admin only) - 🔒 SECURED
productRoutes.post('/', strictApiLimiter, requireAdmin, validateBody(createProductSchema), async (req, res) => {
  try {
    const productData = req.body;
    const product = await storage.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only) - 🔒 SECURED
productRoutes.put('/:id', strictApiLimiter, requireAdmin, validateParams(productIdSchema), validateBody(updateProductSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const oldProduct = await storage.getProduct(id); // Get old product to check stock change
    const product = await storage.updateProduct(id, updates);

    if (updates.stock > 0 && oldProduct.stock === 0) {
      // Get subscribers for this product (assume table)
      const subs = await storage.getRestockSubscribers(id);
      subs.forEach(sub => webpush.sendNotification(sub, { type: 'restock', product: updates.name }));
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only) - 🔒 SECURED  
productRoutes.delete('/:id', strictApiLimiter, requireAdmin, validateParams(productIdSchema), async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Add endpoint:
productRoutes.post('/multimodal-search', apiLimiter, async (req, res) => {
  const { query, image } = req.body; // query for voice text, image for visual base64
  // Use AI to process
  const searchTerm = image ? await aiService.analyzeImageForSearch(image) : query;
  const products = await storage.getProducts({ search: searchTerm });
  res.json({ products });
});

productRoutes.post('/subscribe-restock', optionalAuth, async (req, res) => {
  const { productId, subscription } = req.body;
  await storage.addRestockSubscription({ productId, subscription });
  res.json({ success: true });
});

productRoutes.post('/reviews', optionalAuth, async (req, res) => {
  const { productId, rating, title, content } = req.body;
  const review = await storage.createReview({
    productId,
    userId: req.user.id,
    rating,
    title,
    content
  });
  res.json(review);
});

productRoutes.post('/auction', async (req, res) => {
  res.json({ auctionId: 'new' });
});

productRoutes.get('/affiliate/:id', optionalAuth, async (req, res) => {
  const affiliateUrl = `${window.location.origin}/product/${req.params.id}?aff=${req.user.id}`;
  res.json({ url: affiliateUrl });
});