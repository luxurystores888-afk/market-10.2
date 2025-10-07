import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Zap, Shield, Cpu, Rocket, Sparkles, Eye, Camera, Scan } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'; // Assuming shadcn/ui or similar
import ViralContest from '../components/ViralContest';
import FocusLock from 'react-focus-lock';
import { PowerfulOfSpreader } from '../components/PowerfulOfSpreader';
import { Gamification } from '../components/Gamification';
import { RealTimeChat } from '../components/RealTimeChat';
import { CollaborativeEditor } from '../components/CollaborativeEditor';
import { PhysicsAnimation } from '../components/PhysicsAnimation';
import { AdaptiveDesign } from '../components/AdaptiveDesign';
import { SocialFeed } from '../components/SocialFeed';
import { EdgeCDN } from '../components/EdgeCDN';
import { ParticleEffects } from '../components/ParticleEffects';
import { CommunityContent } from '../components/CommunityContent';
import { EnterpriseSolutions } from '../components/EnterpriseSolutions';
import { Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, MathUtils } from 'three';
import HypeGenerator from '../components/HypeGenerator';
import LoopEnroller from '../components/LoopEnroller';
import ViralMultiplier from '../components/ViralMultiplier';
import ViralShare from '../components/ViralShare';
import * as THREE from 'three';
import { ProfitSingularityNexus } from '../components/ProfitSingularityNexus';
import { LegalShield } from '../components/LegalShield';
import { useTranslation } from 'react-i18next';

// Lazy load AI components
const MultiAIStatus = lazy(() => import('../components/MultiAIStatus'));
const AIProductGenerator = lazy(() => import('../components/AIProductGenerator'));
const ImageAnalysis = lazy(() => import('../components/ImageAnalysis'));
const PuterAI = lazy(() => import('../components/PuterAI'));
const VisualSearch = lazy(() => import('../components/VisualSearch'));

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock: number;
  tags?: string[];
}

// Move this to top:
import init, { fibonacci } from './fib.wasm';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('Cosmic Monitor Active!');
  });
}

// Translations
const translations = {
  en: { greeting: 'Hello' },
  ar: { greeting: 'مرحبا' }
};

// Use: <p>{translations[locale].greeting}</p>

// Cache function
const getCached = (key) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, time } = JSON.parse(cached);
    if (Date.now() - time < 3600000) return data;
  }
  return null;
};

const setCached = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, time: Date.now() }));
};

