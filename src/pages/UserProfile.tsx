import React from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <LoyaltyDashboard points={user.points} />
    </div>
  );
};

export default UserProfile;
