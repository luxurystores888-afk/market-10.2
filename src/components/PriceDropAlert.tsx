import React, { useState } from 'react';

interface PriceDropAlertProps {
  productId: string;
  productName: string;
}

export const PriceDropAlert: React.FC<PriceDropAlertProps> = ({ productId, productName }) => {
  const [subscribed, setSubscribed] = useState(
    !!localStorage.getItem(`price_alert_${productId}`)
  );

  const handleSubscribe = async () => {
    localStorage.setItem(`price_alert_${productId}`, '1');
    setSubscribed(true);
    try {
      // Optional: if user is authenticated, persist server-side with a sensible default threshold
      await fetch('/api/alerts/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, threshold: 999999 }) // overwritten later by user threshold on details page
      });
    } catch {}
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`You'll be notified when the price drops for ${productName}`);
    }
  };

  return (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      {subscribed ? (
        <span style={{ color: '#00d084', fontWeight: 'bold' }}>
          ✅ Subscribed for price drop alerts!
        </span>
      ) : (
        <button
          onClick={handleSubscribe}
          style={{
            background: '#00d084',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔔 Notify Me on Price Drop
        </button>
      )}
      <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>
        (For demo: uses browser notifications. For real alerts, connect to backend/email.)
      </div>
    </div>
  );
};
