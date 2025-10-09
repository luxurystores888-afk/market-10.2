import React, { useState } from 'react';

export const ABTesting: React.FC<{ variants: string[] }> = ({ variants }) => {
  const [currentVariant, setCurrentVariant] = useState(variants[0]);
  const [stats, setStats] = useState({ A: 0, B: 0 });

  const trackClick = (variant: string) => {
    setStats(prev => ({ ...prev, [variant]: prev[variant] + 1 }));
  };

  return (
    <div>
      <p>Current Variant: {currentVariant}</p>
      <button onClick={() => trackClick('A')}>Test A</button>
      <button onClick={() => trackClick('B')}>Test B</button>
      <p>Stats: A: {stats.A}, B: {stats.B}</p>
    </div>
  );
};
