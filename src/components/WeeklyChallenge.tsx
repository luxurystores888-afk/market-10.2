import React, { useState, useEffect } from 'react';

const CHALLENGE_KEY = 'weekly_challenge_done';
const CHALLENGE = {
  id: 'week_2025_09_29',
  description: 'Share any product with 3 friends this week!'
};

export const WeeklyChallenge: React.FC = () => {
  const [done, setDone] = useState(localStorage.getItem(CHALLENGE_KEY) === CHALLENGE.id);

  const handleComplete = () => {
    localStorage.setItem(CHALLENGE_KEY, CHALLENGE.id);
    setDone(true);
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
      <h2 style={{ color: '#00bcd4', marginBottom: 12 }}>🏅 Weekly Challenge</h2>
      <p style={{ marginBottom: 16 }}>{CHALLENGE.description}</p>
      {done ? (
        <span style={{ color: '#00d084', fontWeight: 'bold', fontSize: 18 }}>
          ✅ Challenge Completed!
        </span>
      ) : (
        <button
          onClick={handleComplete}
          style={{
            background: '#00bcd4',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Mark as Done
        </button>
      )}
      <div style={{ marginTop: 12, fontSize: 14, color: '#aaa' }}>
        (Track real completion via backend for real rewards)
      </div>
    </div>
  );
};
