import React from 'react';

const ViralMultiplier = () => {
  return (
    <div>
      Multiply Your Actions
      <button onClick={() => fetch('/api/community/replicate')}>Replicate</button>
    </div>
  );
};

export default ViralMultiplier;
