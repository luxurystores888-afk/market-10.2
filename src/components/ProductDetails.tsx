import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // Fetch product
    fetch(`/api/products/${productId}`).then(res => res.json()).then(setProduct);
    // Fetch FAQs
    fetch(`/api/ai/generate-faq?productId=${productId}`).then(res => res.json()).then(setFaqs);
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Other details */}
      <h2>FAQs</h2>
      {faqs.map((faq, i) => (
        <div key={i}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
