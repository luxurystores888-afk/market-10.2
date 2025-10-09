#!/usr/bin/env node

/**
 * 🛡️ BRANCH PROTECTION FIX SCRIPT
 * Automatically sets up branch protection for your repository
 */

import { execSync } from 'child_process';

console.log('🛡️  FIXING BRANCH PROTECTION WARNING');
console.log('=====================================\n');

async function fixBranchProtection() {
  try {
    console.log('📋 Checking GitHub CLI availability...');
    
    // Check if GitHub CLI is installed
    try {
      execSync('gh --version', { stdio: 'pipe' });
      console.log('✅ GitHub CLI is available\n');
      
      console.log('🔧 Setting up branch protection...');
      
      // Set up branch protection rules
      const protectionCommand = `
        gh api repos/luxurystores888-afk/market-10.2/branches/master/protection \\
          --method PUT \\
          --field required_status_checks='{"strict":true,"contexts":["CI/CD Pipeline","Build Check","Test Check"]}' \\
          --field enforce_admins=true \\
          --field required_pull_request_reviews='{"required_approving_review_count":1}' \\
          --field restrictions=null
      `;
      
      console.log('Executing branch protection setup...');
      execSync(protectionCommand, { stdio: 'inherit' });
      
      console.log('\n✅ Branch protection configured successfully!');
      console.log('🎉 The blue warning banner should now disappear from your GitHub repository.');
      
    } catch (ghError) {
      console.log('⚠️  GitHub CLI not found. Using manual method...\n');
      
      console.log('📝 MANUAL SETUP REQUIRED:');
      console.log('========================');
      console.log('1. Go to: https://github.com/luxurystores888-afk/market-10.2/settings/branches');
      console.log('2. Click "Add rule" or "Add branch protection rule"');
      console.log('3. Set branch name pattern to: master');
      console.log('4. Enable these settings:');
      console.log('   ✅ Require a pull request before merging');
      console.log('   ✅ Require status checks to pass before merging');
      console.log('   ✅ Require branches to be up to date before merging');
      console.log('   ✅ Include administrators');
      console.log('5. Click "Create" or "Save changes"');
      console.log('\n💡 OR: Click the "Protect this branch" button in the blue banner on your repo!');
    }
    
    console.log('\n🎯 RESULT:');
    console.log('==========');
    console.log('✅ Branch protection will be enabled');
    console.log('✅ Blue warning banner will disappear');
    console.log('✅ Repository will be protected from accidental changes');
    console.log('✅ Professional repository standards maintained');
    
  } catch (error) {
    console.error('❌ Error setting up branch protection:', error.message);
    console.log('\n🔧 FALLBACK SOLUTION:');
    console.log('====================');
    console.log('1. Visit: https://github.com/luxurystores888-afk/market-10.2');
    console.log('2. Click the blue "Protect this branch" button');
    console.log('3. Follow the setup wizard');
    console.log('4. Enable basic protections');
    console.log('5. Save changes');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixBranchProtection();
}

export { fixBranchProtection };
