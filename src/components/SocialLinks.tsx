import React from 'react';

const LINKS = [
  { name: 'Facebook', url: 'https://facebook.com/yourpage', icon: '📘' },
  { name: 'Instagram', url: 'https://instagram.com/yourpage', icon: '📸' },
  { name: 'Twitter', url: 'https://twitter.com/yourpage', icon: '🐦' },
  { name: 'Telegram Chat', url: 'https://t.me/yourchat', icon: '💬' },
  { name: 'Customer Chat Room', url: '#', icon: '🗨️' },
];

export const SocialLinks: React.FC = () => (
  <div style={{
    background: '#23272f',
    color: '#fff',
    padding: 24,
    borderRadius: 16,
    margin: '24px auto',
    maxWidth: 500,
    textAlign: 'center',
    boxShadow: '0 4px 24px #0004',
  }}>
    <h2 style={{ color: '#00bcd4', marginBottom: 16 }}>🌐 Join Our Community</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
      {LINKS.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#00d084',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: 18,
            margin: 4,
          }}
        >
          {link.icon} {link.name}
        </a>
      ))}
    </div>
    <div style={{ fontSize: 14, color: '#aaa', marginTop: 12 }}>
      (Update your social/chat links in the LINKS array above)
    </div>
  </div>
);
