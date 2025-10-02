import React, { useState } from 'react';

const AvatarGenerator = () => {
  const [avatar, setAvatar] = useState('');

  const generateAvatar = () => {
    // For demo: Generate random cyberpunk avatar URL or use free API like DiceBear
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`);
  };

  return (
    <div>
      <button onClick={generateAvatar}>Generate Cyber Avatar</button>
      {avatar && <img src={avatar} alt="Generated Avatar" />}
    </div>
  );
};

export default AvatarGenerator;
