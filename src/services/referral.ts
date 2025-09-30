// referral.ts - Referral tracking with device token
import { getDeviceToken } from '../utils/deviceToken';

export async function logReferralShare(refCode: string) {
  const payload = {
    refCode,
    deviceToken: getDeviceToken(),
    timestamp: new Date().toISOString(),
    event: 'share'
  };
  await trackReferral(payload);
  console.log('[Referral] Share', payload);
}

export async function logReferralRedemption(refCode: string) {
  const payload = {
    refCode,
    deviceToken: getDeviceToken(),
    timestamp: new Date().toISOString(),
    event: 'redemption'
  };
  await trackReferral(payload);
  console.log('[Referral] Redemption', payload);
}

async function trackReferral(referralData) {
  try {
    await fetch('/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(referralData),
    });
  } catch (error) {
    console.error('Referral track error:', error);
  }
}