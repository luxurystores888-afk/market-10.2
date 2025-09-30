import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, Zap, Wallet, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WalletConnect } from './WalletConnect';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { totalItems } = useCart();
  const { state: web3State } = useWeb3();
  const { state: authState } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = authState.isAuthenticated && authState.user?.role === 'admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileMenu(false); // Close mobile menu after search
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        fetch('/api/notifications/geo', {
          method: 'POST',
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        }).then(res => res.json()).then(data => {
          if (data.notification) alert(data.notification); // Or use toast
        });
      });
    }
  }, []);

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50 cyber-glow lightning-bg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 ultra-text-glow">
              PULSE
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Categories
            </Link>
            <Link to="/performance" className="text-green-400 hover:text-green-300 transition-colors">
              📊 Performance
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-red-400 hover:text-red-300 transition-colors">
                🛡️ Admin
              </Link>
            )}
            {isAdmin && (
              <Link to="/automation" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                🚀 Automation
              </Link>
            )}
            {isAdmin && (
              <Link to="/security" className="text-red-400 hover:text-red-300 transition-colors">
                🛡️ Security
              </Link>
            )}
            <Link to="/ai-assistant" className="text-purple-400 hover:text-purple-300 transition-colors">
              AI Assistant
            </Link>
            <Link to="/infinity" className="text-yellow-400 hover:text-yellow-300 transition-colors animate-pulse">
              ♾️² INFINITY
            </Link>
            <Link to="/code-editor" className="text-green-400 hover:text-green-300 transition-colors">
              🚀 AI CODE EDITOR
            </Link>
            <Link to="/community" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Community
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Contact
            </Link>
            <Link to="/gallery" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Gallery
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 max-w-md">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cyberpunk tech..."
              className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Web3 Wallet Connection */}
            {web3State.isConnected ? (
              <WalletConnect showModal={false} />
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border border-purple-400/50 text-purple-400 hover:text-purple-300 px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                title="Connect Crypto Wallet"
              >
                <Wallet className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Connect</span>
              </button>
            )}
            
            <button className="text-gray-300 hover:text-cyan-400 transition-colors">
              <User className="h-5 w-5" />
            </button>
            <Link to="/cart" className="text-gray-300 hover:text-cyan-400 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-300 hover:text-cyan-400 transition-colors p-2 touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* 📱 Mobile Search Bar - Always Visible on Mobile */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-3">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cyberpunk tech..."
              className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-base"
            />
          </form>
        </div>
      </div>
      
      {/* 📱 Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/30">
          <nav className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block text-cyan-400 hover:text-cyan-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                🏠 Home
              </Link>
              <Link 
                to="/products" 
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-cyan-400 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                📦 Products
              </Link>
              <Link 
                to="/categories" 
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-cyan-400 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                🗂️ Categories
              </Link>
              <Link 
                to="/wishlist" 
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-cyan-400 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                💝 Wishlist
              </Link>
              <Link 
                to="/gaming" 
                onClick={closeMobileMenu}
                className="block text-purple-400 hover:text-purple-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                🎮 Gaming
              </Link>
              <Link 
                to="/performance" 
                onClick={closeMobileMenu}
                className="block text-green-400 hover:text-green-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                📊 Performance
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={closeMobileMenu}
                  className="block text-red-400 hover:text-red-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
                >
                  🛡️ Admin Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/automation" 
                  onClick={closeMobileMenu}
                  className="block text-yellow-400 hover:text-yellow-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
                >
                  🚀 Automation Control
                </Link>
              )}
              <Link 
                to="/ai-assistant" 
                onClick={closeMobileMenu}
                className="block text-purple-400 hover:text-purple-300 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
              >
                🤖 AI Assistant
              </Link>
              
              {/* Mobile-specific actions */}
              <div className="border-t border-cyan-500/30 pt-4 mt-6">
                <div className="text-cyan-400 font-medium mb-3">Quick Actions</div>
                <Link 
                  to="/cart" 
                  onClick={closeMobileMenu}
                  className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Cart ({totalItems} items)
                </Link>
                <Link 
                  to="/profile" 
                  onClick={closeMobileMenu}
                  className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors py-3 px-2 text-lg font-medium touch-manipulation"
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                
                {/* Mobile Wallet Connection */}
                {!web3State.isConnected && (
                  <button
                    onClick={() => {
                      setShowWalletModal(true);
                      closeMobileMenu();
                    }}
                    className="flex items-center bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/50 text-purple-400 py-3 px-4 rounded-lg mt-4 w-full text-lg font-medium touch-manipulation"
                  >
                    <Wallet className="h-5 w-5 mr-3" />
                    Connect Crypto Wallet
                  </button>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
      
      {/* Web3 Wallet Connection Modal */}
      {showWalletModal && (
        <WalletConnect
          showModal={true}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </header>
  );
}