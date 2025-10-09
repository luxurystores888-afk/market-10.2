#!/usr/bin/env node

/**
 * 🆓 SETUP FREE PUSH NOTIFICATIONS
 * 
 * OneSignal: Unlimited push notifications FREE!
 */

import fs from 'fs';

console.log('🆓 Setting up FREE push notifications (OneSignal)...\n');

// Create OneSignal configuration
const oneSignalConfig = {
  appId: 'YOUR_ONESIGNAL_APP_ID',
  safariWebId: 'YOUR_SAFARI_WEB_ID',
  notifyButton: {
    enable: true,
    size: 'medium',
    theme: 'default',
    position: 'bottom-right',
    prenotify: true,
    showCredit: false,
    text: {
      'tip.state.unsubscribed': 'Get instant updates!',
      'tip.state.subscribed': "You're subscribed!",
      'tip.state.blocked': 'Unblock notifications',
      'message.prenotify': 'Click to subscribe to notifications',
      'message.action.subscribed': 'Thanks for subscribing!',
      'message.action.resubscribed': 'You\'re subscribed!',
      'message.action.unsubscribed': 'You won\'t receive notifications again',
      'dialog.main.title': 'Manage Site Notifications',
      'dialog.main.button.subscribe': 'SUBSCRIBE',
      'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
      'dialog.blocked.title': 'Unblock Notifications',
      'dialog.blocked.message': 'Follow these instructions to allow notifications:'
    }
  },
  welcomeNotification: {
    title: 'Thanks for subscribing!',
    message: 'You\'ll get updates about sales, new products, and exclusive deals!',
    url: ''
  },
  promptOptions: {
    actionMessage: 'We\'d like to show you notifications for sales and exclusive deals.',
    acceptButtonText: 'ALLOW',
    cancelButtonText: 'NO THANKS'
  }
};

fs.writeFileSync('public/onesignal-config.json', JSON.stringify(oneSignalConfig, null, 2));

// Add OneSignal script to index.html
let indexHTML = fs.readFileSync('index.html', 'utf8');

const oneSignalScript = `
<!-- OneSignal Push Notifications (FREE) -->
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
<script>
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(function(OneSignal) {
    OneSignal.init({
      appId: "YOUR_ONESIGNAL_APP_ID",
      notifyButton: {
        enable: true,
      },
      welcomeNotification: {
        title: "Thanks for subscribing!",
        message: "You'll get exclusive deals and updates!",
      }
    });
  });
</script>
`;

if (!indexHTML.includes('OneSignal')) {
  indexHTML = indexHTML.replace('</head>', oneSignalScript + '\n</head>');
  fs.writeFileSync('index.html', indexHTML);
}

// Update .env
let envContent = fs.readFileSync('.env', 'utf8');
envContent += `
# 🆓 FREE PUSH NOTIFICATIONS (OneSignal)
# https://onesignal.com (FREE unlimited)
ONESIGNAL_APP_ID=""
ONESIGNAL_API_KEY=""

# Get FREE account:
# 1. Visit: https://onesignal.com/pricing (FREE plan)
# 2. Create app
# 3. Copy App ID
# 4. Add above

`;

fs.writeFileSync('.env', envContent);

console.log('✅ OneSignal configured!\n');
console.log('📱 OneSignal FREE Plan:');
console.log('  ✅ UNLIMITED push notifications');
console.log('  ✅ UNLIMITED subscribers');
console.log('  ✅ Advanced targeting');
console.log('  ✅ Automation & scheduling');
console.log('  ✅ Analytics\n');

console.log('📝 Setup (5 minutes):');
console.log('   1. Visit: https://onesignal.com');
console.log('   2. Create FREE account');
console.log('   3. Create new app (Web)');
console.log('   4. Copy App ID');
console.log('   5. Paste in .env file\n');

console.log('💡 Use Cases:');
console.log('   → Flash sale alerts (instant notifications!)');
console.log('   → Abandoned cart reminders');
console.log('   → New product announcements');
console.log('   → Back-in-stock alerts');
console.log('   → Exclusive deals for subscribers\n');

console.log('📈 Expected Impact:');
console.log('   → 60% re-engagement rate');
console.log('   → 10-20% of visitors subscribe');
console.log('   → 1,000 visitors = 100-200 subscribers');
console.log('   → Push notification = 30% open rate');
console.log('   → Drive 30-60 visitors back per notification\n');

