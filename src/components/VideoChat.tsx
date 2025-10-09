import React, { useRef, useEffect } from 'react';

export const VideoChat: React.FC = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideo.current!.srcObject = stream;
      // Simulate peer connection for remote
    });
  }, []);

  return (
    <div>
      <video ref={localVideo} autoPlay playsInline muted />
      <video ref={remoteVideo} autoPlay playsInline />
    </div>
  );
};
