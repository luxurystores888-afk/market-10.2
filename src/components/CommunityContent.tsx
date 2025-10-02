import React, { useState } from 'react';

export const CommunityContent: React.FC = () => {
  const [content, setContent] = useState('');

  const submitContent = () => {
    // Moderate and add
    alert('Content submitted for moderation');
  };

  return (
    <div>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={submitContent}>Submit</button>
    </div>
  );
};
