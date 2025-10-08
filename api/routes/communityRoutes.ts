// 🗣️ COMMUNITY & FORUM API ROUTES
import express from 'express';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../validation';
import { storage } from '../storage';
// Blockchain integration disabled - file not found
// import { submitBlockchainReview } from '../blockchain';

const router = express.Router();

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
});

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(1),
});

// Forum endpoints
router.get('/forum/posts', async (req, res) => {
  try {
    const { category } = req.query;
    const posts = await storage.getForumPosts({ category: category as string });
    
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch forum posts', suggestion: 'Please try again later' });
  }
});

router.post('/forum/posts', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // In production, save to database
    const newPost = await storage.createForumPost({
      title,
      content,
      category,
      userId: req.user.id,
    });
    
    res.json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// Reviews endpoints
router.get('/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Mock reviews data
    const reviews = await storage.getProductReviews(productId);
    
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

router.post('/reviews', authenticate, async (req, res) => {
  try {
    const { productId, rating, title, content } = req.body;
    
    // In production, save to database
    const newReview = await storage.createProductReview({
      productId,
      userId: req.user.id,
      rating,
      title,
      content,
      verified: true, // Assume verified for now
    });
    
    res.json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

router.post('/blockchain-review', authenticate, async (req, res) => {
  const { productId, rating, content } = req.body;
  try {
    // Blockchain integration disabled - storing review directly
    const review = await storage.createProductReview({ ...req.body, txHash: 'disabled' });
    res.json({ success: true, review, message: 'Blockchain integration coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

router.post('/track-share', async (req, res) => {
  const { productId } = req.body;
  // Track in DB
  res.json({ success: true });
});

router.post('/multiply-action', async (req, res) => {
  res.json({ multiplied: true });
});

router.post('/replicate', async (req, res) => {
  res.json({ replicated: true });
});

export default router;
