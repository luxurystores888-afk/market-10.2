import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const subscribe = async () => {
    await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    setEmail('');
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
      <button onClick={subscribe}>Subscribe</button>
    </div>
  );
};

export default NewsletterSignup;
