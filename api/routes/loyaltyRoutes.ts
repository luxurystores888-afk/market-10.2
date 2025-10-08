// 🏆 LOYALTY & REWARDS API ROUTES
import express from 'express';
import { authenticate } from '../middleware/auth';
import { storage } from '../storage';
import { aiService } from '../services/aiService';

const router = express.Router();

// Get user loyalty points and tier
router.get('/points', authenticate, async (req, res) => {
  try {
    const loyaltyData = await storage.getUserLoyalty(req.user.id);
    
    res.json({ success: true, data: loyaltyData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty data', suggestion: 'Refresh and try again' });
  }
});

// Get available rewards
router.get('/rewards', authenticate, async (req, res) => {
  try {
    const rewards = await storage.getAvailableRewards(req.user.id);
    
    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rewards' });
  }
});

// Redeem reward
router.post('/rewards/:rewardId/redeem', authenticate, async (req, res) => {
  try {
    const { rewardId } = req.params;
    
    const redemption = await storage.redeemReward(req.user.id, rewardId);
    
    res.json({ success: true, redemption });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to redeem reward' });
  }
});

// Get active challenges
router.get('/challenges', authenticate, async (req, res) => {
  try {
    const challenges = await storage.getActiveChallenges(req.user.id);
    
    res.json({ success: true, challenges });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch challenges' });
  }
});

// Complete challenge
router.post('/challenges/:challengeId/complete', authenticate, async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const completion = await storage.completeChallenge(req.user.id, challengeId);
    
    res.json({ success: true, completion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete challenge' });
  }
});

// Add endpoint:
router.get('/quests', authenticate, async (req, res) => {
  // Generate or fetch quests
  const quests = [{ id: 1, title: 'Complete 3 Purchases', progress: 1, target: 3 }];
  res.json(quests);
});

router.get('/smart-challenges', authenticate, async (req, res) => {
  // Use AI to generate
  const challenges = await aiService.generateChallenges(req.user.id);
  res.json(challenges);
});

router.post('/giveaway', async (req, res) => {
  res.json({ winner: true });
});

router.get('/ascension', async (req, res) => {
  res.json({ level: 1 });
});

export default router;
