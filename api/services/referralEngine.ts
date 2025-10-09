/**
 * 🔗 VIRAL REFERRAL ENGINE
 * 
 * Complete referral system with tiered commissions
 * Integrated with NFT minting and e-commerce
 */

import { db } from '../db';
import { users } from '../../lib/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

interface ReferralCode {
  code: string;
  userId: string;
  clicks: number;
  conversions: number;
  totalEarnings: number;
}

interface ReferralTier {
  name: string;
  minReferrals: number;
  commission: number; // Percentage
  bonuses: string[];
}

export class ReferralEngine {
  private tiers: ReferralTier[] = [
    {
      name: 'Bronze Affiliate',
      minReferrals: 0,
      commission: 5, // 5%
      bonuses: []
    },
    {
      name: 'Silver Affiliate',
      minReferrals: 10,
      commission: 10, // 10%
      bonuses: ['Priority support', 'Monthly bonus $50']
    },
    {
      name: 'Gold Affiliate',
      minReferrals: 50,
      commission: 15, // 15%
      bonuses: ['Priority support', 'Monthly bonus $250', 'Exclusive products access']
    },
    {
      name: 'Platinum Affiliate',
      minReferrals: 100,
      commission: 20, // 20%
      bonuses: ['Dedicated account manager', 'Monthly bonus $1000', 'Revenue sharing']
    }
  ];
  
  /**
   * Generate unique referral code for user
   */
  async generateReferralCode(userId: string): Promise<string> {
    // Check if user already has code
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (existingUser[0]?.referralCode) {
      return existingUser[0].referralCode;
    }
    
    // Generate unique code
    let code = '';
    let isUnique = false;
    
    while (!isUnique) {
      code = this.generateCode();
      const existing = await db.select().from(users).where(eq(users.referralCode, code)).limit(1);
      isUnique = existing.length === 0;
    }
    
    // Save code to user
    await db.update(users)
      .set({ referralCode: code })
      .where(eq(users.id, userId));
    
    return code;
  }
  
  /**
   * Generate random referral code
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar chars
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
  
  /**
   * Track referral click
   */
  async trackClick(referralCode: string, ipAddress: string) {
    // Log referral click
    console.log(`Referral click: ${referralCode} from ${ipAddress}`);
    
    // Store in analytics
    // await db.insert(referralClicks).values({ referralCode, ipAddress, timestamp: new Date() });
  }
  
  /**
   * Process referral conversion (sale or NFT mint)
   */
  async processConversion(referralCode: string, amount: number, type: 'sale' | 'mint'): Promise<{
    commission: number;
    tier: string;
  }> {
    // Find referrer
    const referrer = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
    
    if (!referrer[0]) {
      return { commission: 0, tier: 'None' };
    }
    
    // Get referrer's tier
    const referralCount = await this.getReferralCount(referrer[0].id);
    const tier = this.getTier(referralCount);
    
    // Calculate commission
    const commission = (amount * tier.commission) / 100;
    
    // Record earning
    // await db.insert(referralEarnings).values({
    //   referrerId: referrer[0].id,
    //   amount: commission,
    //   type,
    //   timestamp: new Date()
    // });
    
    console.log(`Referral commission: ${referralCode} earned $${commission} (${tier.name})`);
    
    // Send notification
    await this.notifyReferrer(referrer[0].id, commission, type);
    
    return { commission, tier: tier.name };
  }
  
  /**
   * Get referral count for user
   */
  async getReferralCount(userId: string): Promise<number> {
    // Count successful referrals from database
    // const count = await db.select().from(referrals).where(eq(referrals.referrerId, userId));
    // return count.length;
    return 0; // Placeholder
  }
  
  /**
   * Get tier based on referral count
   */
  getTier(referralCount: number): ReferralTier {
    return this.tiers
      .slice()
      .reverse()
      .find(tier => referralCount >= tier.minReferrals) || this.tiers[0];
  }
  
  /**
   * Generate referral link
   */
  generateReferralLink(code: string, baseUrl: string = 'https://yourstore.com'): string {
    return `${baseUrl}?ref=${code}`;
  }
  
  /**
   * Get referral leaderboard
   */
  async getLeaderboard(limit: number = 10) {
    // Get top referrers
    // const topReferrers = await db.select()
    //   .from(users)
    //   .orderBy(desc(referralCount))
    //   .limit(limit);
    
    return []; // Placeholder
  }
  
  /**
   * Notify referrer of new commission
   */
  async notifyReferrer(userId: string, amount: number, type: string) {
    // Send email/SMS/push notification
    console.log(`Notifying user ${userId}: Earned $${amount} from ${type}`);
    
    // await emailService.send({
    //   to: user.email,
    //   subject: '💰 You Earned a Commission!',
    //   body: `You just earned $${amount} from a ${type}! Keep sharing!`
    // });
  }
  
  /**
   * Generate viral marketing campaign for referrer
   */
  async generateViralCampaign(userId: string, referralCode: string) {
    const link = this.generateReferralLink(referralCode);
    
    const templates = {
      email: `
        🎁 EXCLUSIVE INVITATION!
        
        I'm loving this store and thought you'd love it too!
        
        Use my link to get 10% OFF your first order:
        ${link}
        
        (And I get rewarded when you shop - win-win!)
        
        Check it out! 🚀
      `,
      
      twitter: `🔥 Found an amazing store with AI features, NFTs, and crypto payments!\n\nGet 10% OFF with my link:\n${link}\n\n#ecommerce #crypto #AI`,
      
      facebook: `Hey friends! 🎁\n\nI found this incredible online store and wanted to share!\n\nUse my special link for 10% OFF:\n${link}\n\nYou're going to love it! 💎`,
      
      instagram: `Check out this amazing store! 🛍️✨\n\nSwipe up for 10% OFF!\n\nLink in bio: ${link}\n\n#shopping #deals #tech #crypto`,
      
      whatsapp: `Hi! 👋\n\nI found this great store and thought of you!\n\nGet 10% OFF here: ${link}\n\nThey have amazing products! 🎁`
    };
    
    return templates;
  }
}

export const referralEngine = new ReferralEngine();

