import React from 'react';

export const ReferralProgram: React.FC = () => {
  const generateReferralLink = () => {
    return `${window.location.origin}?ref=${Math.random().toString(36).substring(7)}`;
  };

  // Add tier system
  const tiers = ['bronze', 'silver', 'gold'];

  return (
    <div>
      <p>Your Referral Link: {generateReferralLink()}</p>
      <p>Tiers: Bronze (5 refs) - 20% commission, etc.</p>
    </div>
  );
};
