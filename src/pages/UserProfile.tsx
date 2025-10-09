import React from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import AffiliateInviter from '../components/AffiliateInviter';
import BillionSimulator from '../components/BillionSimulator';
import AscensionPath from '../components/AscensionPath';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <LoyaltyDashboard points={user.points} />
      <AffiliateInviter />
      <BillionSimulator />
      <AscensionPath />
    </div>
  );
};

export default UserProfile;
