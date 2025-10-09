import React, { useEffect } from 'react';
import * as handTrack from 'handtrackjs';

export const GestureControl: React.FC = () => {
  useEffect(() => {
    const video = document.createElement('video');
    // @ts-ignore - handtrackjs has typing issues
    handTrack.startVideo(video).then(() => {
      // Detection logic for gestures like swipe
    });
  }, []);

  return <div>Gesture Control Active</div>;
};
