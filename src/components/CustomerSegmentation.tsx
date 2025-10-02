import React from 'react';

export const CustomerSegmentation: React.FC = () => {
  // Simple segmentation
  const segments = ['High-value: 30%', 'New users: 40%'];
  return <ul>{segments.map(s => <li key={s}>{s}</li>)}</ul>;
};
