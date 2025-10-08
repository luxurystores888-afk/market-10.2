import express from 'express';
import { profitTracker } from '../services/profitTracker';

const router = express.Router();

/**
 * 💰 PROFIT TRACKER API ROUTES
 * Monitor profit and reinvestment strategy
 */

// Get current profit status
router.get('/status', async (req, res) => {
  try {
    const status = profitTracker.getStatus();
    
    res.json({
      success: true,
      profit: status.currentProfit,
      profitFormatted: profitTracker.formatCurrency(status.currentProfit),
      stage: status.currentStage,
      reinvestmentBudget: status.reinvestmentBudget,
      reinvestmentFormatted: profitTracker.formatCurrency(status.reinvestmentBudget),
      nextMilestone: status.nextMilestone,
      nextMilestoneFormatted: profitTracker.formatCurrency(status.nextMilestone),
      progressToNext: status.progressToNext,
      message: `Currently in ${status.currentStage.name} - ${status.progressToNext.toFixed(1)}% to next stage`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get profit status'
    });
  }
});

// Force profit recalculation
router.post('/recalculate', async (req, res) => {
  try {
    await profitTracker.checkAndTriggerReinvestment();
    const status = profitTracker.getStatus();
    
    res.json({
      success: true,
      message: 'Profit recalculated successfully',
      profit: profitTracker.formatCurrency(status.currentProfit),
      stage: status.currentStage.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate profit'
    });
  }
});

// Get all stages information
router.get('/stages', (req, res) => {
  res.json({
    success: true,
    stages: [
      {
        stage: 1,
        name: 'Bootstrap',
        range: '$0 - $5M',
        reinvestment: '0%',
        focus: 'Free stack, organic growth'
      },
      {
        stage: 2,
        name: 'Growth',
        range: '$5M - $50M',
        reinvestment: '30%',
        focus: 'Paid ads, premium infrastructure'
      },
      {
        stage: 3,
        name: 'Scale',
        range: '$50M - $500M',
        reinvestment: '40%',
        focus: 'Partnerships, global infrastructure'
      },
      {
        stage: 4,
        name: 'Unicorn',
        range: '$500M - $1T',
        reinvestment: '50%',
        focus: 'Institutional, token sales, enterprise'
      }
    ]
  });
});

// Get recommended actions for current stage
router.get('/recommendations', async (req, res) => {
  try {
    const status = profitTracker.getStatus();
    const stage = status.currentStage;
    
    const recommendations = [];

    if (stage.stage === 1) {
      recommendations.push(
        'Focus on organic growth - use all free tools',
        'Post 10-20x daily on social media',
        'Build email list with free tiers',
        'Optimize conversion with built-in features',
        'Target: Reach $5M to unlock paid tier'
      );
    } else if (stage.stage === 2) {
      const adBudget = status.reinvestmentBudget * 0.40;
      recommendations.push(
        `Start paid advertising with $${profitTracker.formatCurrency(adBudget)} budget`,
        'Upgrade to premium infrastructure',
        'Get unlimited AI API access',
        'Implement KYC/AML for larger transactions',
        'Target: Scale to $50M'
      );
    } else if (stage.stage === 3) {
      recommendations.push(
        'Pursue celebrity partnerships',
        'Deploy global infrastructure',
        'Set up institutional custody',
        'Create strategic alliances',
        'Target: Reach $500M'
      );
    } else {
      recommendations.push(
        'Launch institutional token sale',
        'Pursue government contracts',
        'Build ultra-low-latency systems',
        'Secure insurance and guarantees',
        'Target: $1 TRILLION!'
      );
    }

    res.json({
      success: true,
      stage: stage.name,
      profit: profitTracker.formatCurrency(status.currentProfit),
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

export default router;
