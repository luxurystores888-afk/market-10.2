// seoEnhancer.ts - SEO Auto-Enhancer with Structured Data

export function injectProductStructuredData(product) {
  if (!product) return;
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);
}

// Example usage:
// injectProductStructuredData({ name: 'Cyber Widget', imageUrl: '/img.png', description: '...', id: '123', price: 99, stock: 5 });
