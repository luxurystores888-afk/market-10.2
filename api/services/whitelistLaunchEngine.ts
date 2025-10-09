/**
 * 🎯 WHITELIST & VIP PRE-LAUNCH ENGINE
 * 
 * Exclusive pre-sale system for:
 * - Top-tier investors
 * - Influencers
 * - Enterprise partners
 * 
 * Like: Every successful NFT/crypto launch
 * Creates FOMO + early revenue + social proof
 */

import { db } from '../db';
import crypto from 'crypto';

interface WhitelistEntry {
  id: string;
  email: string;
  walletAddress: string;
  tier: 'founder' | 'investor' | 'influencer' | 'enterprise' | 'vip';
  priority: number; // 1-5, 1 = highest
  allocation: number; // Max NFTs they can buy
  referralCode: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  purchasedCount: number;
}

interface PresaleConfig {
  startTime: Date;
  endTime: Date;
  duration: number; // Hours
  priceMultiplier: number; // e.g., 1.2 = 20% premium
  maxAllocation: number;
  totalAllocated: number;
  totalSold: number;
}

export class WhitelistLaunchEngine {
  private whitelist: Map<string, WhitelistEntry> = new Map();
  private tiers = {
    founder: {
      priority: 1,
      maxAllocation: 100, // Can buy up to 100
      bonuses: ['Lifetime VIP status', 'Revenue share', '50% discount on all future drops']
    },
    investor: {
      priority: 2,
      maxAllocation: 50,
      bonuses: ['Early access to all products', '30% discount', 'Quarterly dividends']
    },
    influencer: {
      priority: 3,
      maxAllocation: 25,
      bonuses: ['Free NFT', '20% referral commission', 'Co-marketing opportunities']
    },
    enterprise: {
      priority: 2,
      maxAllocation: 100,
      bonuses: ['White-label license discount', 'API access', 'Dedicated support']
    },
    vip: {
      priority: 4,
      maxAllocation: 10,
      bonuses: ['10% discount', 'VIP discord access']
    }
  };
  
  /**
   * Submit whitelist application
   */
  async applyForWhitelist(data: {
    email: string;
    walletAddress: string;
    tier: string;
    linkedIn?: string;
    twitter?: string;
    investmentCapacity?: number;
    influence?: string;
    reason: string;
  }): Promise<{ status: string; referralCode?: string }> {
    
    console.log(`📝 Whitelist application: ${data.email} (${data.tier})`);
    
    // Validate
    if (!data.email || !data.walletAddress) {
      throw new Error('Email and wallet required');
    }
    
    // Check if already applied
    if (this.whitelist.has(data.email)) {
      return { status: 'already_applied' };
    }
    
    // Create entry
    const entry: WhitelistEntry = {
      id: crypto.randomUUID(),
      email: data.email,
      walletAddress: data.walletAddress,
      tier: data.tier as any,
      priority: this.tiers[data.tier as keyof typeof this.tiers]?.priority || 5,
      allocation: this.tiers[data.tier as keyof typeof this.tiers]?.maxAllocation || 1,
      referralCode: this.generateReferralCode(),
      status: 'pending',
      purchasedCount: 0
    };
    
    this.whitelist.set(data.email, entry);
    
    // Auto-approve based on tier and criteria
    const shouldAutoApprove = await this.evaluateApplication(data);
    
    if (shouldAutoApprove) {
      entry.status = 'approved';
      entry.approvedAt = new Date();
      
      // Send approval email with presale details
      await this.sendApprovalEmail(entry);
      
      return {
        status: 'approved',
        referralCode: entry.referralCode
      };
    }
    
    // Manual review required
    await this.notifyTeamForReview(entry);
    
    return { status: 'pending_review' };
  }
  
  /**
   * Evaluate application (auto-approve logic)
   */
  private async evaluateApplication(data: any): Promise<boolean> {
    // Auto-approve criteria
    const criteria = {
      founder: data.investmentCapacity >= 100000, // $100k+ capacity
      investor: data.investmentCapacity >= 50000,
      influencer: data.influence && parseInt(data.influence) >= 10000, // 10k+ followers
      enterprise: data.linkedIn && data.linkedIn.includes('CEO'),
      vip: true // Auto-approve VIPs
    };
    
    return criteria[data.tier as keyof typeof criteria] || false;
  }
  