// Use in fetch

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Add cart state and functions
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  // On add
  navigator.vibrate([100, 30, 100]);

  // Add state for AI modal
  const [showAIModal, setShowAIModal] = useState(false);

  // Add state for time travel
  const [timeTraveledPrice, setTimeTraveledPrice] = useState<string | null>(null);

  // Add dashboard state
  const [cosmicStats, setCosmicStats] = useState({ sessionTime: 0, actions: 0 });

  // Control Center state
  const [showControlCenter, setShowControlCenter] = useState(false);

  // Consolidate to:
  const [waveFrequency, setWaveFrequency] = useState(() => parseInt(localStorage.getItem('waveFreq') || '10'));
  const [isPlayingWaves, setIsPlayingWaves] = useState(false);
  let audioCtx, osc1, osc2;

  const generateGiveawayStorm = () => {
    alert('🚀 Launch Billion Free Giveaway Storm!\n\nTo generate 10,000 viral posts:\n1. Open terminal in project root\n2. Run: node scripts/billion-giveaway-storm.js\n\nPosts will be saved to giveaway-storm.txt - copy and share on Reddit/Twitter for FREE massive traffic!\n\nAim for billion-dollar virality! 🌪️');
  };

  // Functions as is.

  const startWaves = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc1 = audioCtx.createOscillator();
    osc2 = audioCtx.createOscillator();
    osc1.frequency.setValueAtTime(200, audioCtx.currentTime); // Base
    osc2.frequency.setValueAtTime(200 + waveFrequency, audioCtx.currentTime); // Delta
    osc1.connect(audioCtx.destination);
    osc2.connect(audioCtx.destination);
    osc1.start();
    osc2.start();
    setIsPlayingWaves(true);
  };

  const stopWaves = () => {
    osc1.stop();
    osc2.stop();
    audioCtx.close();
    setIsPlayingWaves(false);
  };

  const updateFrequency = (freq) => {
    setWaveFrequency(freq);
    localStorage.setItem('waveFreq', freq.toString());
    if (isPlayingWaves) {
      stopWaves();
      startWaves();
    }
  };

  // Add WebGL Canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isPlayingWaves && canvasRef.current) {
      const canvas = canvasRef.current;
      const gl = canvas.getContext('webgl');
      if (!gl) return;

      // Simple vertex shader
      const vsSource = `
        attribute vec4 aPosition;
        void main() {
          gl_Position = aPosition;
        }
      `;

      // Fragment shader for wave viz (synced to freq)
      const fsSource = `
        precision mediump float;
        uniform float uTime;
        uniform float uFreq;
        void main() {
          vec2 uv = gl_FragCoord.xy / vec2(300.0, 200.0);
          float wave = sin(uv.x * 10.0 + uTime) * (uFreq / 40.0);
          gl_FragColor = vec4(uv.x, uv.y + wave, 0.5 + wave, 1.0);
        }
      `;

      // Compile shaders, program, etc. (simplified - assume full init)
      const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);

      const uTime = gl.getUniformLocation(shaderProgram, 'uTime');
      const uFreq = gl.getUniformLocation(shaderProgram, 'uFreq');

      const render = (time) => {
        gl.uniform1f(uTime, time / 1000);
        gl.uniform1f(uFreq, waveFrequency);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }
  }, [isPlayingWaves, waveFrequency]);

  // Helper function (add this)
  function initShaderProgram(gl, vsSource, fsSource) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
    }
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    return program;
  }

  // UI in a section
  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8');
      const data = await response.json();
      setFeaturedProducts(data.products || data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample products
      setFeaturedProducts([
        {
          id: '1',
          name: '🧠 Neural Interface Headset',
          description: 'Advanced neural interface technology for direct brain-computer connection.',
          price: 2499.99,
          imageUrl: '/api/placeholder/neural-headset',
          category: 'Neural Tech',
          stock: 10,
          tags: ['Neural', 'Interface', 'Brain']
        },
        {
          id: '2',
          name: '⚡ Quantum Processor Core',
          description: 'Military-grade quantum processing unit for maximum computational power.',
          price: 4999.99,
          imageUrl: '/api/placeholder/quantum-processor',
          category: 'Computing',
          stock: 5,
          tags: ['Quantum', 'Processor', 'Computing']
        },
        {
          id: '3',
          name: '🌟 Holographic Display Matrix',
          description: 'State-of-the-art holographic projection system with photorealistic quality.',
          price: 3499.99,
          imageUrl: '/api/placeholder/holographic-display',
          category: 'Display',
          stock: 8,
          tags: ['Holographic', '3D', 'Display']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  // Add notification request
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // On addToCart
  if (Notification.permission === 'granted') {
    new Notification(`${product.name} added to cart!`);
  }

  // Add scene setup in useEffect
  useEffect(() => {
    // Divine particle system
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add glowing particles
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(Array.from({length: 10000}, () => new THREE.Vector3(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000))),
      new THREE.PointsMaterial({ color: 0xFFD700, size: 5 }) // Golden divine color
    );
    scene.add(particles);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Emotional overlay
    const overlay = document.createElement('div');
    overlay.innerText = 'Feel the Divine Miracle – Touch Your Soul';
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.color = 'gold';
    overlay.style.fontSize = '3em';
    overlay.style.textShadow = '0 0 20px gold';
    document.body.appendChild(overlay);

    return () => {
      document.body.removeChild(renderer.domElement);
      document.body.removeChild(overlay);
    };
  }, []);

  // In WebGL useEffect, add portal
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

  // Animate torus rotation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;

  // On click, 'portal' - change scene color or something
  canvas.addEventListener('click', () => {
    material.color.setHex(Math.random() * 0xffffff); // Real dimension change
  });

  // Style: Set z-index low for background

  // Check for WebGPU support
  if (navigator.gpu) {
    // WebGPU code for fractal (mandelbrot set rendering)
  } else {
    // Fallback to WebGL
  }

  // Add canvas and rendering loop similar to previous WebGL.

  // Parallel Self
  const [parallelPoints, setParallelPoints] = useState(0);

  useEffect(() => {
    const workers = [];
    for (let i = 0; i < 3; i++) {
      const worker = new Worker(URL.createObjectURL(new Blob([`
        setInterval(() => self.postMessage(Math.random() * 5), 2000);
      `])));
      worker.onmessage = (e) => setParallelPoints(prev => prev + e.data);
      workers.push(worker);
    }
    return () => workers.forEach(w => w.terminate());
  }, []);

  // Display
  <p>Parallel Selves Points: {parallelPoints.toFixed(2)} (Computing in Multiverse!)</p>

  // Add observer
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      // Adjust styles based on size
      document.body.style.fontSize = `${entries[0].contentRect.width / 100}px`;
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // State
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en');

  // Set state with navigator.language.split('-')[0]
  useEffect(() => {
    const detectedLocale = navigator.language.split('-')[0];
    setLocale(detectedLocale);
    localStorage.setItem('locale', detectedLocale);
  }, []);

  // Button
  <select onChange={(e) => {
    setLocale(e.target.value);
    localStorage.setItem('locale', e.target.value);
  }}>
    <option value="en">English</option>
    <option value="ar">Arabic</option>
  </select>

  // Use locale in Intl

  // Fetch RSS
  useEffect(() => {
    fetch('rss.url').then(res => res.text()).then(xml => {
      // Parse with DOMParser or library
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      // Extract items
    });
  }, []);

  // Generate iCal
  const generateICal = () => {
    const ical = 'BEGIN:VCALENDAR...';
    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.ics';
    a.click();
  };

  // Button: <button onClick={generateICal}>Add to Calendar</button>

  // Template function
  const renderEmail = (template, data) => template.replace(/{{key}}/g, data.key);

  // Use for fake emails

  // SMS function
  const sendSMS = (msg) => console.log(`SMS: ${msg}`);

  // IndexedDB setup
  const db = indexedDB.open('offlineForms', 1);
  // On submit, if (!navigator.onLine) store in DB

  // Battery Status-Aware Loading
  useEffect(() => {
    navigator.getBattery().then(battery => {
      if (battery.level < 0.2) {
        // Disable animations and heavy features
        // This would typically involve setting state variables
        // For example, setIsPlayingWaves(false);
        // setShowAdvancedFeatures(false);
        // setShowVisualSearch(false);
        // etc.
      }
    });
  }, []);

  // confetti function with random colors

  // State for poll options, vote buttons

  // Load WASM
  useEffect(() => {
    init().then(() => {
      setInterval(() => {
        const num = fibonacci(10); // Real WASM call
        setPattern(num);
      }, 1000);
    });
  }, []);

  // <p>Eternal Pattern: {pattern}</p>

  const { t } = useTranslation();

  return (
    <AdaptiveDesign>
      {/* Hero Section */}
      <section id="main-content" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 ultra-text-glow dynamic-gradient">
            PULSE
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The ultimate destination for cyberpunk technology, neural enhancements, and quantum devices. Step into the future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="ultra-button flame-button text-white px-8 py-4 rounded-xl font-semibold text-lg cyber-glow rocket-trail">
              🚀 Explore Catalog
            </button>
            <button
              onClick={() => setShowVisualSearch(true)}
              className="ultra-button crystalline-border bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg ultra-interactive flex items-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>🔍 Visual Search</span>
            </button>
            <button
              onClick={generateGiveawayStorm}
              className="ultra-button bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/40 hover:to-blue-500/40 text-green-400 px-8 py-4 rounded-xl font-semibold text-lg ultra-interactive flex items-center space-x-2"
            >
              <Rocket className="h-5 w-5" />
              <span>🌪️ Launch Giveaway Storm</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose Pulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="ultra-glow-card game-ui-panel text-center ultra-interactive particle-system">
              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-lg w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-AI Fusion</h3>
              <p className="text-gray-400">Unlimited AI power via Gemini + OpenAI + Browser AI</p>
            </div>
            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quantum Security</h3>
              <p className="text-gray-400">Military-grade quantum encryption protects your data</p>
            </div>
            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
              <div className="bg-gradient-to-r from-green-400 to-cyan-400 p-3 rounded-lg w-fit mx-auto mb-4">
                <Cpu className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Neural Interface</h3>
              <p className="text-gray-400">Direct brain-computer interface for seamless shopping</p>
            </div>
            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
              <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-3 rounded-lg w-fit mx-auto mb-4">
                <Eye className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AR/VR Experience</h3>
              <p className="text-gray-400">Holographic displays and reality-transcending previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Toggle - Load Heavy Components On-Demand */}
      <section className="py-8 px-4 text-center">
        <div className="container mx-auto">
          <button
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="h-5 w-5" />
            <span>{showAdvancedFeatures ? 'Hide' : 'Show'} Advanced AI Features</span>
          </button>
        </div>
      </section>

      {/* Progressive AI Features - Load Only When Requested */}
      {showAdvancedFeatures && (
        <>
          {/* Multi-AI Status */}
          <section className="py-8 px-4">
            <div className="container mx-auto">
              <Suspense fallback={
                <div className="text-center text-cyan-400 py-8">
                  <div className="animate-spin text-2xl mb-2">🧠</div>
                  <div>Loading AI Status...</div>
                </div>
              }>
                <MultiAIStatus />
              </Suspense>
            </div>
          </section>

          {/* AI Product Generator */}
          <section className="py-16 px-4 bg-gradient-to-r from-gray-900/50 via-purple-900/30 to-cyan-900/50">
            <div className="container mx-auto">
              <Suspense fallback={
                <div className="text-center text-purple-400 py-8">
                  <div className="animate-pulse text-2xl mb-2">🤖</div>
                  <div>Loading AI Generator...</div>
                </div>
              }>
                <AIProductGenerator />
              </Suspense>
            </div>
          </section>

          {/* Image Analysis */}
          <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 via-gray-900/50 to-cyan-900/30">
            <div className="container mx-auto">
              <Suspense fallback={
                <div className="text-center text-cyan-400 py-8">
                  <div className="animate-bounce text-2xl mb-2">📸</div>
                  <div>Loading Image Analysis...</div>
                </div>
              }>
                <ImageAnalysis />
              </Suspense>
            </div>
          </section>

          {/* Browser AI */}
          <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/30 via-green-900/20 to-gray-900/50">
            <div className="container mx-auto">
              <Suspense fallback={
                <div className="text-center text-green-400 py-8">
                  <div className="animate-pulse text-2xl mb-2">🌐</div>
                  <div>Loading Browser AI...</div>
                </div>
              }>
                <PuterAI />
              </Suspense>
            </div>
          </section>
        </>
      )}

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Featured Products</h2>
          <ProductGrid
            products={featuredProducts}
            onAddToCart={addToCart}
            onQuickView={openQuickView}
            loading={loading}
          />
        </div>
      </section>

      {searchResults.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Visual Search Results</h2>
            <ProductGrid
              products={searchResults}
              onAddToCart={addToCart}
              onQuickView={openQuickView}
              loading={false}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Upgrade Your Reality?</h2>
          <p className="text-xl text-gray-300 mb-8">Join millions of users in the cyberpunk revolution</p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
            Start Shopping Now
          </button>
        </div>
      </section>

      {/* Visual Search Modal - Load Only When Opened */}
      {showVisualSearch && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-center text-cyan-400">
              <div className="animate-spin text-4xl mb-4">🔍</div>
              <div className="text-xl">Loading Visual Search...</div>
            </div>
          </div>
        }>
          <VisualSearch
            onProductsFound={(products) => {
              setSearchResults(products);
              setShowVisualSearch(false); // Optional: close modal after search
            }}
            onClose={() => setShowVisualSearch(false)}
          />
        </Suspense>
      )}

      {/* Floating Visual Search Button */}
      <button
        onClick={() => setShowVisualSearch(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
        title="AI Visual Search"
      >
        <Scan className="h-6 w-6" />
      </button>

      {/* AI Modal component */}
      {showAIModal && (
        <FocusLock>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Year 10000 AI Assistant</h2>
              <p className="text-gray-300 mb-4">Ask me anything about products or the future!</p>
              <input 
                type="text" 
                placeholder="Type your query..." 
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAIModal(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Close
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Send
                </button>
              </div>
            </div>
          </div>
        </FocusLock>
      )}

      {/* Add button to open modal */}
      <button 
        onClick={() => setShowAIModal(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-800 text-white p-4 rounded-full shadow-lg"
      >
        🤖 AI Chat (Year 10000)
      </button>

      {/* Control Center Panel */}
      {showControlCenter && (
        <div className="fixed top-20 right-4 bg-gray-800 p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Ultimate Control Center</h3>
          <button onClick={() => localStorage.clear()} className="block mb-2 text-red-400">
            Reset Universe
          </button>
          <button onClick={() => setShowAIModal(true)} className="block mb-2 text-blue-400">
            Activate AI
          </button>
          <button onClick={() => setShowControlCenter(false)}>Close</button>
        </div>
      )}

      {/* Toggle button */}
      <button 
        onClick={() => setShowControlCenter(!showControlCenter)}
        className="fixed top-4 right-4 bg-gold-500 text-white p-2 rounded"
      >
        Control Center (God Mode)
      </button>

      {/* Toggle button */}
      <button onClick={() => document.body.classList.toggle('color-blind')}>Simulate Color Blindness</button>

      {/* CSS: .color-blind { filter: grayscale(1) contrast(1.2); } */}

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-64 object-cover mb-4" />
            <DialogDescription>{selectedProduct.description}</DialogDescription>
            <p className="text-2xl font-bold mt-4">${selectedProduct.price.toFixed(2)}</p>
            <button onClick={() => addToCart(selectedProduct)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
            <button 
              onClick={() => timeTravel(selectedProduct)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded"
            >
              Time Travel Preview
            </button>
          </DialogContent>
        </Dialog>
      )}
      <ViralContest />
      <Gamification />
      <RealTimeChat />
      <CollaborativeEditor />
      <PhysicsAnimation />
      <SocialFeed />
      <EdgeCDN />
      <ParticleEffects />
      <CommunityContent />
      <EnterpriseSolutions />
      <LegalShield />
      <ViralShare />
      <div className="fixed bottom-0 left-0 p-2 bg-black text-white text-xs">
        Cosmic Status: Session {cosmicStats.sessionTime}s | Actions: {cosmicStats.actions}
      </div>
      {/* Add WebGL Canvas */}
      <canvas ref={canvasRef} width="300" height="200" className={`${isPlayingWaves ? 'block' : 'hidden'} mt-4`}></canvas>
      {/* If battery.level < 0.2, show <p>Charge for better experience!</p> */}
      {navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
          return (
            <p className="fixed bottom-4 left-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
              Charge for better experience!
            </p>
          );
        }
        return null;
      })}
      <section className="mt-8">
        <PowerfulOfSpreader />
      </section>
      <HypeGenerator />
      <LoopEnroller />
      <ViralMultiplier />
      <ProfitSingularityNexus productId="example" />
      <div style={{ display: 'none' }} id="soul-watermark">
        Anti-Clone Fingerprint: {Math.random().toString(36) + navigator.userAgent + Date.now()}
      </div>
      <button onClick={() => fetch('/api/ai/generate-tsunami')}>Launch Tsunami</button>
      <button onClick={() => fetch('/api/ai/generate-hype-blast')}>Blast Hype</button>
    </AdaptiveDesign>
  );
}