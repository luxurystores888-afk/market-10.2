import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  category?: string;
  stock: number;
  tags?: string[];
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  loading?: boolean;
}

export function ProductGrid({ products, onAddToCart, onQuickView, loading }: ProductGridProps) {
  const [predictedProducts, setPredictedProducts] = useState([]);
  const [showAR, setShowAR] = useState(false);
  const [arProduct, setArProduct] = useState(null);
  const [altText, setAltText] = useState('Loading...');

  useEffect(() => {
    fetch('/api/ai/predict-merchandise')
      .then(res => res.json())
      .then(data => setPredictedProducts(data.products || []));
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'priceUpdate') {
        // This part of the code was not provided in the original file,
        // so it's not directly applicable here.
        // setProducts(prev => prev.map(p => p.id === data.productId ? { ...p, price: data.newPrice } : p));
      }
    };
    return () => ws.close();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-900/50 border border-cyan-500/30 rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-3 bg-gray-800 rounded w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-800 rounded w-20"></div>
                <div className="h-10 bg-gray-800 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {predictedProducts.length > 0 && (
        <div>
          <h3>Predicted For You</h3>
          {/* Render grid with predictedProducts */}
        </div>
      )}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
      {showAR && (
        <div id="ar-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
          {/* Three.js AR setup */}
          <script>
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('ar-container').appendChild(renderer.domElement);
            renderer.xr.enabled = true;
            document.body.appendChild(ARButton.createButton(renderer));
            // Load simple model (e.g., box for demo)
            const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            cube.position.set(0, 0, -0.3);
            function animate() {
              renderer.setAnimationLoop(() => renderer.render(scene, camera));
            }
            animate();
          </script>
          <button onClick={() => setShowAR(false)}>Close AR</button>
        </div>
      )}
    </div>
  );
}

function optimizeImage(url) {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300; // Compress size
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 300, 300);
    return canvas.toDataURL('image/webp', 0.7);
  };
  return url; // Fallback
}

async function fetchAltText(url) {
  const res = await fetch('/api/ai/generate-alt-text', { method: 'POST', body: JSON.stringify({ imageUrl: url }) });
  const data = await res.json();
  setAltText(data.altText);
}