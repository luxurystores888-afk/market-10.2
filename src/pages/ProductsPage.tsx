import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Filter, SortAsc } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import handTrack from 'handtrackjs';
import { P2PShopping } from '../components/P2PShopping';
import { P2PTrade } from '../components/P2PTrade';

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
  };

  const handleQuickView = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
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

            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              loading={loading}
            />
          </div>
        </div>
      </div>
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-64 object-cover mb-4" />
            <DialogDescription>{selectedProduct.description}</DialogDescription>
            <p className="text-2xl font-bold mt-4">${selectedProduct.price.toFixed(2)}</p>
            <button onClick={() => { handleAddToCart(selectedProduct.id); setSelectedProduct(null); }} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </DialogContent>
        </Dialog>
      )}
      {showP2P && <P2PShopping peerId="demo" />}
      <P2PTrade />
      <video ref={videoElement} style={{ display: 'none' }} />
    </div>
  );
}