import React, { useState } from 'react';

export const FreemiumToggle: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPremium(true)}>Upgrade to Premium</button>
      {isPremium ? 'Premium Features Unlocked' : 'Freemium Mode'}
    </div>
  );
};
