#!/usr/bin/env node

/**
 * 🆓 SETUP FREE ANALYTICS
 * 
 * Google Analytics 4 (FREE forever)
 * + Matomo (FREE self-hosted)
 * + Microsoft Clarity (FREE)
 */

import fs from 'fs';

console.log('🆓 Setting up FREE analytics...\n');

// Create analytics integration
const analyticsCode = `
<!-- Google Analytics 4 (FREE) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Microsoft Clarity (FREE - Better than Hotjar!) -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>

<!-- Plausible Analytics (FREE if self-hosted) -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
`;

// Add to index.html
let indexHTML = fs.readFileSync('index.html', 'utf8');

if (!indexHTML.includes('gtag')) {
  indexHTML = indexHTML.replace('</head>', analyticsCode + '\n</head>');
  fs.writeFileSync('index.html', indexHTML);
  console.log('✅ Analytics code added to index.html\n');
}

// Update .env
let envContent = fs.readFileSync('.env', 'utf8');
envContent += `
# 🆓 FREE ANALYTICS
# Google Analytics: https://analytics.google.com (FREE)
GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Microsoft Clarity: https://clarity.microsoft.com (FREE)
CLARITY_PROJECT_ID="YOUR_CLARITY_ID"

# Matomo (Self-hosted, FREE): https://matomo.org
MATOMO_URL="https://analytics.yoursite.com"
MATOMO_SITE_ID="1"

`;

fs.writeFileSync('.env', envContent);

console.log('📊 FREE Analytics Tools:');
console.log('  1. Google Analytics 4 (FREE)');
console.log('     → https://analytics.google.com');
console.log('     → Create account → Get Measurement ID');
console.log('');
console.log('  2. Microsoft Clarity (FREE - Better heatmaps!)');
console.log('     → https://clarity.microsoft.com');
console.log('     → Add website → Get Project ID');
console.log('');
console.log('  3. Matomo (FREE if self-hosted)');
console.log('     → https://matomo.org/download');
console.log('     → Self-host or use free cloud trial');
console.log('');
console.log('✅ All analytics configured!\n');

