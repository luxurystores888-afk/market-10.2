import type { Request, Response, NextFunction } from 'express';

const DEFAULT_BLOCKLIST = [
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.io',
  'tempmail.net', 'dispostable.com', 'trashmail.com', 'yopmail.com', 'getnada.com'
];

export function blockDisposableEmail(req: Request, res: Response, next: NextFunction) {
  const email: string | undefined = req.body?.email;
  if (!email) return next();
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return next();
  const custom = (process.env.DISPOSABLE_EMAIL_BLOCKLIST || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const list = new Set([...DEFAULT_BLOCKLIST, ...custom]);
  if (list.has(domain)) {
    return res.status(400).json({ success: false, error: 'Disposable email addresses are not allowed.' });
  }
  return next();
}

