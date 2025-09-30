// analytics.ts - Analytics with device token integration
import { getDeviceToken } from '../utils/deviceToken';

export async function sendAnalyticsEvent(eventName: string, data: any = {}) {
  const payload = {
    ...data,
    deviceToken: getDeviceToken(),
    timestamp: new Date().toISOString(),
  };
  await trackEvent({ ...payload, eventName });
  console.log('[Analytics]', eventName, payload);
}

async function trackEvent(eventData) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Analytics track error:', error);
  }
}
