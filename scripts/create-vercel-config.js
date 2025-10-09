#!/usr/bin/env node

/**
 * 🆓 CREATE FREE VERCEL DEPLOYMENT CONFIG
 * 
 * Vercel FREE tier:
 * - Unlimited deployments
 * - 100GB bandwidth/month
 * - Serverless functions
 * - Global CDN
 * - Auto SSL
 * - FREE forever!
 */

import fs from 'fs';

console.log('🆓 Creating FREE Vercel deployment config...\n');

// Create vercel.json
const vercelConfig = {
  version: 2,
  builds: [
    {
      src: "package.json",
      use: "@vercel/node"
    }
  ],
  routes: [
    {
      src: "/api/(.*)",
      dest: "/api/index.ts"
    },
    {
      src: "/(.*)",
      dest: "/$1"
    }
  ],
  env: {
    NODE_ENV: "production"
  },
  regions: ["iad1"], // Free tier: Single region (US East)
  functions: {
    "api/**/*.ts": {
      memory: 1024,
      maxDuration: 10
    }
  }
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

// Create .vercelignore
const vercelIgnore = `
node_modules
.git
.env.local
*.log
.DS_Store
`;

fs.writeFileSync('.vercelignore', vercelIgnore.trim());

console.log('✅ Vercel configuration created!\n');
console.log('📦 Vercel FREE Tier Includes:');
console.log('  ✅ Unlimited deployments');
console.log('  ✅ 100GB bandwidth/month');
console.log('  ✅ Serverless functions');
console.log('  ✅ Global CDN (fast worldwide!)');
console.log('  ✅ Automatic SSL (HTTPS)');
console.log('  ✅ Preview deployments');
console.log('  ✅ Git integration\n');

console.log('🚀 TO DEPLOY (2 minutes):');
console.log('   1. Install Vercel CLI: npm install -g vercel');
console.log('   2. Run: vercel');
console.log('   3. Follow prompts (just press Enter)');
console.log('   4. Get live URL: yoursite.vercel.app');
console.log('   5. Done - website is LIVE!\n');

console.log('🌍 Your site will be:');
console.log('   → Live on internet');
console.log('   → Fast globally (CDN)');
console.log('   → Secure (HTTPS)');
console.log('   → Auto-deploys on git push\n');

console.log('💰 Cost: $0/month (FREE forever!)\n');
console.log('📈 Handles: 100,000+ visitors/month on free tier!\n');

// Create README for deployment
const deploymentREADME = `
# 🚀 FREE DEPLOYMENT GUIDE

## Deploy to Vercel (RECOMMENDED - FREE!)

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to GitHub? Yes
# - Project name? [press Enter]
# - Directory? [press Enter]
# - Override settings? No

# Done! Get URL like: yoursite.vercel.app
\`\`\`

## Alternative FREE Hosting:

### Netlify (FREE):
\`\`\`bash
npm install -g netlify-cli
netlify deploy --prod
\`\`\`

### Railway (FREE $5/month credit):
\`\`\`bash
# Visit: https://railway.app
# Connect GitHub
# Deploy automatically
\`\`\`

### Render (FREE):
\`\`\`bash
# Visit: https://render.com
# Connect GitHub
# Auto-deploy on push
\`\`\`

All options are 100% FREE and production-ready!
`;

fs.writeFileSync('DEPLOYMENT_FREE.md', deploymentREADME);

console.log('✅ Deployment guide created: DEPLOYMENT_FREE.md\n');

