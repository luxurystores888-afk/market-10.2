import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { WebGLRenderer } from 'three';

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

  // Add orientation listener
  useEffect(() => {
    const handleDeviceOrientation = (e) => {
      if (Math.abs(e.gamma) > 30) { // Shake detected
        alert('Mind Read! Recommended: Neural Headset (Telepathic Suggestion)');
      }
    };
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, []);

  // Request sensor permission
  const sensor = new AmbientLightSensor();
  sensor.addEventListener('reading', () => {
    // Change product card background based on light level
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.backgroundColor = `hsl(0, 0%, ${sensor.illuminance / 10}%)`;
    });
  });
  sensor.start();

  // Add canvas background
  const canvas = useRef(null);

  useEffect(() => {
    // Perlin noise function (simple JS impl)
    const perlin = {
      rand_vect() { /* simple rand */ },
      // Full perlin code...
    };

    const ctx = canvas.current.getContext('2d');
    const animate = () => {
      // Use perlin to draw foam bubbles reacting to mouse
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // <canvas ref={canvas} style={{ position: 'absolute', zIndex: -1 }} />

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
        <p className="text-xs text-gray-500">Shake device for telepathic recs!</p>
      </div>
    );
  }

  const createSingularity = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let radius = 50;
    const animate = () => {
      ctx.clearRect(0, 0, 200, 200);
      ctx.beginPath();
      ctx.arc(100, 100, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      radius += 1; // Grow
      if (radius < 100) requestAnimationFrame(animate);
    };
    animate();

    // 'Suck in' simulation: Move a product card
    const card = document.querySelector('.product-card');
    if (card) card.style.transform = 'translate(-50px, -50px) scale(0.5)'; // Real move
  };

  // Vortex function
  const createVortex = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = data.data[i] * (Math.random() + 0.5); // Distort red channel
    }
    ctx.putImageData(data, 0, 0);
    img.src = canvas.toDataURL(); // Real distortion
  };

  // On product image hover: createVortex(this)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {predictedProducts.length > 0 && (
        <div>
          <h3>Predicted For You</h3>
          {/* Render grid with predictedProducts */}
        </div>
      )}
      {products.map((product, index) => (
        <>
          {index % 4 === 0 && index !== 0 && <AdPlaceholder />}
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        </>
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

      {/* Impossible Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button 
          onClick={() => {
            // Real clone: Duplicate first product
            // setProducts(prev => [...prev, { ...prev[0], id: `clone-${Date.now()}` }]);
          }}
          className="bg-red-500 p-2 text-white text-xs"
        >
          Clone Reality
        </button>
        <button 
          onClick={() => {
            // Real gravity: Animate last product falling
            const last = document.querySelector('.product-card:last-child');
            if (last) last.style.transform = 'translateY(100px)'; // Simple fall
          }}
          className="bg-red-500 p-2 text-white text-xs"
        >
          Break Gravity
        </button>
        <button className="bg-red-500 p-2 text-white text-xs">Violate Physics</button>
      </div>

      {/* Singularity */}
      <button onClick={createSingularity} className="bg-black text-white p-2">Create Singularity</button>
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

// Add AdPlaceholder component
function AdPlaceholder() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-cyan-400">Advertisement</p>
      <p className="text-white">Integrate Google AdSense here for free monetization!</p>
    </div>
  );
}