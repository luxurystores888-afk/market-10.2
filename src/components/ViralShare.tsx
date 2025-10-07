// Viral Share component (free)
import React from 'react';

const ViralShare = () => {
  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Billion Launch on PULSE',
        text: 'Join for free riches!',
        url: window.location.href
      });
    } else {
      console.log('Share not supported');
    }
  };

  return <button onClick={share}>Share for Billions</button>;
};

export default ViralShare;
