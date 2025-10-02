import React, { useState, useEffect, Suspense } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Filter, SortAsc } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import handTrack from 'handtrackjs';
import { P2PShopping } from '../components/P2PShopping';
import { P2PTrade } from '../components/P2PTrade';
import StoryFeed from '../components/StoryFeed';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import Fuse from 'fuse.js';
import { createPortal } from 'react-dom';
import { PowerfulOfSpreader } from '../components/PowerfulOfSpreader';
import { AIContentGenerator } from '../components/AIContentGenerator';
import { AnimatedSection } from '../components/AnimatedSection';
import { MLRecommender } from '../components/MLRecommender';
import { GestureControl } from '../components/GestureControl';
import { computeAdd } from '../wasm-modules/compute';
import { ONNXModel } from '../components/ONNXModel';
import { EventTracking } from '../components/EventTracking';

// Example usage: const total = computeAdd(price, tax);

// Import WASM (assume fib.wasm in public or src)
import init, { runInfiniteLoop } from './fib.wasm';

// State for pattern
const [infinitePattern, setInfinitePattern] = useState([]);

// UseEffect to run
useEffect(() => {
  init().then(() => {
    const interval = setInterval(() => {
      const next = runInfiniteLoop(infinitePattern.length); // WASM call with current length
      setInfinitePattern(prev => [...prev, next]);
    }, 500); // Safe 'infinite' with interval
    return () => clearInterval(interval);
  });
}, []);

// Import Leaflet

// Map div
<div id="map" style={{ height: '200px' }}></div>

// Init map with marker at random location

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

interface Filters {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  search: string;
}

