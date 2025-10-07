import React from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import AffiliateInviter from '../components/AffiliateInviter';
import BillionSimulator from '../components/BillionSimulator';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <LoyaltyDashboard points={user.points} />
      <AffiliateInviter />
      <BillionSimulator />
    </div>
  );
};

export default UserProfile;
