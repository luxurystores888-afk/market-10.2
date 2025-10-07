import React, { useState, useEffect } from 'react';
import { ReferralShare } from './ReferralShare';

export function AffiliateMarketing() {
  const [link, setLink] = useState('');
  const [earnings, setEarnings] = useState(0);
  useEffect(() => {
    // Fetch affiliate data from /api/affiliate
    fetch('/api/affiliate/link').then(res => res.json()).then(data => setLink(data.link));
    // Similarly for earnings
    fetch('/api/affiliate/earnings').then(res => res.json()).then(data => setEarnings(data.earnings));
  }, []);
  return (
    <div className="affiliate-dashboard">
      <h2>Affiliate Dashboard</h2>
      <p>Your Link: {link}</p>
      <p>Earnings: ${earnings}</p>
      <ReferralShare />
    </div>
  );
}
