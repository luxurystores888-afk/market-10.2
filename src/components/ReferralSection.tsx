import React, { useState, useEffect } from 'react';

const ReferralSection = () => {
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    fetch('/api/auth/referral-code')
      .then(res => res.json())
      .then(data => setReferralCode(data.referralCode));
  }, []);

  const shareReferral = async () => {
    const shareData = {
      title: 'Join PULSE!',
      text: 'Use my referral code!',
      url: `${window.location.origin}?ref=${referralCode}`
    };
    if (navigator.share) {
      await navigator.share(shareData);
    }
  };

  return (
    <div>
      <h2>Your Referral Code: {referralCode}</h2>
      <button onClick={shareReferral}>Share</button>
    </div>
  );
};

export default ReferralSection;
