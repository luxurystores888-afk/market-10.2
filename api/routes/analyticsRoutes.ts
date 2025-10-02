import express from 'express';
import { requireAdmin, authenticate } from '../middleware/auth.ts';
import { storage } from '../storage.ts';

// Define types for analytics data
interface OrderAnalytics {
  id: string;
  totalAmount: string; // Decimal stored as string
  createdAt: Date;
  orderItems?: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface UserAnalytics {
  id: string;
  createdAt: Date;
  lastLogin: Date | null;
}

const analyticsRoutes = express.Router();

// Update routes to match doc
analyticsRoutes.get('/dashboard', requireAdmin, async (req, res) => {
  const sales = await storage.getSalesAnalytics('30d');
  const users = await storage.getUserAnalytics();
  const products = await storage.getProductAnalytics();
  const system = await storage.getSystemAnalytics();
  res.json({ sales, users, products, system });
});

analyticsRoutes.get('/performance', requireAdmin, async (req, res) => {
  const performance = await storage.getProductAnalytics(); // Or specific
  res.json(performance);
});

analyticsRoutes.get('/revenue', requireAdmin, async (req, res) => {
  const revenue = await storage.getSalesAnalytics(req.query.range as string);
  res.json(revenue);
});

analyticsRoutes.post('/events', async (req, res) => {
  const event = req.body;
  await storage.createAnalyticsEvent(event);
  res.json({ success: true });
});

// Remove or adjust old endpoints to avoid duplication.
// ... existing code ...

export { analyticsRoutes };