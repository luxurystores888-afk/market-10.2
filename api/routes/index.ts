import { pushRoutes } from './pushRoutes';
import { productRoutes } from './productRoutes';
import { authRoutes } from './authRoutes';
import { paymentRoutes } from './paymentRoutes';
import { webauthnRoutes } from './webauthnRoutes';
import { getRecentAuditLines } from '../services/auditLog.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const registerRoutes = (app) => {
  app.use('/push', pushRoutes);
  app.use('/products', productRoutes);
  app.use('/auth', authRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/webauthn', webauthnRoutes);

  // Admin audit log (last N lines)
  app.get('/admin/audit', requireAdmin, (req, res) => {
    const lines = getRecentAuditLines(200);
    res.json({ lines });
  });
};
