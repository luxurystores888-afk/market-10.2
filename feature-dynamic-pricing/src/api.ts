/**
 * 🌐 DYNAMIC PRICING REST API
 * 
 * Endpoints:
 * - GET /api/pricing/optimize - Get optimized prices for all products
 * - GET /api/pricing/product/:id - Get optimized price for specific product
 * - POST /api/pricing/update - Update pricing parameters
 * - GET /api/pricing/stats - Get model performance statistics
 * - POST /api/pricing/train - Trigger model training
 * - GET /api/pricing/health - Health check
 */

import express, { Request, Response } from 'express';
import { pricingEngine } from './pricingEngine.js';
import { dataIngestor } from './dataIngestor.js';
import { metricsCollector } from './metrics.js';

const app = express();
app.use(express.json());

// CORS for frontend access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/**
 * GET /api/pricing/optimize
 * Returns optimized prices for all active products
 */
app.get('/api/pricing/optimize', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // Get latest product data
    const products = await dataIngestor.getLatestProductData();

    // Optimize prices
    const decisions = await pricingEngine.optimizeAllProducts(products);

    // Convert to response format
    const optimizedPrices = Array.from(decisions.entries()).map(([productId, decision]) => {
      const product = products.find(p => p.productId === productId);
      const newPrice = product!.currentPrice * (1 + decision.priceChange / 100);

      return {
        productId,
        currentPrice: product!.currentPrice,
        optimizedPrice: Number(newPrice.toFixed(2)),
        priceChange: decision.priceChange,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        estimatedImpact: {
          revenueChange: `+${(decision.priceChange * 0.7).toFixed(1)}%`,
          marginChange: `+${decision.priceChange.toFixed(1)}%`,
          salesChange: `${(decision.priceChange * -0.3).toFixed(1)}%`
        }
      };
    });

    const responseTime = Date.now() - startTime;

    // Track metrics
    metricsCollector.recordOptimization(optimizedPrices.length, responseTime);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      productsOptimized: optimizedPrices.length,
      responseTimeMs: responseTime,
      prices: optimizedPrices,
      modelStats: pricingEngine.getModelStats()
    });

  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Pricing optimization failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/pricing/product/:id
 * Get optimized price for specific product
 */
app.get('/api/pricing/product/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productData = await dataIngestor.getProductData(id);
    
    if (!productData) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const decision = await pricingEngine.optimizePrice(productData);
    const newPrice = productData.currentPrice * (1 + decision.priceChange / 100);

    res.json({
      success: true,
      productId: id,
      currentPrice: productData.currentPrice,
      optimizedPrice: Number(newPrice.toFixed(2)),
      decision
    });

  } catch (error) {
    console.error('Product pricing error:', error);
    res.status(500).json({ error: 'Failed to optimize product price' });
  }
});

/**
 * POST /api/pricing/update
 * Apply pricing changes to products
 */
app.post('/api/pricing/update', async (req: Request, res: Response) => {
  try {
    const { productId, newPrice, reason } = req.body;

    // Validate
    if (!productId || !newPrice) {
      return res.status(400).json({ error: 'productId and newPrice required' });
    }

    // Update in main database (call main API)
    const updateResponse = await fetch(`${process.env.MAIN_API_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: newPrice })
    });

    if (updateResponse.ok) {
      // Log pricing change
      console.log(`💰 Price updated: ${productId} → $${newPrice} (${reason})`);

      // Track for model learning
      metricsCollector.recordPriceChange(productId, newPrice);

      res.json({
        success: true,
        productId,
        newPrice,
        appliedAt: new Date().toISOString()
      });
    } else {
      throw new Error('Failed to update price in main database');
    }

  } catch (error) {
    console.error('Price update error:', error);
    res.status(500).json({ error: 'Price update failed' });
  }
});

/**
 * GET /api/pricing/stats
 * Get model performance statistics
 */
app.get('/api/pricing/stats', (req: Request, res: Response) => {
  try {
    const stats = {
      model: pricingEngine.getModelStats(),
      metrics: metricsCollector.getStats(),
      performance: {
        avgResponseTime: metricsCollector.getAvgResponseTime(),
        successRate: metricsCollector.getSuccessRate(),
        optimizationsToday: metricsCollector.getOptimizationsToday()
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

/**
 * POST /api/pricing/train
 * Manually trigger model training with historical data
 */
app.post('/api/pricing/train', async (req: Request, res: Response) => {
  try {
    console.log('🎓 Starting model training...');

    // Get historical sales data
    const historicalData = await dataIngestor.getHistoricalData(30); // Last 30 days

    let updatesCount = 0;

    // Train model on historical data
    for (const dataPoint of historicalData) {
      pricingEngine.updateModel(
        dataPoint.state,
        dataPoint.action,
        dataPoint.reward,
        dataPoint.nextState
      );
      updatesCount++;
    }

    console.log(`✅ Model trained on ${updatesCount} data points`);

    // Save model
    const modelData = pricingEngine.exportModel();
    // Save to file or database
    // await saveModel(modelData);

    res.json({
      success: true,
      dataPointsProcessed: updatesCount,
      modelStats: pricingEngine.getModelStats()
    });

  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: 'Training failed' });
  }
});

/**
 * GET /api/pricing/health
 * Health check endpoint for K8s
 */
app.get('/api/pricing/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'dynamic-pricing',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    model: {
      loaded: true,
      states: pricingEngine.getModelStats().statesLearned
    }
  });
});

/**
 * GET /api/pricing/readiness
 * Readiness check for K8s
 */
app.get('/api/pricing/readiness', async (req: Request, res: Response) => {
  try {
    // Check if can connect to data sources
    const canIngest = await dataIngestor.checkConnection();
    
    if (canIngest) {
      res.json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready', reason: 'Cannot connect to data sources' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: String(error) });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Dynamic Pricing API running on port ${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET  /api/pricing/optimize`);
  console.log(`   GET  /api/pricing/product/:id`);
  console.log(`   POST /api/pricing/update`);
  console.log(`   GET  /api/pricing/stats`);
  console.log(`   POST /api/pricing/train`);
  console.log(`   GET  /api/pricing/health`);
  console.log(`   GET  /api/pricing/readiness`);
});

export default app;

