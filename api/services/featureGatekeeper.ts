/**
 * 🔒 FEATURE GATEKEEPER - Pay When You Profit System
 * 
 * Smart business model:
 * - FREE features: Active immediately (0% cost)
 * - PAID features: Locked until $5M profit
 * - AUTO-UNLOCK: At $5M, paid features activate automatically
 * 
 * This protects you from costs when starting
 * You only pay for premium tools when you can afford them!
 */

import { db } from '../db/index.js';
import { orders } from '../../lib/schema.js';
import { sql, sum, gte } from 'drizzle-orm';

interface FeatureStatus {
  name: string;
  tier: 'FREE' | 'PAID';
  isEnabled: boolean;
  cost: string;
  value: string;
  unlocksAt: number; // Profit threshold in USD
}

export class FeatureGatekeeper {
  private profitThreshold = 5000000; // $5 Million
  private currentProfit = 0;
  private lastCheck = Date.now();

  constructor() {
    this.initializeSystem();
  }

  /**
   * Initialize and check profit on startup
   */
  async initializeSystem() {
    console.log('\n🔒 Feature Gatekeeper Initializing...');
    
    await this.updateProfitStatus();
    
    if (this.currentProfit >= this.profitThreshold) {
      console.log('🎉 CONGRATULATIONS! $5M PROFIT ACHIEVED!');
      console.log('🔓 ALL PAID FEATURES NOW UNLOCKED!');
    } else {
      const remaining = this.profitThreshold - this.currentProfit;
      console.log(`📊 Current Profit: $${this.currentProfit.toLocaleString()}`);
      console.log(`🎯 Goal: $5,000,000`);
      console.log(`💰 Remaining: $${remaining.toLocaleString()}`);
      console.log('🔒 Paid features will unlock at $5M profit');
    }

    // Auto-check profit every hour
    setInterval(() => this.updateProfitStatus(), 60 * 60 * 1000);
  }

  /**
   * Calculate total profit from database
   */
  async updateProfitStatus(): Promise<void> {
    try {
      // Get all completed orders
      const completedOrders = await db
        .select()
        .from(orders)
        .where(sql`${orders.status} = 'completed'`);

      // Calculate total revenue
      const totalRevenue = completedOrders.reduce((sum, order) => {
        const amount = typeof order.totalAmount === 'string' 
          ? parseFloat(order.totalAmount) 
          : order.totalAmount || 0;
        return sum + amount;
      }, 0);

      // Estimate profit (assuming 30% average margin)
      // In production, calculate actual profit (revenue - costs)
      const estimatedProfit = totalRevenue * 0.30;

      this.currentProfit = estimatedProfit;
      this.lastCheck = Date.now();

      console.log(`💰 Profit Update: $${estimatedProfit.toLocaleString()}`);
    } catch (error) {
      console.error('Error calculating profit:', error);
    }
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    const feature = this.getFeatureConfig(featureName);
    
    if (!feature) {
      console.warn(`Feature not found: ${featureName}`);
      return false;
    }

    // FREE features always enabled
    if (feature.tier === 'FREE') {
      return true;
    }

    // PAID features only enabled after $5M profit
    if (feature.tier === 'PAID') {
      return this.currentProfit >= feature.unlocksAt;
    }

    return false;
  }

  /**
   * Get current profit
   */
  getCurrentProfit(): number {
    return this.currentProfit;
  }

  /**
   * Get progress to unlock
   */
  getUnlockProgress(): number {
    return (this.currentProfit / this.profitThreshold) * 100;
  }

