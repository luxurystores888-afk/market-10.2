import { Router } from 'express';
import { autoSourcing } from '../services/autoProductSourcingEngine.js';

const router = Router();

/**
 * POST /api/digital-products/search
 * Search for profitable digital products
 */
router.post('/digital-products/search', async (req, res) => {
  try {
    const { query, platforms } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    console.log(`🔍 Searching digital products: "${query}"`);

    const products = await autoSourcing.searchProducts(query);

    res.json({
      success: true,
      query,
      productsFound: products.length,
      products
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * POST /api/digital-products/list
 * Auto-list a product for sale
 */
router.post('/digital-products/list', async (req, res) => {
  try {
    const { product, pricing } = req.body;

    const success = await autoSourcing.listProduct(product);

    if (success) {
      res.json({
        success: true,
        message: 'Product listed successfully',
        productId: product.id,
        profitPotential: pricing.profit
      });
    } else {
      res.status(500).json({ error: 'Failed to list product' });
    }

  } catch (error) {
    console.error('Listing error:', error);
    res.status(500).json({ error: 'Listing failed' });
  }
});

/**
 * POST /api/digital-products/deliver
 * Auto-deliver product to customer after purchase
 */
router.post('/digital-products/deliver', async (req, res) => {
  try {
    const { orderId, productId, customerEmail } = req.body;

    const delivered = await autoSourcing.deliverProduct(orderId, productId, customerEmail);

    if (delivered) {
      res.json({
        success: true,
        message: 'Product delivered',
        deliveredTo: customerEmail
      });
    } else {
      res.status(500).json({ error: 'Delivery failed' });
    }

  } catch (error) {
    console.error('Delivery error:', error);
    res.status(500).json({ error: 'Delivery failed' });
  }
});

/**
 * GET /api/digital-products/setup-guide
 * Returns complete setup instructions
 */
router.get('/digital-products/setup-guide', (req, res) => {
  res.json({
    guide: autoSourcing.getSetupInstructions()
  });
});

export default router;

