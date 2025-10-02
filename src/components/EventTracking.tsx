import React from 'react';

export const EventTracking: React.FC = () => {
  const trackEvent = (eventName: string) => {
    console.log(`Tracked: ${eventName}`);
    // Send to analytics service
  };

  return <button onClick={() => trackEvent('button_click')}>Track Me</button>;
};
