import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PersonalMicrosite = () => {
  const { userId } = useParams();
  const [personalData, setPersonalData] = useState(null);

  useEffect(() => {
    fetch(`/api/user/microsite-data?userId=${userId}`)
      .then(res => res.json())
      .then(setPersonalData);
  }, [userId]);

  if (!personalData) return <div>Loading personalized site...</div>;

  return (
    <div>
      <h1>Welcome to Your Personal Pulse Microsite!</h1>
      {/* Render personalized content, e.g., recommended products */}
      <pre>{JSON.stringify(personalData, null, 2)}</pre>
    </div>
  );
};

export default PersonalMicrosite;
