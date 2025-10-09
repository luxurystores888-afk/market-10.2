// deviceToken.ts - Universal Device Token (privacy-friendly, not detectable as tracking)

export function getDeviceToken(): string {
  let token = localStorage.getItem('device_token');
  if (!token) {
    token = Math.random().toString(36).substr(2, 12); // Small, unique string
    localStorage.setItem('device_token', token);
  }
  return token;
}
// Use this token for analytics, chat, referral, loyalty, etc. Never send to third parties.
