import React, { useState } from 'react';

export const VoiceControl: React.FC = () => {
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      // Handle commands, e.g., if (transcript.includes('add to cart')) handleAddToCart();
    };
    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>Start Voice Command</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};
