#!/usr/bin/env node

/**
 * 🆓 SETUP FREE DATABASE (Supabase)
 * 
 * Supabase FREE tier:
 * - 500MB database
 * - Unlimited API requests
 * - 50,000 monthly active users
 * - 2GB file storage
 * - FREE forever!
 */

import fs from 'fs';

console.log('🆓 Setting up FREE Supabase database...\n');

console.log('Supabase FREE Tier Includes:');
console.log('  ✅ 500MB PostgreSQL database');
console.log('  ✅ Unlimited API requests');
console.log('  ✅ 50,000 monthly active users');
console.log('  ✅ 2GB file storage');
console.log('  ✅ Auth & real-time subscriptions');
console.log('  ✅ Auto-generated APIs\n');

// Update .env with Supabase instructions
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch {
  envContent = '';
}

envContent += `
# 🆓 FREE DATABASE (Supabase)
# Get FREE at: https://supabase.com/dashboard/sign-up
# 1. Create account (FREE)
# 2. Create project
# 3. Copy connection string from Settings → Database
# 4. Paste below:

DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
SUPABASE_URL="https://[project].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Alternative FREE databases:
# - Neon: https://neon.tech (FREE tier)
# - Railway: https://railway.app (FREE $5/month credit)
# - ElephantSQL: https://elephantsql.com (FREE 20MB)

`;

fs.writeFileSync('.env', envContent);

console.log('✅ Supabase configuration added to .env\n');
console.log('📝 TO ACTIVATE (5 minutes):');
console.log('   1. Visit: https://supabase.com');
console.log('   2. Sign up (FREE)');
console.log('   3. Create new project');
console.log('   4. Copy connection string');
console.log('   5. Paste in .env file');
console.log('   6. Run: npm run db:push\n');
console.log('✅ FREE database ready!\n');

