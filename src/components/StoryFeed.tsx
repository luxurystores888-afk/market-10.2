import React, { useState, useEffect } from 'react';

const StoryFeed = () => {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState('');

  useEffect(() => {
    // Fetch stories from API
    fetch('/api/stories').then(res => res.json()).then(setStories);
  }, []);

  const postStory = () => {
    fetch('/api/stories', { method: 'POST', body: JSON.stringify({ content: newStory }) });
    setStories([...stories, { content: newStory }]);
    setNewStory('');
  };

  return (
    <div>
      <h2>Cyber Stories</h2>
      <textarea value={newStory} onChange={e => setNewStory(e.target.value)} />
      <button onClick={postStory}>Post</button>
      {stories.map((story, i) => <p key={i}>{story.content}</p>)}
    </div>
  );
};

export default StoryFeed;
