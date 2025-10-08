import express from 'express';
import { featureLockSystem } from '../services/featureLockSystem.ts';

const router = express.Router();

/**
 * 🔐 FEATURE LOCK SYSTEM API ROUTES
 * Pay When You Profit - نظام الدفع عند الربح
 */

// Get overall status
router.get('/status', async (req, res) => {
  try {
    const status = await featureLockSystem.getAllFeaturesStatus();
    
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get feature lock status'
    });
  }
});

// Check specific feature
router.get('/feature/:featureId', (req, res) => {
  try {
    const { featureId } = req.params;
    const status = featureLockSystem.getFeatureStatus(featureId);
    
    res.json({
      success: true,
      featureId,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check feature status'
    });
  }
});

// Activate specific feature
router.post('/activate/:featureId', async (req, res) => {
  try {
    const { featureId } = req.params;
    const result = await featureLockSystem.activateFeature(featureId);
    
    res.json({
      success: result.success,
      message: result.message,
      messageAr: result.messageAr
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to activate feature'
    });
  }
});

// Force check unlock status
router.post('/check-unlock', async (req, res) => {
  try {
    const unlocked = await featureLockSystem.checkUnlockStatus();
    
    res.json({
      success: true,
      unlocked,
      message: unlocked 
        ? 'Paid features are unlocked!' 
        : 'Still locked - keep building profit!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check unlock status'
    });
  }
});

// Get available features only
router.get('/available', async (req, res) => {
  try {
    const allStatus = await featureLockSystem.getAllFeaturesStatus();
    
    const available = allStatus.features.filter(f => f.status.available);
    
    res.json({
      success: true,
      count: available.length,
      features: available
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get available features'
    });
  }
});

// Get locked features only
router.get('/locked', async (req, res) => {
  try {
    const allStatus = await featureLockSystem.getAllFeaturesStatus();
    
    const locked = allStatus.features.filter(f => f.status.locked);
    
    res.json({
      success: true,
      count: locked.length,
      features: locked,
      remaining: allStatus.remainingFormatted,
      progress: allStatus.progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get locked features'
    });
  }
});

export default router;
