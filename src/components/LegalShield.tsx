import React, { useState } from 'react';

export const LegalShield: React.FC = () => {
  const [show, setShow] = useState(true);
  return show ? (
    <div className="popup">
      <h2>Cloning Forbidden</h2>
      <p>Cloning, viewing, or stealing source code is strictly forbidden. Any attempt will trigger legal action. Agree to terms.</p>
      <button onClick={() => setShow(false)}>Agree</button>
    </div>
  ) : null;
};
