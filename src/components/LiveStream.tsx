import React from 'react';
import { AdaptiveVideo } from '../components/AdaptiveVideo';

export const LiveStream: React.FC = () => {
  return (
    <div>
      <h3>Live Product Demo</h3>
      {/* Integrate real streaming like WebRTC or external service */}
      <AdaptiveVideo src="placeholder-hls.m3u8" />
    </div>
  );
};
