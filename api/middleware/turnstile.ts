import type { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';
// Auto-enable if secret key is present, or explicit flag
const ENABLED = !!TURNSTILE_SECRET || process.env.TURNSTILE_ENABLED === 'true';

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction) {
  if (!ENABLED) return next();

  try {
    const token = (req.body && (req.body['cf-turnstile-response'] || req.body['turnstileToken'])) || req.headers['cf-turnstile-response'];
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, error: 'Turnstile token missing' });
    }

    const ip = (req.headers['cf-connecting-ip'] as string) || req.ip;
    const form = new URLSearchParams();
    form.append('secret', TURNSTILE_SECRET);
    form.append('response', token);
    form.append('remoteip', ip);

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form
    });
    const data = await r.json();
    if (data.success) return next();
    return res.status(403).json({ success: false, error: 'Turnstile verification failed', data });
  } catch (e) {
    return res.status(500).json({ success: false, error: 'Turnstile verification error' });
  }
}

