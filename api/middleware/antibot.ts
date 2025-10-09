import type { Request, Response, NextFunction } from 'express';

// Honeypot + form-speed check that never blocks real users (only obvious bots)
export function antiBotGuard(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Honeypot field: many bots fill every field
    const trap = (req.body && (req.body.honeypot || req.body._hp || req.body.website)) as string | undefined;
    if (typeof trap === 'string' && trap.trim().length > 0) {
      return res.status(400).json({ success: false, error: 'Bot activity detected' });
    }

    // 2) Form speed: if client sends x-form-start (ms epoch), require >= 1.5s elapsed
    const header = req.headers['x-form-start'];
    const start = typeof header === 'string' ? parseInt(header, 10) : NaN;
    if (!Number.isNaN(start)) {
      const elapsed = Date.now() - start;
      if (elapsed < 1500) {
        return res.status(429).json({ success: false, error: 'Form submitted too quickly' });
      }
    }

    return next();
  } catch {
    return next();
  }
}

