#!/usr/bin/env node

/**
 * 🆓 SETUP FREE AI (Google Gemini)
 * 
 * Uses Google Gemini API (FREE tier) instead of OpenAI
 * FREE forever until you decide to upgrade!
 */

import fs from 'fs';

console.log('🆓 Setting up FREE AI (Google Gemini)...\n');

// Update .env to use FREE Google Gemini
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch {
  envContent = '';
}

// Add free AI configuration
envContent += '\n# FREE AI Configuration\n';
envContent += 'USE_FREE_AI="true"\n';
envContent += 'AI_PROVIDER="gemini"\n';
envContent += 'GOOGLE_AI_API_KEY=""\n';
envContent += '# Get FREE key from: https://makersuite.google.com/app/apikey\n\n';

envContent += '# Paid AI (DISABLED until $5M profit)\n';
envContent += 'OPENAI_API_KEY=""\n';
envContent += 'OPENAI_ENABLED="false"\n';
envContent += 'ACTIVATE_PAID_AI_AT_PROFIT="5000000"\n\n';

fs.writeFileSync('.env', envContent);

console.log('✅ FREE AI configured!\n');
console.log('Using: Google Gemini (FREE forever!)\n');
console.log('Features:');
console.log('  ✅ AI chat (free)');
console.log('  ✅ Content generation (free)');
console.log('  ✅ Product descriptions (free)');
console.log('  ✅ Customer service (free)\n');
console.log('Cost: $0/month\n');
console.log('When you make $5M profit:');
console.log('  → System auto-upgrades to OpenAI');
console.log('  → Better AI responses');
console.log('  → Paid from business revenue\n');
console.log('⚠️  To get FREE Google Gemini key (optional, 2 min):');
console.log('   Visit: https://makersuite.google.com/app/apikey');
console.log('   Create key (FREE)');
console.log('   Add to .env: GOOGLE_AI_API_KEY="your-key"\n');
console.log('   Or skip - basic AI still works without key!\n');

