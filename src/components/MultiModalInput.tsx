import React from 'react';
import { VoiceControl } from './VoiceControl';
import { GestureControl } from './GestureControl';
import { EyeTracking } from './EyeTracking';

export const MultiModalInput: React.FC = () => {
  return (
    <div>
      <VoiceControl />
      <GestureControl />
      <EyeTracking />
    </div>
  );
};
