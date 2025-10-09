import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export const AdaptiveVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current!);
    }
  }, [src]);

  return <video ref={videoRef} controls />;
};
