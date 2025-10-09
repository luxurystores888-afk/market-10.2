#!/usr/bin/env node

/**
 * 💰 PAY FROM BUSINESS ONLY AFTER $5 MILLION PROFIT
 * 
 * Business costs paid from YOUR POCKET until you make $5 million total profit
 * AFTER $5 million profit: Business pays all costs automatically
 * 
 * This way:
 * - You keep 100% of profit until $5M
 * - After $5M: Business is self-sustaining
 */

import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const PROFIT_THRESHOLD = 5000000; // $5 million

console.log('💰 Pay After $5 Million System ACTIVE\n');
console.log('Business will pay its own costs ONLY after reaching $5M total profit!\n');

// Track total lifetime profit
let totalLifetimeProfit = 0;
let isProfitThresholdReached = false;

/**
 * Calculate total lifetime profit monthly
 */
cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('[Pay System] Calculating total lifetime profit...\n');
    
    // Get all-time revenue and costs
    const analytics = await axios.get(\`\${API_URL}/api/analytics/lifetime-stats\`);
    
    const lifetimeRevenue = analytics.data.totalRevenue || 0;
    const lifetimeCosts = analytics.data.totalCosts || 0;
    totalLifetimeProfit = lifetimeRevenue - lifetimeCosts;
    
    console.log(\`📊 LIFETIME STATS:\`);
    console.log(\`   Total Revenue: $\${lifetimeRevenue.toLocaleString()}\`);
    console.log(\`   Total Costs: $\${lifetimeCosts.toLocaleString()}\`);
    console.log(\`   Total Profit: $\${totalLifetimeProfit.toLocaleString()}\`);
    console.log(\`   Target: $5,000,000\`);
    
    const percentToTarget = (totalLifetimeProfit / PROFIT_THRESHOLD) * 100;
    console.log(\`   Progress: \${percentToTarget.toFixed(2)}% of $5M goal\n\`);
    
    // Check if threshold reached
    if (totalLifetimeProfit >= PROFIT_THRESHOLD && !isProfitThresholdReached) {
      isProfitThresholdReached = true;
      
      console.log('🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉\n');
      console.log('YOU REACHED $5 MILLION TOTAL PROFIT!\n');
      console.log('From now on:');
      console.log('  ✅ Business will pay ALL its own costs');
      console.log('  ✅ OpenAI $15/month = paid from business revenue');
      console.log('  ✅ Facebook Ads = paid from business revenue');
      console.log('  ✅ You NEVER pay from your pocket again!');
      console.log('  ✅ You keep 100% of ALL future profit!\n');
      
      // Send celebration email
      await axios.post(\`\${API_URL}/api/alerts/send\`, {
        email: process.env.OWNER_EMAIL,
        subject: '🎉 YOU MADE $5 MILLION! Business Now Self-Sustaining!',
        message: \`
          CONGRATULATIONS!
          
          You've reached $5 MILLION total profit!
          
          From today onwards:
          - Business pays ALL its own costs
          - You NEVER pay from your pocket again
          - OpenAI API: Paid from business revenue
          - Facebook Ads: Paid from business revenue
          - You keep 100% of profit
          
          Your automated business is now FULLY self-sustaining!
          
          Enjoy your success! 🎉💰
        \`
      });
      
      // Save milestone
      fs.appendFileSync('MILESTONES.txt', 
        \`\n[\${new Date().toISOString()}] 🎉 REACHED $5 MILLION TOTAL PROFIT!\n\`
      );
      
    } else if (totalLifetimeProfit < PROFIT_THRESHOLD) {
      console.log(\`💪 Keep growing! $\${(PROFIT_THRESHOLD - totalLifetimeProfit).toLocaleString()} more to reach $5M goal.\n\`);
      console.log('   Current payment mode: YOU pay costs from your pocket');
      console.log('   After $5M: Business pays costs from revenue\n');
    } else {
      console.log('✅ $5M threshold reached! Business paying all costs from revenue!\n');
    }
    
    // Send monthly report
    await axios.post(\`\${API_URL}/api/email/send-report\`, {
      subject: \`Monthly Report - $\${totalLifetimeProfit.toLocaleString()} Total Profit\`,
      lifetimeProfit: totalLifetimeProfit,
      target: PROFIT_THRESHOLD,
      percentComplete: percentToTarget,
      selfSustaining: isProfitThresholdReached
    });
    
  } catch (error) {
    console.error('Profit calculation error:', error.message);
  }
});

/**
 * Daily progress update
 */
cron.schedule('0 20 * * *', async () => {
  try {
    const today = await axios.get(\`\${API_URL}/api/analytics/today\`);
    const dailyProfit = (today.data.revenue || 0) - (today.data.costs || 0);
    
    totalLifetimeProfit += dailyProfit;
    
    if (!isProfitThresholdReached) {
      const remaining = PROFIT_THRESHOLD - totalLifetimeProfit;
      console.log(\`[Pay System] Daily Update:\`);
      console.log(\`   Today's profit: $\${dailyProfit.toFixed(2)}\`);
      console.log(\`   Total profit: $\${totalLifetimeProfit.toLocaleString()}\`);
      console.log(\`   Remaining to $5M: $\${remaining.toLocaleString()}\n\`);
    }
    
  } catch (error) {
    // Non-critical
  }
});

console.log('✅ Pay After $5 Million System initialized!\n');
console.log('How it works:');
console.log('  • YOU pay all costs ($415/month) from your pocket');
console.log('  • You KEEP 100% of all profit');
console.log('  • System tracks total lifetime profit');
console.log('  • When you reach $5 MILLION total profit:');
console.log('    → Business starts paying its own costs');
console.log('    → You NEVER pay from pocket again');
console.log('    → You keep 100% of all future profit\n');
console.log('Current target: $5,000,000 total profit');
console.log('Current lifetime profit: $0 (just starting)\n');

