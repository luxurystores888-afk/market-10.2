import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    fetch('/api/auth/subscribe-newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  };

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default NewsletterSignup;