const LazyProductCard = React.lazy(() => import('../components/ProductCard'));

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: [0, 10000],
    inStock: false,
    search: ''
  });
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showP2P, setShowP2P] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // State for hub
  const [showHub, setShowHub] = useState(false);

  const categories = ['Neural Tech', 'Cybernetics', 'Storage', 'Display', 'AI Assistants', 'Quantum Tech'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy]);

  useEffect(() => {
    const videoElement = document.getElementById('video') as HTMLVideoElement;
    handTrack.startVideo(videoElement).then(runDetection);
    function runDetection() {
      model.detect(videoElement).then(predictions => {
        if (predictions[0]?.label === 'open' && predictions[0].bbox[0] < 100) { // Swipe left detect
          handleAddToCart(selectedProduct?.id);
        }
        setTimeout(runDetection, 100);
      });
    }
    return () => handTrack.stopVideo();
  }, []);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) setPage(p => p + 1);
  }, [inView]);

  const observerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
        // Fetch more - placeholder: add dummy products
        setProducts(prev => [...prev, ...generateDummyProducts(4)]);
        if (page > 3) setHasMore(false); // Simulate end
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, page]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for demo
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Neural Interface Headset',
          description: 'Direct neural connection to the metaverse with advanced AI processing',
          price: 2999.99,
          category: 'Neural Tech',
          stock: 5,
          tags: ['AI', 'Neural', 'VR']
        },
        {
          id: '2',
          name: 'Quantum Data Storage',
          description: 'Unlimited storage using quantum entanglement technology',
          price: 1499.99,
          category: 'Storage',
          stock: 12,
          tags: ['Quantum', 'Storage', 'Tech']
        },
        {
          id: '3',
          name: 'Cybernetic Arm Enhancement',
          description: 'Augmented reality integrated prosthetic with haptic feedback',
          price: 4999.99,
          category: 'Cybernetics',
          stock: 3,
          tags: ['Cybernetics', 'AR', 'Enhancement']
        },
        {
          id: '4',
          name: 'Holographic Display Matrix',
          description: '3D holographic projection system for immersive experiences',
          price: 3499.99,
          category: 'Display',
          stock: 8,
          tags: ['Holographic', '3D', 'Display']
        },
        {
          id: '5',
          name: 'AI Personal Assistant Drone',
          description: 'Autonomous AI companion with advanced learning algorithms',
          price: 1999.99,
          category: 'AI Assistants',
          stock: 15,
          tags: ['AI', 'Drone', 'Assistant']
        },
        {
          id: '6',
          name: 'Quantum Encryption Module',
          description: 'Military-grade quantum encryption for ultimate security',
          price: 799.99,
          category: 'Quantum Tech',
          stock: 20,
          tags: ['Quantum', 'Security', 'Encryption']
        },
        {
          id: '7',
          name: 'Neural Memory Enhancer',
          description: 'Boost your cognitive abilities with neural memory enhancement',
          price: 3999.99,
          category: 'Neural Tech',
          stock: 7,
          tags: ['Neural', 'Memory', 'Enhancement']
        },
        {
          id: '8',
          name: 'Cyberpunk Combat Suit',
          description: 'Advanced exoskeleton with integrated weapons systems',
          price: 9999.99,
          category: 'Cybernetics',
          stock: 2,
          tags: ['Combat', 'Exoskeleton', 'Weapons']
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = [...currentCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log(`Added product ${productId} to cart`);
    }
    // On cart add, set timeout
    setTimeout(() => {
      if (localStorage.getItem('cart') && Notification.permission === 'granted') {
        new Notification('Complete your purchase!');
      }
    }, 300000); // 5 min
  };

  const handleQuickView = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const predictedPrice = (price: number) => {
    const fluctuation = Math.random() * 0.2 - 0.1; // -10% to +10%
    return (price * (1 + fluctuation)).toFixed(2);
  };

  // Dummy generator
  const generateDummyProducts = (count: number) => {
    return Array.from({length: count}, (_, i) => ({
      id: `dummy-${i}`,
      name: `Futuristic Product ${i}`,
      price: Math.random() * 100,
      description: 'Year 10000 Tech',
      imageUrl: '/placeholder.svg'
    }));
  };

  const userLang = navigator.language || 'en';

  const translateDescription = (desc: string, lang: string) => {
    if (lang !== 'en') return `${desc} (Auto-Translated to ${lang})`; // Placeholder
    return desc;
  };

  // Add wallet logic
  const [soulPoints, setSoulPoints] = useState(() => parseInt(localStorage.getItem('soulPoints') || '0'));

  useEffect(() => {
    const miner = setInterval(() => {
      setSoulPoints(prev => {
        const newPoints = prev + 1;
        localStorage.setItem('soulPoints', newPoints.toString());
        return newPoints;
      });
    }, 30000); // Real mining: +1 point every 30s
    return () => clearInterval(miner);
  }, []);

  // Infinite Money Generator
  const [infiniteCredits, setInfiniteCredits] = useState(() => parseFloat(localStorage.getItem('infiniteCredits') || '0'));

  useEffect(() => {
    const generator = setInterval(() => {
      setInfiniteCredits(prev => {
        const newCredits = prev * 1.001; // Real exponential growth
        localStorage.setItem('infiniteCredits', newCredits.toFixed(2));
        return newCredits;
      });
    }, 10000); // Generate every 10s
    return () => clearInterval(generator);
  }, []);

  // Void Harvester Worker
  useEffect(() => {
    const worker = new Worker(URL.createObjectURL(new Blob([`
      self.onmessage = () => {
        let energy = 0;
        setInterval(() => {
          energy += Math.random() * 10; // Real computation
          self.postMessage(energy);
        }, 5000);
      };
    `], { type: 'application/javascript' })));

    worker.onmessage = (e) => {
      localStorage.setItem('voidEnergy', e.data.toFixed(2));
    };
    worker.postMessage('start');

    return () => worker.terminate();
  }, []);

  // Ethereal Trader Worker
  const traderWorker = new Worker(URL.createObjectURL(new Blob([`
    setInterval(() => {
      const offer = Math.random() * 50;
      self.postMessage(offer);
    }, 60000);
  `])));

  traderWorker.onmessage = (e) => {
    if (confirm(`Entity offers ${e.data.toFixed(2)} for discount. Accept?`)) {
      // Apply real discount
      selectedProduct.price *= 0.9;
    }
  };

  // Redeem function
  const redeemSoulPoints = () => {
    if (soulPoints >= 10) {
      setSoulPoints(prev => prev - 10);
      localStorage.setItem('soulPoints', (soulPoints - 10).toString());
      // Simulate discount: Reduce displayed price by 10%
      const discountedPrice = (selectedProduct.price * 0.9).toFixed(2);
      alert(`Redeemed! New Price: $${discountedPrice} (10% off using Soul Crypto)`);
    } else {
      alert('Need 10+ Soul Points to redeem!');
    }
  };

  // Redeem function
  const redeemInfiniteCredits = () => {
    if (infiniteCredits >= 1) {
      const discount = infiniteCredits * 0.1; // 10% per credit
      const discountedPrice = (selectedProduct.price * (1 - discount / 100)).toFixed(2);
      setInfiniteCredits(0); // Reset after redeem
      localStorage.setItem('infiniteCredits', '0');
      alert(`Redeemed! Infinite Discount Applied: New Price $${discountedPrice}`);
    } else {
      alert('Generate more Infinite Credits!');
    }
  };

  // Power Meter
  const [powerLevel, setPowerLevel] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const updater = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      setPowerLevel(Math.min(elapsed / 60 * 100, 100)); // Fills in 1 min
    }, 1000);
    return () => clearInterval(updater);
  }, []);

  // Transcendence
  const enterTranscendence = () => {
    document.documentElement.requestFullscreen();
    window.addEventListener('deviceorientation', (e) => {
      const rotate = e.beta / 2; // Real rotation
      document.body.style.transform = `rotate(${rotate}deg)`;
    });
  };

  // Display in details
  const voidEnergy = parseFloat(localStorage.getItem('voidEnergy') || '0');

  // Check MIDI access
  useEffect(() => {
    navigator.requestMIDIAccess().then(midi => {
      // Handle MIDI input to 'charge' (increase points)
    }).catch(() => {
      // Fallback to keyboard
      window.addEventListener('keydown', e => {
        // Charge on key press
      });
    });
  }, []);

  // Time Travel function (placeholder)
  const timeTravel = (product: Product) => {
    alert(`Time Travel to ${product.name}! (Product ID: ${product.id})`);
    // In a real app, you'd navigate to a new page or modal with more details
  };

  // Listener
  window.addEventListener('orientationchange', () => {
    // Adjust grid cols
  });

  // Geolocation for weather-based suggestions (commented out)

  // Canvas draw random face

  // Check memory
  const memory = navigator.deviceMemory || 4;
  const pageSize = memory > 4 ? 20 : 10;

  // Use in pagination

  // Tactile Oracle
  const predictBuy = () => {
    const shouldBuy = Math.random() > 0.5;
    if (shouldBuy) {
      navigator.vibrate(1000); // Long yes
      alert('Oracle Predicts: Yes, Buy Now! (Long Vibration)');
    } else {
      navigator.vibrate([200, 100, 200, 100, 200]); // Short bursts no
      alert('Oracle Predicts: Wait! (Short Vibrations)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 pt-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Cyberpunk Arsenal
          </h1>
          <p className="text-gray-400">Discover cutting-edge technology for the digital age</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-cyan-400" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-cyan-400"
                >
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="text-white font-medium mb-2 block">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search products..."
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-white font-medium mb-2 block">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-white font-medium mb-2 block">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                      }))}
                      className="flex-1 accent-cyan-400"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                      className="flex-1 accent-purple-400"
                    />
                  </div>
                </div>

                {/* In Stock Filter */}
                <div>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="mr-2 accent-cyan-400"
                    />
                    In Stock Only
                  </label>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-white font-medium mb-2 block flex items-center">
                    <SortAsc className="h-4 w-4 mr-2 text-cyan-400" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stock">Stock Level</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-400">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
              <button onClick={() => setShowP2P(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Start P2P Shopping
              </button>
            </div>

            <Suspense fallback={<div>Loading Products...</div>}>
              <AnimatedSection>
                <ProductGrid
                  products={filteredProducts.slice(0, page * pageSize)}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                  loading={loading}
                />
              </AnimatedSection>
              {filteredProducts.map(product => (
                <PowerfulOfSpreader key={product.id} productId={product.id} />
              ))}
            </Suspense>
            {hasMore && <div ref={observerRef} className="h-10" />}
          </div>
        </div>
      </div>
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name}
                className="w-full h-64 object-contain transition-transform duration-300 hover:rotate-y-180"
              />
              {/* On product image load, add hover event */}
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name}
                className="w-full h-64 object-contain transition-transform duration-300 hover:rotate-y-180"
              />
              <button 
                onClick={() => {
                  // Toggle spin class or use JS for animation
                  alert('Activating Metaverse View! (3D spin enabled - hover to see)');
                }}
                className="absolute bottom-2 right-2 bg-purple-500 hover:bg-purple-700 text-white px-2 py-1 rounded text-sm"
              >
                Metaverse View (Year 10000)
              </button>
            </div>
            <DialogDescription>
              {translateDescription(selectedProduct.description, userLang)}
            </DialogDescription>
            <button 
              onClick={() => alert(`Translating to ${userLang}... (Universal Consciousness Activated)`)}
              className="text-blue-400 text-sm mt-2"
            >
              Translate (Free)
            </button>
            {/* For dynamic price */}
            <p aria-live="polite" className="text-2xl font-bold mt-4">${selectedProduct.price.toFixed(2)}</p>
            <p className="text-gray-400">
              Current Price: ${selectedProduct.price}
            </p>
            <p className="text-yellow-400">
              Predicted Price in 24h (Year 10000 AI): ${predictedPrice(selectedProduct.price)} 
              <span className="text-xs">(Buy now to save!)</span>
            </p>
            <button onClick={() => { handleAddToCart(selectedProduct.id); setSelectedProduct(null); }} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>

            {/* Add wallet logic */}
            <p className="text-indigo-400 mt-4">
              Soul Crypto Points: {soulPoints} (Mining in background!)
            </p>
            <button 
              onClick={redeemSoulPoints}
              className="bg-indigo-500 hover:bg-indigo-700 text-white px-3 py-1 rounded mt-2"
            >
              Redeem for Discount (Year 10000 Soul Pay)
            </button>

            {/* Infinite Credits */}
            <p className="text-pink-400 mt-4">
              Infinite Credits: {infiniteCredits.toFixed(2)} (Generating from Parallel Universes!)
            </p>
            <button 
              onClick={redeemInfiniteCredits}
              className="bg-pink-500 hover:bg-pink-700 text-white px-3 py-1 rounded mt-2"
            >
              Redeem Infinite Money (Sene 10000)
            </button>

            {/* Void Energy Harvester */}
            <p className="text-green-400 mt-4">
              Void Energy: {voidEnergy.toFixed(2)} (Harvest for Discounts!)
            </p>

            {/* Power Meter */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${powerLevel}%` }}
              ></div>
            </div>
            <p className="text-blue-400 text-sm">Cosmic Power: {powerLevel.toFixed(0)}% (Charging!)</p>

            {/* Transcendence */}
            <button 
              onClick={enterTranscendence}
              className="bg-violet-500 hover:bg-violet-700 text-white px-3 py-1 rounded mt-4"
            >
              Transcend Reality (Fullscreen VR Mode)
            </button>
            {/* Note: Exit fullscreen resets transform. */}

            {/* Button to copy embed code */}
            <button onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/embed/product/${selectedProduct.id}"></iframe>`)}>
              Copy Embed Code
            </button>

            {/* Assume /embed route in api for iframe content. */}
          </DialogContent>
        </Dialog>
      )}
      {showP2P && <P2PShopping peerId="demo" />}
      <P2PTrade />
      <video ref={videoElement} style={{ display: 'none' }} />
      <div className="mt-8">
        <StoryFeed />
      </div>
      <AIContentGenerator />
      <MLRecommender userPreferences={['tech', 'cyberpunk']} />
      <GestureControl />
      <ONNXModel />

      {showHub && createPortal(
        <div className="fixed inset-0 bg-black/80 flex center">
          <div className="bg-gray-900 p-6">
            <h2>Omniverse Hub</h2>
            <button onClick={() => timeTravel(selectedProduct)}>Time Travel</button>
            {/* Links to other features */}
            <button onClick={() => setShowHub(false)}>Close</button>
          </div>
        </div>,
        document.body
      )}
      {/* Button: <button onClick={() => setShowHub(true)}>Open Nexus Hub</button> */}
    </div>
  );
}