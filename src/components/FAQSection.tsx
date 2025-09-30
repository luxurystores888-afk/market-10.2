import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How do I earn loyalty points?',
    a: 'You earn points for every purchase, referral, and review. Points can be redeemed for discounts and gifts.'
  },
  {
    q: 'How can I join the daily spin?',
    a: 'Just visit the homepage and spin the wheel once per day for a chance to win rewards!'
  },
  {
    q: 'How do I get notified about price drops?',
    a: 'Click the "Notify Me on Price Drop" button on any product page to subscribe for free alerts.'
  },
  {
    q: 'Is my data safe?',
    a: 'Yes! We use privacy-friendly device tokens and never share your data with third parties.'
  },
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
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
      <h2 style={{ color: '#00bcd4', marginBottom: 16 }}>❓ Frequently Asked Questions</h2>
      {FAQS.map((faq, idx) => (
        <div key={idx} style={{ marginBottom: 18, borderBottom: '1px solid #333', paddingBottom: 10 }}>
          <div
            style={{ fontWeight: 'bold', fontSize: 17, cursor: 'pointer', color: '#00d084' }}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            {faq.q}
          </div>
          {openIdx === idx && (
            <div style={{ marginTop: 8, color: '#fff', fontSize: 15 }}>{faq.a}</div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 14, color: '#aaa' }}>
        (You can expand this FAQ or fetch questions from a backend or Markdown file later)
      </div>
    </div>
  );
};
