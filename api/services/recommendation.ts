import KNN from 'ml-knn';
// Assume from project
import { db } from '../../db'; // Adjust path

async function loadProducts() {
  try {
    return await db.select().from('products'); // Drizzle syntax; adjust if needed
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

let products = [];
loadProducts().then(data => { products = data; });

function getRecommendations(productId, k = 5) {
  // Assume products have features like encoded tags/categories
  const features = products.map(p => encodeFeatures(p));
  const labels = products.map(p => p.id);
  
  const knn = new KNN(features, labels);
  const targetFeatures = encodeFeatures(products.find(p => p.id === productId));
  
  const recommendations = knn.predict(targetFeatures, k);
  return recommendations.map(id => products.find(p => p.id === id));
}

// In encodeFeatures: simple hash for tags
function encodeFeatures(product) {
  return product.tags ? product.tags.map(tag => tag.charCodeAt(0)) : [0];
}

export { getRecommendations };
