import React, { useEffect, useState } from 'react';

export const EdgeCDN: React.FC = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    // Simulate edge fetch
    fetch('https://cdn.example.com/data').then(res => res.text()).then(setData);
  }, []);

  return <p>Edge Data: {data}</p>;
};
