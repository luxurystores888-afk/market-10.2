#!/usr/bin/env node

/**
 * 🆓 SETUP FREE EMAIL MARKETING
 * 
 * Mailchimp: 1,000 contacts FREE
 * SendGrid: 100 emails/day FREE
 * Gmail SMTP: 500 emails/day FREE
 */

import fs from 'fs';

console.log('🆓 Setting up FREE email marketing...\n');

let envContent = fs.readFileSync('.env', 'utf8');
envContent += `
# 🆓 FREE EMAIL SERVICES

# Option 1: Mailchimp (FREE - 1,000 contacts)
# https://mailchimp.com/pricing
MAILCHIMP_API_KEY=""
MAILCHIMP_LIST_ID=""

# Option 2: SendGrid (FREE - 100 emails/day)
# https://sendgrid.com/pricing
SENDGRID_API_KEY=""
SENDGRID_FROM_EMAIL="noreply@yoursite.com"

# Option 3: Gmail SMTP (FREE - 500 emails/day)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Option 4: Sendinblue (FREE - 300 emails/day)
# https://sendinblue.com
SENDINBLUE_API_KEY=""

# Choose ONE and add credentials above
USE_EMAIL_SERVICE="sendgrid"

`;

fs.writeFileSync('.env', envContent);

console.log('📧 FREE Email Services Available:\n');
console.log('1. Mailchimp (BEST for beginners)');
console.log('   FREE: 1,000 contacts');
console.log('   Setup: https://mailchimp.com\n');

console.log('2. SendGrid (BEST for developers)');
console.log('   FREE: 100 emails/day = 3,000/month');
console.log('   Setup: https://sendgrid.com\n');

console.log('3. Gmail SMTP (EASIEST)');
console.log('   FREE: 500 emails/day');
console.log('   Setup: Use your Gmail + App Password\n');

console.log('4. Sendinblue (BEST free tier)');
console.log('   FREE: 300 emails/day = 9,000/month');
console.log('   Setup: https://sendinblue.com\n');

console.log('✅ Email configuration ready!\n');
console.log('Choose one service and add API key to .env\n');

// Create email templates
const emailTemplates = {
  welcome: `
    Subject: Welcome to Our Store! Here's 10% OFF 🎁
    
    Hi {{firstName}},
    
    Welcome! We're excited to have you!
    
    Here's 10% OFF your first order:
    Code: WELCOME10
    
    Shop now: {{storeUrl}}
    
    Questions? Just reply to this email!
    
    Best,
    {{storeName}}
  `,
  
  abandonedCart: `
    Subject: You left something behind! 🛒
    
    Hi {{firstName}},
    
    You left {{itemCount}} items in your cart worth ${{cartValue}}.
    
    Complete your order now and get 10% OFF!
    Code: CART10
    
    {{cartUrl}}
    
    Hurry! Items selling fast!
  `,
  
  orderConfirmation: `
    Subject: Order Confirmed! #{{orderNumber}} ✅
    
    Thanks for your order!
    
    Order: #{{orderNumber}}
    Total: ${{total}}
    
    Track your order: {{trackingUrl}}
    
    Expected delivery: {{deliveryDate}}
    
    We're on it! 🚀
  `
};

fs.writeFileSync('email-templates.json', JSON.stringify(emailTemplates, null, 2));

console.log('✅ Email templates created!\n');

