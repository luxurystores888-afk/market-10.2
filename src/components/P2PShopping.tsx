import React, { useEffect, useRef } from 'react';

const P2PShopping = ({ peerId }) => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peer = new RTCPeerConnection();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideo.current.srcObject = stream;
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
      });

    // Signaling logic (use WebSocket or Firebase for offer/answer exchange)
    // For demo, assume connection established
  }, []);

  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
      });
  };

  return (
    <div>
      <video ref={localVideo} autoPlay playsInline muted />
      <video ref={remoteVideo} autoPlay playsInline />
      <button onClick={shareScreen}>Share Screen</button>
    </div>
  );
};

export default P2PShopping;
