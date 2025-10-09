import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Zap, Shield, TrendingUp, Star, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🏠 CLEAN HOME PAGE - Professional & Focused
 * 
 * Simple, effective, conversion-optimized
 * No fluff, just results!
 */

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
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8&featured=true');
      const data = await response.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback products
      setFeaturedProducts([
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality audio with active noise cancellation',
          price: 299.99,
          category: 'Electronics',
          stock: 50,
          tags: ['Audio', 'Premium']
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          description: 'Track your health and fitness goals',
          price: 199.99,
          category: 'Wearables',
          stock: 100,
          tags: ['Fitness', 'Smart']
        },
        {
          id: '3',
          name: 'Laptop Stand Pro',
          description: 'Ergonomic aluminum laptop stand',
          price: 79.99,
          category: 'Accessories',
          stock: 200,
          tags: ['Office', 'Ergonomic']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section - Clean & Powerful */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 animate-fade-in">
            Welcome to Pulse
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your next-generation e-commerce platform with AI-powered shopping and zero transaction fees
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/pay-when-profit')}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border-2 border-green-500 text-green-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              💰 Pay When You Profit
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>0% Transaction Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Crypto Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>AI Shopping Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Secure & Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-gray-900/50 to-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                {stats.products || '1000+'}
              </div>
              <div className="text-gray-400">Products Available</div>
            </div>
            
            <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {stats.customers || '10K+'}
              </div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            
            <div className="bg-gray-800/50 border border-pink-500/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-pink-400 mb-2">
                {stats.orders || '50K+'}
              </div>
              <div className="text-gray-400">Orders Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Only REAL Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose Pulse?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500 transition-all">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-lg w-fit mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Optimized performance with instant page loads and smooth checkout experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-8 hover:border-purple-500 transition-all">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg w-fit mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Bank-Level Security
              </h3>
              <p className="text-gray-400">
                Enterprise-grade security with encrypted payments and fraud protection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-8 hover:border-green-500 transition-all">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg w-fit mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Zero Fees
              </h3>
              <p className="text-gray-400">
                Accept crypto payments with 0% transaction fees using BTCPay Server.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gradient-to-r from-black to-gray-900/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white">
              Featured Products
            </h2>
            <button
              onClick={() => navigate('/products')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            onAddToCart={(productId) => {
              const product = featuredProducts.find(p => p.id === productId);
              if (product) addToCart(product);
            }}
            onQuickView={(productId) => navigate(`/product/${productId}`)}
            loading={loading}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Best e-commerce experience I've had. Fast, secure, and the AI assistant actually helps!"
              </p>
              <div className="text-cyan-400 font-semibold">Sarah M.</div>
              <div className="text-gray-500 text-sm">Verified Customer</div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Zero transaction fees with crypto payments is a game changer. Highly recommend!"
              </p>
              <div className="text-cyan-400 font-semibold">John D.</div>
              <div className="text-gray-500 text-sm">Verified Customer</div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Lightning fast checkout and excellent customer service. Will buy again!"
              </p>
              <div className="text-cyan-400 font-semibold">Emily R.</div>
              <div className="text-gray-500 text-sm">Verified Customer</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the future of e-commerce
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
          >
            Browse Products Now
          </button>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-400 hover:text-cyan-400 transition-colors">About Us</a>
                <a href="/contact" className="block text-gray-400 hover:text-cyan-400 transition-colors">Contact</a>
                <a href="/careers" className="block text-gray-400 hover:text-cyan-400 transition-colors">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="/help" className="block text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a>
                <a href="/shipping" className="block text-gray-400 hover:text-cyan-400 transition-colors">Shipping Info</a>
                <a href="/returns" className="block text-gray-400 hover:text-cyan-400 transition-colors">Returns</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/terms" className="block text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a>
                <a href="/privacy" className="block text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="/refund" className="block text-gray-400 hover:text-cyan-400 transition-colors">Refund Policy</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-cyan-400 transition-colors">Twitter</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-cyan-400 transition-colors">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-cyan-400 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Pulse. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
