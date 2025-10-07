import React, { useState, useEffect } from 'react';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(setReviews);
  }, [productId]);

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.title} - {review.rating} stars</p>
          <p>{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
