import { Router } from 'express';
import { googleShoppingFeed } from '../services/googleShoppingFeed.js';

const router = Router();

/**
 * GET /api/google-shopping-feed.xml
 * Returns XML feed for Google Merchant Center
 */
router.get('/google-shopping-feed.xml', async (req, res) => {
  try {
    const xml = await googleShoppingFeed.generateFeed();
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(xml);
    
    console.log('📊 Google Shopping feed served');
  } catch (error) {
    console.error('Error generating Google Shopping feed:', error);
    res.status(500).json({ error: 'Failed to generate feed' });
  }
});

/**
 * GET /api/google-shopping/setup-instructions
 * Returns setup instructions
 */
router.get('/google-shopping/setup-instructions', (req, res) => {
  res.json({
    instructions: googleShoppingFeed.getSetupInstructions(),
    feedUrl: `${process.env.SITE_URL || 'https://yourdomain.com'}/api/google-shopping-feed.xml`
  });
});

/**
 * POST /api/google-shopping/regenerate
 * Manually regenerate feed
 */
router.post('/google-shopping/regenerate', async (req, res) => {
  try {
    await googleShoppingFeed.saveFeedToFile();
    res.json({ success: true, message: 'Feed regenerated successfully' });
  } catch (error) {
    console.error('Error regenerating feed:', error);
    res.status(500).json({ error: 'Failed to regenerate feed' });
  }
});

export default router;

