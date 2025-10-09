import { Router } from 'express';
import { featureGatekeeper } from '../services/featureGatekeeper.js';

const router = Router();

/**
 * GET /api/features/status
 * Returns current feature lock status
 */
router.get('/features/status', async (req, res) => {
  try {
    await featureGatekeeper.updateProfitStatus();
    
    res.json({
      success: true,
      currentProfit: featureGatekeeper.getCurrentProfit(),
      profitGoal: 5000000,
      progress: featureGatekeeper.getUnlockProgress(),
      hasReachedThreshold: featureGatekeeper.hasReachedThreshold(),
      features: featureGatekeeper.getAllFeatures(),
      freeFeatures: featureGatekeeper.getFreeFeatures(),
      paidFeatures: featureGatekeeper.getPaidFeatures(),
      lockedFeatures: featureGatekeeper.getLockedFeatures()
    });
  } catch (error) {
    console.error('Error getting feature status:', error);
    res.status(500).json({ error: 'Failed to get feature status' });
  }
});

/**
 * GET /api/features/report
 * Returns detailed text report
 */
router.get('/features/report', async (req, res) => {
  try {
    await featureGatekeeper.updateProfitStatus();
    
    const report = featureGatekeeper.generateReport();
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * POST /api/features/check/:featureName
 * Check if specific feature is enabled
 */
router.post('/features/check/:featureName', (req, res) => {
  const { featureName } = req.params;
  const isEnabled = featureGatekeeper.isFeatureEnabled(featureName);
  
  res.json({
    feature: featureName,
    isEnabled,
    currentProfit: featureGatekeeper.getCurrentProfit(),
    required: isEnabled ? 0 : 5000000
  });
});

export default router;

