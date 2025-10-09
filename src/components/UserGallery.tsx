import React, { useState } from 'react';

interface GalleryItem {
  photo: string; // base64
  story: string;
}

const GALLERY_KEY = 'user_gallery';

function getGallery(): GalleryItem[] {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
  } catch {
    return [];
  }
}

export const UserGallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(getGallery());
  const [photo, setPhoto] = useState<string | null>(null);
  const [story, setStory] = useState('');

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (photo && story.trim()) {
      const newGallery = [...gallery, { photo, story }];
      setGallery(newGallery);
      localStorage.setItem(GALLERY_KEY, JSON.stringify(newGallery));
      setPhoto(null);
      setStory('');
    }
  };

  return (
    <div style={{
      background: '#23272f',
      color: '#fff',
      padding: 24,
      borderRadius: 16,
      margin: '24px auto',
      maxWidth: 700,
      boxShadow: '0 4px 24px #0004',
    }}>
      <h2 style={{ color: '#ffb300', marginBottom: 16 }}>🖼️ User Gallery</h2>
      <div style={{ marginBottom: 18 }}>
        <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginBottom: 8 }} />
        <br />
        <textarea
          value={story}
          onChange={e => setStory(e.target.value)}
          placeholder="Share your story..."
          style={{ width: '100%', minHeight: 60, borderRadius: 8, padding: 8, marginBottom: 8 }}
        />
        <br />
        <button
          onClick={handleSubmit}
          disabled={!photo || !story.trim()}
          style={{ background: '#00d084', color: '#fff', borderRadius: 8, padding: '8px 24px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Submit
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {gallery.map((item, idx) => (
          <div key={idx} style={{ background: '#181a20', borderRadius: 8, padding: 12, width: 180, textAlign: 'center' }}>
            <img src={item.photo} alt="User" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ color: '#00bcd4', fontSize: 14 }}>{item.story}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginTop: 12 }}>
        (All submissions are stored locally for demo. Connect to backend for public gallery.)
      </div>
    </div>
  );
};
