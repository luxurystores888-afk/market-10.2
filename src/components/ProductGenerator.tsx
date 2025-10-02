import React, { useState } from 'react';

const ProductGenerator = () => {
  const [prompt, setPrompt] = useState('cyberpunk gadget');
  const [image, setImage] = useState('');

  const generate = async () => {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setImage(data.images[0]); // Assuming base64
  };

  return (
    <div>
      <input value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={generate}>Generate Product Image</button>
      {image && <img src={`data:image/png;base64,${image}`} alt="Generated" />}
    </div>
  );
};

export default ProductGenerator;
