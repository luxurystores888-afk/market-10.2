import express from 'express';
import { generateAffiliateLink, trackAffiliateSale } from '../services/affiliate';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/link', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    const link = await generateAffiliateLink(userId);
    res.json({ link });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate link' });
  }
});

router.post('/sale', async (req, res) => {
  try {
    const { affId, amount } = req.body;
    await trackAffiliateSale(affId, amount);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track sale' });
  }
});

router.post('/invite', async (req, res) => {
  // Auto-invite logic
  res.json({ success: true });
});

router.get('/earnings', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    // Mock or fetch from DB
    const earnings = 0; // Replace with actual logic
    res.json({ earnings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get earnings' });
  }
});

export default router;
