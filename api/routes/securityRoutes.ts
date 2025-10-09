import express from 'express';
import { realSecurity } from '../middleware/realSecurityEnhanced';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * 🛡️ SECURITY MONITORING ROUTES
 * Real-time security status and controls
 */

// Get current security status (admin only)
router.get('/status', requireAdmin, (req, res) => {
  try {
    const status = realSecurity.getStatus();
    
    res.json({
      success: true,
      status: 'Active',
      timestamp: new Date().toISOString(),
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get security status'
    });
  }
});

// Block IP (admin only)
router.post('/block-ip', requireAdmin, (req, res) => {
  try {
    const { ip } = req.body;
    
    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP address required'
      });
    }

    realSecurity.blockIP(ip);
    
    res.json({
      success: true,
      message: `IP ${ip} blocked successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to block IP'
    });
  }
});

// Unblock IP (admin only)
router.post('/unblock-ip', requireAdmin, (req, res) => {
  try {
    const { ip } = req.body;
    
    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP address required'
      });
    }

    realSecurity.unblockIP(ip);
    
    res.json({
      success: true,
      message: `IP ${ip} unblocked successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to unblock IP'
    });
  }
});

// Get security logs (simplified)
router.get('/logs', requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Security logs',
    logs: [
      {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Security system operational'
      }
    ]
  });
});

export default router;