  /**
   * Launch 48-hour presale
   */
  async launchPresale(config: {
    startTime: Date;
    durationHours: number;
    priceMultiplier: number; // e.g., 1.2 = 20% higher
    maxAllocation: number;
  }): Promise<PresaleConfig> {
    
    const presale: PresaleConfig = {
      startTime: config.startTime,
      endTime: new Date(config.startTime.getTime() + config.durationHours * 60 * 60 * 1000),
      duration: config.durationHours,
      priceMultiplier: config.priceMultiplier,
      maxAllocation: config.maxAllocation,
      totalAllocated: 0,
      totalSold: 0
    };
    
    console.log(`🚀 PRESALE LAUNCHING!`);
    console.log(`   Start: ${presale.startTime}`);
    console.log(`   Duration: ${config.durationHours} hours`);
    console.log(`   Price: ${(config.priceMultiplier * 100 - 100).toFixed(0)}% premium`);
    console.log(`   Max allocation: ${config.maxAllocation} NFTs`);
    console.log(``);
    
    // Email all approved whitelist members
    const approved = Array.from(this.whitelist.values()).filter(e => e.status === 'approved');
    
    for (const entry of approved) {
      await this.sendPresaleInvite(entry, presale);
    }
    
    console.log(`✅ Presale invites sent to ${approved.length} whitelist members!`);
    
    return presale;
  }
  
  /**
   * Process whitelist purchase
   */
  async processWhitelistPurchase(
    email: string,
    quantity: number
  ): Promise<{ success: boolean; message: string }> {
    
    const entry = this.whitelist.get(email);
    
    if (!entry) {
      return { success: false, message: 'Not on whitelist' };
    }
    
    if (entry.status !== 'approved') {
      return { success: false, message: 'Not approved yet' };
    }
    
    if (entry.purchasedCount + quantity > entry.allocation) {
      return {
        success: false,
        message: `Exceeds allocation (max ${entry.allocation}, you have ${entry.allocation - entry.purchasedCount} left)`
      };
    }
    
    // Process purchase
    entry.purchasedCount += quantity;
    
    console.log(`✅ Whitelist purchase: ${email} bought ${quantity} (tier: ${entry.tier})`);
    
    // Award tier bonuses
    await this.awardTierBonuses(entry);
    
    return {
      success: true,
      message: `Successfully purchased ${quantity} NFTs!`
    };
  }
  
  /**
   * Get whitelist stats
   */
  getWhitelistStats() {
    const entries = Array.from(this.whitelist.values());
    
    const byTier = {
      founder: entries.filter(e => e.tier === 'founder').length,
      investor: entries.filter(e => e.tier === 'investor').length,
      influencer: entries.filter(e => e.tier === 'influencer').length,
      enterprise: entries.filter(e => e.tier === 'enterprise').length,
      vip: entries.filter(e => e.tier === 'vip').length
    };
    
    const approved = entries.filter(e => e.status === 'approved').length;
    const totalAllocation = entries.reduce((sum, e) => sum + e.allocation, 0);
    const totalPurchased = entries.reduce((sum, e) => sum + e.purchasedCount, 0);
    
    return {
      total: entries.length,
      approved,
      pending: entries.filter(e => e.status === 'pending').length,
      byTier,
      totalAllocation,
      totalPurchased,
      remainingAllocation: totalAllocation - totalPurchased
    };
  }
  
  private generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  
  private async sendApprovalEmail(entry: WhitelistEntry) {
    console.log(`📧 Sending approval email to ${entry.email}`);
    
    const bonuses = this.tiers[entry.tier].bonuses;
    
    // Email template
    const email = {
      to: entry.email,
      subject: '✅ APPROVED! Your Platinum Pass Whitelist Access',
      body: `
        Congratulations! You've been approved for the ${entry.tier.toUpperCase()} tier!
        
        Your Benefits:
        ${bonuses.map(b => `  • ${b}`).join('\n')}
        
        Allocation: Up to ${entry.allocation} NFTs
        Your Referral Code: ${entry.referralCode}
        
        Presale starts in 7 days!
        You'll get first access before public launch.
        
        Price: 20% premium (worth it for early access!)
        
        Get ready! 🚀
      `
    };
    
    // Send email
  }
  
  private async sendPresaleInvite(entry: WhitelistEntry, presale: PresaleConfig) {
    console.log(`📧 Sending presale invite to ${entry.email}`);
  }
  
  private async notifyTeamForReview(entry: WhitelistEntry) {
    console.log(`🔔 Team notified: Review ${entry.tier} application from ${entry.email}`);
  }
  
  private async awardTierBonuses(entry: WhitelistEntry) {
    const bonuses = this.tiers[entry.tier].bonuses;
    console.log(`🎁 Awarding ${entry.tier} bonuses to ${entry.email}`);
    console.log(`   Bonuses: ${bonuses.join(', ')}`);
  }
}

export const whitelistLaunchEngine = new WhitelistLaunchEngine();

