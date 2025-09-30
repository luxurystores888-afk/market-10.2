import express from 'express';
import { authenticate } from '../middleware/auth';
import { storage } from '../storage';

const router = express.Router();

// Subscribe or update a price alert
router.post('/price', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { productId, threshold } = req.body as { productId: string; threshold: number };
    if (!productId || typeof threshold !== 'number') return res.status(400).json({ error: 'Invalid payload' });
    const alert = await storage.upsertPriceAlert(userId, productId, threshold);
    res.json({ success: true, alert });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to set price alert', message: e.message });
  }
});

// Remove a price alert
router.delete('/price', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { productId } = req.body as { productId: string };
    if (!productId) return res.status(400).json({ error: 'Invalid payload' });
    await storage.removePriceAlert(userId, productId);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to remove price alert', message: e.message });
  }
});

// List current user's price alerts
router.get('/price', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || null;
    if (!userId) return res.json({ alerts: [] });
    const { storage } = await import('../storage');
    // Fetch all alerts by user (simple select)
    const db = (await import('../db')).db;
    const { priceAlerts } = await import('../../lib/schema');
    const { eq } = await import('drizzle-orm');
    const alerts = await db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId));
    res.json({ alerts });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to list alerts', message: e.message });
  }
});

export default router;


