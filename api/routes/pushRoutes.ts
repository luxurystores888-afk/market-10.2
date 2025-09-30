import express from 'express';
import webpush from 'web-push';
import { authenticate } from '../middleware/auth';
import { db } from '../db';
import { pushSubscriptions, users } from '../../lib/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Configure VAPID from env
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
if (PUBLIC_KEY && PRIVATE_KEY) {
  webpush.setVapidDetails('mailto:no-reply@pulse.local', PUBLIC_KEY, PRIVATE_KEY);
}

router.get('/public-key', (req, res) => {
  res.json({ publicKey: PUBLIC_KEY });
});

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { endpoint, keys } = req.body || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    const result = await db
      .insert(pushSubscriptions)
      .values({ userId, endpoint, p256dh: keys.p256dh, auth: keys.auth })
      .onConflictDoNothing()
      .returning();
    res.json({ success: true, subscription: result[0] || null });
  } catch (e: any) {
    res.status(500).json({ error: 'Subscribe failed', message: e.message, suggestion: 'Please try again later' });
  }
});

router.post('/notify-test', authenticate, async (req, res) => {
  try {
    if (!PUBLIC_KEY || !PRIVATE_KEY) {
      return res.status(400).json({ error: 'VAPID keys not configured' });
    }
    const userId = req.user?.id || null;
    if (!userId) return res.status(400).json({ error: 'User required' });
    const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
    const payload = JSON.stringify({ title: 'PULSE', body: 'Push notifications enabled.' });
    await Promise.all(subs.map(s => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } } as any, payload).catch(() => {})));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Notify failed', message: e.message });
  }
});

export default router;


