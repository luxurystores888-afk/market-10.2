import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Zap, Shield, Cpu, Rocket, Sparkles, Eye, Camera, Scan } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'; // Assuming shadcn/ui or similar

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

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

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

  // TODO: Implement cart functionality
  const addToCart = (product: Product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...currentCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log(`Added ${product.name} to cart`);
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 star-field lightning-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}