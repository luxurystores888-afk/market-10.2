import React from 'react';

interface QuickShareButtonsProps {
  productName: string;
  productUrl: string;
}

export const QuickShareButtons: React.FC<QuickShareButtonsProps> = ({ productName, productUrl }) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this product: ${productName} ${productUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out this product: ${productName}`)}`;

  return (
    <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#25D366',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: 8,
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        🟢 Share on WhatsApp
      </a>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#0088cc',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: 8,
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        🔵 Share on Telegram
      </a>
    </div>
  );
};
