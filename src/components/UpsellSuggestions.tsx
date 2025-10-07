import React, { useEffect, useState } from 'react';

const UpsellSuggestions = ({ cartItems }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch('/api/ai/recommendations?cart=' + cartItems.map(i => i.id).join(','))
      .then(res => res.json())
      .then(setSuggestions);
  }, [cartItems]);

  return (
    <div>
      <h3>Suggested Add-ons</h3>
      {suggestions.map(s => <div key={s.id}>{s.name}</div>)}
    </div>
  );
};

export default UpsellSuggestions;
