import React from 'react';

const BADGES = [
  { key: 'first_purchase', label: 'First Purchase', icon: '🛒' },
  { key: 'first_referral', label: 'First Referral', icon: '🤝' },
  { key: 'reviewer', label: 'Reviewer', icon: '⭐' },
  { key: 'loyal_customer', label: 'Loyal Customer', icon: '💎' },
];

function getEarnedBadges() {
  // For demo, return all badges. In real app, fetch from backend or user profile.
  return BADGES;
}

export const AchievementBadges: React.FC = () => {
  const earned = getEarnedBadges();
  return (
    <div style={{
      background: '#23272f',
      color: '#fff',
      padding: 24,
      borderRadius: 16,
      textAlign: 'center',
      margin: '24px auto',
      maxWidth: 400,
      boxShadow: '0 4px 24px #0004',
    }}>
      <h2 style={{ color: '#ffb300', marginBottom: 12 }}>🏅 Achievement Badges</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {earned.map(badge => (
          <div key={badge.key} style={{ textAlign: 'center', margin: 8 }}>
            <span style={{ fontSize: 36 }}>{badge.icon}</span>
            <div style={{ fontSize: 14, color: '#00d084', marginTop: 4 }}>{badge.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 14, color: '#aaa' }}>
        (Earn badges for purchases, referrals, reviews, and more!)
      </div>
    </div>
  );
};
