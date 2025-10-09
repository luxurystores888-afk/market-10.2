import React, { useState, useEffect } from 'react';

const AffiliateDashboard = () => {
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    fetch('/api/analytics/affiliate-earnings')
      .then(res => res.json())
      .then(data => setEarnings(data.earnings));
  }, []);

  return (
    <div>
      <h3>Your Earnings: ${earnings}</h3>
    </div>
  );
};

export default AffiliateDashboard;
