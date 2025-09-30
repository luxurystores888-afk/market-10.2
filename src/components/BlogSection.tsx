import React, { useState } from 'react';

// Demo blog posts; replace with Markdown/JSON or backend fetch later
const POSTS = [
  {
    id: 1,
    title: 'Welcome to Our Store!',
    date: '2025-09-29',
    summary: 'Discover the latest features and viral growth hacks in our e-commerce platform.',
    content: 'We have launched a new set of viral, gamified, and automated features to help you get the most out of your shopping experience. Stay tuned for more updates!'
  },
  {
    id: 2,
    title: 'How to Earn Loyalty Points',
    date: '2025-09-28',
    summary: 'Learn how to maximize your rewards with our free loyalty program.',
    content: 'Every purchase, referral, and review earns you points. Redeem them for discounts, gifts, and more!'
  },
];

export const BlogSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <div style={{
      background: '#23272f',
      color: '#fff',
      padding: 24,
      borderRadius: 16,
      margin: '24px auto',
      maxWidth: 700,
      boxShadow: '0 4px 24px #0004',
    }}>
      <h2 style={{ color: '#00d084', marginBottom: 16 }}>📝 Blog</h2>
      {POSTS.map(post => (
        <div key={post.id} style={{ marginBottom: 24, borderBottom: '1px solid #333', paddingBottom: 16 }}>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>{post.title}</div>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 6 }}>{post.date}</div>
          <div style={{ marginBottom: 8 }}>{post.summary}</div>
          <button
            onClick={() => setOpenId(openId === post.id ? null : post.id)}
            style={{ background: '#00d084', color: '#fff', borderRadius: 8, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {openId === post.id ? 'Hide' : 'Read More'}
          </button>
          {openId === post.id && (
            <div style={{ marginTop: 12, color: '#fff' }}>{post.content}</div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 14, color: '#aaa' }}>
        (You can replace these posts with Markdown files or connect to a free CMS later)
      </div>
    </div>
  );
};
