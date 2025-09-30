import React, { useState, useEffect } from 'react';

const ReferralShare: React.FC = () => {
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const res = await fetch('/api/user/referral-code');
        if (res.ok) {
          const data = await res.json();
          setReferralCode(data.code);
        } else {
          // Fallback to local generation
          const userId = localStorage.getItem('userId') || 'guest-' + Math.random().toString(36).substr(2, 9);
          setReferralCode(btoa(userId).slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching referral code:', error);
        const userId = localStorage.getItem('userId') || 'guest-' + Math.random().toString(36).substr(2, 9);
        setReferralCode(btoa(userId).slice(0, 8));
      }
    };
    fetchReferralCode();
  }, []);

  const handleShare = async () => {
    // Use referralCode in share logic
    try {
      // Lightweight frontend analytics
      window.dispatchEvent(new CustomEvent('cybermart-analytics', {
        detail: { event: 'referral_share_click', refCode: referralCode }
      }));
      // Optional backend event (non-blocking)
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName: 'referral_share_click', properties: { refCode: referralCode } })
      }).catch(() => {});
    } catch {}
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Get $10 Off Cyber Mart 2077!',
          text: 'Shop futuristic deals & get $10 off with my link.',
          url: `${window.location.origin}/?ref=${referralCode}`,
        });
        // Confirm share
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventName: 'referral_share_success', properties: { refCode: referralCode } })
        }).catch(() => {});
      } catch (err) {
        // Optionally handle share cancellation or errors
      }
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        background: '#00d084',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '16px 0',
      }}
    >
      🚀 Share & Earn
    </button>
  );
};
