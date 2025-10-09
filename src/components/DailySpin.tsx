import React, { useState } from 'react';

const REWARDS = [
  { label: '5% Discount', value: 'discount5' },
  { label: 'Free Shipping', value: 'freeShipping' },
  { label: '10 Loyalty Points', value: 'points10' },
  { label: 'No Win, Try Again!', value: 'none' },
  { label: '10% Discount', value: 'discount10' },
  { label: 'Mystery Gift', value: 'mystery' },
];

function getTodayKey() {
  const today = new Date();
  return `spin_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

export const DailySpin: React.FC = () => {
  const [spun, setSpun] = useState(!!localStorage.getItem(getTodayKey()));
  const [result, setResult] = useState<string | null>(localStorage.getItem(getTodayKey()));
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      const reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      setResult(reward.label);
      setSpun(true);
      localStorage.setItem(getTodayKey(), reward.label);
      setSpinning(false);
    }, 1500);
  };

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
      <h2 style={{ color: '#00d084', marginBottom: 12 }}>🎁 Daily Spin & Win</h2>
      <p style={{ marginBottom: 16 }}>
        Spin the wheel once a day for a chance to win discounts, points, and more!
      </p>
      <button
        onClick={handleSpin}
        disabled={spun || spinning}
        style={{
          background: spun ? '#888' : '#ff0080',
          color: '#fff',
          padding: '12px 32px',
          borderRadius: 8,
          fontWeight: 'bold',
          fontSize: 18,
          cursor: spun ? 'not-allowed' : 'pointer',
          marginBottom: 16,
        }}
      >
        {spinning ? 'Spinning...' : spun ? 'Come Back Tomorrow!' : '🎯 Spin Now'}
      </button>
      {result && (
        <div style={{ marginTop: 20, fontSize: 20, color: '#00d084' }}>
          <strong>Result:</strong> {result}
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: 14, color: '#aaa' }}>
        (One spin per day. Rewards are for demo—connect to backend for real prizes!)
      </div>
    </div>
  );
};
