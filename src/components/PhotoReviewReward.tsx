import React, { useState } from 'react';

export const PhotoReviewReward: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setRewarded(true);
    }
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
      <h2 style={{ color: '#00d084', marginBottom: 12 }}>📸 Photo Review Reward</h2>
      <p style={{ marginBottom: 16 }}>
        Upload a photo with your review and get bonus points or a special badge!
      </p>
      <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginBottom: 12 }} />
      {rewarded && (
        <div style={{ color: '#ffb300', fontWeight: 'bold', marginTop: 12 }}>
          🎉 Thank you! You earned a reward for your photo review.
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: 14, color: '#aaa' }}>
        (Connect to backend to store photos and assign real rewards)
      </div>
    </div>
  );
};