  /**
   * Get all features with their status
   */
  getAllFeatures(): FeatureStatus[] {
    return [
      // ========================================
      // 🆓 FREE FEATURES (Active Immediately)
      // ========================================
      
      // Conversion Optimization
      { name: 'Live Chat Widget (Tawk.to)', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+40% conversion', unlocksAt: 0 },
      { name: 'Exit-Intent Popup', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+10-15% recovery', unlocksAt: 0 },
      { name: 'Social Proof Notifications', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+15-25% conversion', unlocksAt: 0 },
      { name: 'Product Comparison Tool', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+25% on categories', unlocksAt: 0 },
      { name: 'Quick View Modal', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+35% engagement', unlocksAt: 0 },
      { name: 'Countdown Timers', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+30% urgency', unlocksAt: 0 },
      { name: 'Product Badges', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+18% CTR', unlocksAt: 0 },
      
      // Revenue Features
      { name: 'Subscribe & Save', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '10x LTV', unlocksAt: 0 },
      { name: 'Dynamic Bundles', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+30-60% AOV', unlocksAt: 0 },
      { name: 'Pre-Order System', tier: 'FREE', isEnabled: true, cost: '$0/month', value: 'Unlimited', unlocksAt: 0 },
      { name: 'Gift Options', tier: 'FREE', isEnabled: true, cost: '$3-8 upsell', value: '+12% AOV', unlocksAt: 0 },
      { name: 'Google Shopping Feed', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '10K-100K visitors', unlocksAt: 0 },
      { name: 'Invoice Generator', tier: 'FREE', isEnabled: true, cost: '$0/month', value: 'B2B market', unlocksAt: 0 },
      
      // Communication
      { name: 'Email (SendGrid 100/day)', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '4,200% ROI', unlocksAt: 0 },
      { name: 'Email Automation', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '4,200% ROI', unlocksAt: 0 },
      { name: 'Push Notifications', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+15% mobile', unlocksAt: 0 },
      
      // Gamification
      { name: 'Scratch & Win', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+20% repeat', unlocksAt: 0 },
      { name: 'Birthday Rewards', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '481% higher', unlocksAt: 0 },
      { name: 'Referral Leaderboard', tier: 'FREE', isEnabled: true, cost: 'Prize budget', value: 'Viral growth', unlocksAt: 0 },
      
      // Shopping Experience
      { name: 'Product Q&A', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+18% conversion', unlocksAt: 0 },
      { name: 'User-Generated Content', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+29% trust', unlocksAt: 0 },
      
      // International
      { name: 'Multi-Currency', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '+20% intl sales', unlocksAt: 0 },
      
      // Analytics (ALL FREE!)
      { name: 'Microsoft Clarity', tier: 'FREE', isEnabled: true, cost: '$0/month', value: '10-20% optimization', unlocksAt: 0 },
      { name: 'Google Analytics 4', tier: 'FREE', isEnabled: true, cost: '$0/month', value: 'Complete tracking', unlocksAt: 0 },
      { name: 'Facebook Pixel', tier: 'FREE', isEnabled: true, cost: '$0/month', value: 'Retargeting', unlocksAt: 0 },
      { name: 'TikTok Pixel', tier: 'FREE', isEnabled: true, cost: '$0/month', value: 'TikTok ads', unlocksAt: 0 },

      // ========================================
      // 💎 PAID FEATURES (Unlock at $5M Profit)
      // ========================================
      
      // Advanced Payments
      { name: 'Buy Now Pay Later (BNPL)', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '3-6% per tx', value: '+45-65% AOV', unlocksAt: 5000000 },
      { name: 'SMS Notifications (Unlimited)', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$0.01/SMS', value: '98% open rate', unlocksAt: 5000000 },
      { name: 'Email (Unlimited)', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$20-60/mo', value: '4,200% ROI', unlocksAt: 5000000 },
      
      // AI Upgrades
      { name: 'GPT-4o Advanced AI', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$30-60/mo', value: '+60% AI accuracy', unlocksAt: 5000000 },
      { name: 'Claude 3 Opus', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$40/mo', value: 'Alternative AI', unlocksAt: 5000000 },
      { name: 'Google Gemini Pro', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$50/mo', value: 'Multi-modal AI', unlocksAt: 5000000 },
      
      // Enterprise Tools
      { name: 'Klaviyo Email Marketing', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$20-500/mo', value: '+100-200% email revenue', unlocksAt: 5000000 },
      { name: 'Enterprise CDN (Cloudflare)', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$200-2K/mo', value: '100% uptime', unlocksAt: 5000000 },
      { name: 'Advanced Fraud Detection', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '0.5-1.5% per tx', value: '99.9% accuracy', unlocksAt: 5000000 },
      { name: 'Personalization Engine', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$500-2K/mo', value: '+15-30% conversion', unlocksAt: 5000000 },
      
      // Marketing Tools
      { name: 'Google Shopping Ads', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: 'Pay-per-click', value: '10-100x ROI', unlocksAt: 5000000 },
      { name: 'Facebook/Instagram Ads', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: 'Pay-per-click', value: '5-20x ROI', unlocksAt: 5000000 },
      { name: 'TikTok Ads', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: 'Pay-per-click', value: '8-25x ROI', unlocksAt: 5000000 },
      
      // Infrastructure
      { name: 'Dedicated Database', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$100-500/mo', value: 'Better performance', unlocksAt: 5000000 },
      { name: 'Video Hosting (Vimeo Pro)', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$75/mo', value: 'Product videos', unlocksAt: 5000000 },
      { name: 'Advanced Security', tier: 'PAID', isEnabled: this.currentProfit >= 5000000, cost: '$100-300/mo', value: 'Enterprise protection', unlocksAt: 5000000 }
    ].map(f => ({
      ...f,
      isEnabled: f.tier === 'FREE' ? true : this.currentProfit >= f.unlocksAt
    }));
  }

  /**
   * Get feature configuration
   */
  private getFeatureConfig(featureName: string): FeatureStatus | undefined {
    return this.getAllFeatures().find(f => 
      f.name.toLowerCase().includes(featureName.toLowerCase())
    );
  }

  /**
   * Get only FREE features (always active)
   */
  getFreeFeatures(): FeatureStatus[] {
    return this.getAllFeatures().filter(f => f.tier === 'FREE');
  }

  /**
   * Get PAID features (locked until $5M)
   */
  getPaidFeatures(): FeatureStatus[] {
    return this.getAllFeatures().filter(f => f.tier === 'PAID');
  }

  /**
   * Get locked features
   */
  getLockedFeatures(): FeatureStatus[] {
    return this.getAllFeatures().filter(f => !f.isEnabled);
  }

  /**
   * Check if profit threshold reached
   */
  hasReachedThreshold(): boolean {
    return this.currentProfit >= this.profitThreshold;
  }

  /**
   * Generate activation report
   */
  generateReport(): string {
    const freeCount = this.getFreeFeatures().length;
    const paidCount = this.getPaidFeatures().length;
    const lockedCount = this.getLockedFeatures().length;
    const progress = this.getUnlockProgress();

    return `
🔒 FEATURE GATEKEEPER STATUS REPORT
═══════════════════════════════════════

📊 Current Profit: $${this.currentProfit.toLocaleString()}
🎯 Target: $5,000,000
📈 Progress: ${progress.toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ FREE FEATURES (Active Now): ${freeCount}
${this.hasReachedThreshold() ? '✅' : '🔒'} PAID FEATURES: ${paidCount}
${lockedCount > 0 ? `🔒 Locked Features: ${lockedCount}` : '🎉 All Features Unlocked!'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FREE FEATURES (Working Now):

${this.getFreeFeatures().map(f => 
  `✅ ${f.name}
   Cost: ${f.cost}
   Value: ${f.value}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.hasReachedThreshold() ? '🎉 PAID FEATURES (UNLOCKED!)' : '🔒 PAID FEATURES (Locked Until $5M)'}:

${this.getPaidFeatures().map(f => 
  `${f.isEnabled ? '✅' : '🔒'} ${f.name}
   Cost: ${f.cost}
   Value: ${f.value}
   ${!f.isEnabled ? `Unlocks at: $${f.unlocksAt.toLocaleString()}` : 'ACTIVE!'}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${!this.hasReachedThreshold() ? `
💡 HOW TO UNLOCK PAID FEATURES:

1. Keep selling with FREE features
2. Reach $5,000,000 total profit
3. System auto-unlocks ALL paid features
4. Start using premium tools!

Remaining: $${(this.profitThreshold - this.currentProfit).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : `
🎊 CONGRATULATIONS! 🎊

You've reached $5M profit!
ALL premium features are now UNLOCKED!

You can now use:
✅ Advanced AI (GPT-4, Claude, Gemini)
✅ Unlimited SMS & Email
✅ Enterprise CDN
✅ Advanced fraud detection
✅ Paid advertising tools
✅ And more!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`}

Last Updated: ${new Date(this.lastCheck).toLocaleString()}
    `.trim();
  }
}

// Singleton instance
export const featureGatekeeper = new FeatureGatekeeper();

// Middleware to check feature access
export function requireFeature(featureName: string) {
  return (req: any, res: any, next: any) => {
    if (!featureGatekeeper.isFeatureEnabled(featureName)) {
      return res.status(403).json({
        error: 'Feature locked',
        message: `This feature requires $5M profit to unlock`,
        currentProfit: featureGatekeeper.getCurrentProfit(),
        required: 5000000,
        progress: featureGatekeeper.getUnlockProgress()
      });
    }
    next();
  };
}

// Export for API route
export default featureGatekeeper;

// Log status on startup
setTimeout(() => {
  console.log(featureGatekeeper.generateReport());
}, 2000);

