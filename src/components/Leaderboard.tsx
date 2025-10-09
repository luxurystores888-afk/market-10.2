import React, { useEffect, useState } from 'react';

// Mock data for demo; replace with backend fetch
const MOCK_LEADERBOARD = [
  { name: 'Alice', points: 120 },
  { name: 'Bob', points: 110 },
  { name: 'Charlie', points: 100 },
  { name: 'Dina', points: 90 },
  { name: 'Eve', points: 80 },
];

export const Leaderboard: React.FC = () => {
  const [data, setData] = useState(MOCK_LEADERBOARD);

  // Example: fetch from backend
  // useEffect(() => {
  //   fetch('/api/leaderboard')
  //     .then(res => res.json())
  //     .then(setData);
  // }, []);

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
      <h2 style={{ color: '#ffb300', marginBottom: 12 }}>🏆 Weekly Leaderboard</h2>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {data.map((user, idx) => (
          <li
            key={user.name}
            style={{
              background: idx < 3 ? '#00d084' : '#333',
              color: idx < 3 ? '#23272f' : '#fff',
              fontWeight: idx < 3 ? 'bold' : 'normal',
              borderRadius: 8,
              margin: '8px 0',
              padding: '8px 0',
              fontSize: 18,
            }}
          >
            {idx + 1}. {user.name} — {user.points} pts
          </li>
        ))}
      </ol>
      <div style={{ marginTop: 12, fontSize: 14, color: '#aaa' }}>
        (Top users by purchases, referrals, or points. Connect to backend for live data!)
      </div>
    </div>
  );
};
