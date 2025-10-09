import React, { useEffect, useState } from 'react';

export const SocialProof: React.FC = () => {
  const [recentPurchases, setRecentPurchases] = useState<number | null>(null);
  const [viewingNow, setViewingNow] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/analytics/recent-purchases')
        .then(res => res.json())
        .then(data => {
          setRecentPurchases(data.purchasesLastHour || 0);
          setViewingNow(data.viewingNow || 0);
        });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#23272f',
      color: '#00d084',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      margin: '16px 0',
      textAlign: 'center',
      fontSize: '1.1em',
    }}>
      {recentPurchases !== null && (
        <span>🔥 {recentPurchases} people bought this in the last hour</span>
      )}
      {viewingNow !== null && (
        <span style={{ marginLeft: 16 }}>👀 {viewingNow} viewing now</span>
      )}
    </div>
  );
};
