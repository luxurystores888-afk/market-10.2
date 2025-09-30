// loyaltyPoints.ts - Simple Loyalty Points System (localStorage-based) with device token
import { getDeviceToken } from '../utils/deviceToken';

const POINTS_KEY = 'loyalty_points';

export function getLoyaltyPoints(): number {
  // Optionally, use deviceToken as part of the key for per-device points
  // const key = `${POINTS_KEY}_${getDeviceToken()}`;
  return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10);
}

export function addLoyaltyPoints(amount: number) {
  const current = getLoyaltyPoints();
  localStorage.setItem(POINTS_KEY, String(current + amount));
  // Optionally, log with deviceToken for analytics
  console.log('[Loyalty] Add', { amount, deviceToken: getDeviceToken() });
}

export function redeemLoyaltyPoints(amount: number): boolean {
  const current = getLoyaltyPoints();
  if (current >= amount) {
    localStorage.setItem(POINTS_KEY, String(current - amount));
    console.log('[Loyalty] Redeem', { amount, deviceToken: getDeviceToken() });
    return true;
  }
  return false;
}

// For real apps, connect to backend for secure points management and use deviceToken for user/device identification.
