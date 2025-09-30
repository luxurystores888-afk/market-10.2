import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Zap, Box, Glasses } from 'lucide-react';
import { formatPrice } from '../utils/price';
import { HolographicProductDisplay } from './HolographicProductDisplay';
import { ARVRExperience } from './ARVRExperience';
import Product3DViewer from './Product3DViewer';
import { Link } from 'react-router-dom';

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [show3D, setShow3D] = useState(false);
  const [showARVR, setShowARVR] = useState(false);

  const handleOpen3D = () => {
    setShow3D(true);
  };

  const handleClose3D = () => {
    setShow3D(false);
  };

  async function subscribeToRestock(productId: string) {
    const subscription = await navigator.serviceWorker.ready.then(reg => reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: 'vapidPublicKey' }));
    await fetch('/api/subscribe-restock', { method: 'POST', body: JSON.stringify({ productId, subscription }) });
  }

  return (
    <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden">
        {product.imageUrl ? (
          <Link to={`/product/${product.id}`}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap className="h-16 w-16 text-cyan-400/50" />
          </div>
        )}
        
        {/* Desktop Hover Actions */}
        <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center space-x-2">
          <button
            onClick={handleOpen3D}
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/40 hover:to-purple-500/40 border border-cyan-400 text-cyan-400 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="3D Holographic View"
          >
            <Box className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowARVR(true)}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 border border-purple-400 text-purple-400 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="AR/VR Experience"
          >
            <Glasses className="h-4 w-4" />
          </button>
          <button
            onClick={() => onQuickView?.(product.id)}
            className="bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-400 p-2 rounded-lg transition-colors"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-400 p-2 rounded-lg transition-colors" title="Add to Wishlist">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Action Buttons - Always Visible with Touch-Friendly Size */}
        <div className="md:hidden absolute top-2 right-2 flex flex-col space-y-1">
          <button
            onClick={handleOpen3D}
            className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 p-3 rounded-lg touch-manipulation transition-all duration-200 active:scale-95 touch-target"
            title="3D View"
          >
            <Box className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowARVR(true)}
            className="bg-black/80 backdrop-blur-sm border border-purple-400/60 text-purple-400 p-3 rounded-lg touch-manipulation transition-all duration-200 active:scale-95 touch-target"
            title="AR/VR"
          >
            <Glasses className="h-5 w-5" />
          </button>
          <button
            onClick={() => onQuickView?.(product.id)}
            className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 p-3 rounded-lg touch-manipulation transition-all duration-200 active:scale-95 touch-target"
            title="Quick View"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-2 left-2 bg-purple-500/90 text-white px-2 py-1 rounded text-xs">
            {product.category}
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          {product.stock > 0 ? (
            <span className="bg-green-500/90 text-white px-2 py-1 rounded text-xs">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500/90 text-white px-2 py-1 rounded text-xs">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-24 object-cover rounded-md mb-2"
          />
        </Link>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              ${formatPrice(product.price)}
            </span>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleOpen3D}
              className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border border-purple-400 text-purple-400 px-2 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 transform hover:scale-105"
              title="3D View"
            >
              <Box className="h-3 w-3" />
              <span className="text-xs">3D</span>
            </button>
            <button
              onClick={() => setShowARVR(true)}
              className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/40 hover:to-purple-500/40 border border-pink-400 text-pink-400 px-2 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 transform hover:scale-105"
              title="AR/VR"
            >
              <Glasses className="h-3 w-3" />
              <span className="text-xs">AR</span>
            </button>
            <button
              onClick={() => onAddToCart?.(product.id)}
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Add</span>
            </button>
          </div>
          
          {/* Mobile Actions - Touch-Friendly Add to Cart */}
          <div className="md:hidden">
            <button
              onClick={() => onAddToCart?.(product.id)}
              disabled={product.stock === 0}
              className="mobile-button bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white flex items-center space-x-2 transition-all duration-200 disabled:cursor-not-allowed active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-base font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Advanced 3D Product Viewer Modal */}
      {show3D && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-cyan-500/30 flex justify-between items-center">
              <h3 className="text-xl font-bold text-cyan-400">3D Product Viewer - {product.name}</h3>
              <button
                onClick={handleClose3D}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="h-[70vh]">
              <Product3DViewer
                productId={product.id}
                title={product.name}
                enableAR={true}
                enableVR={true}
                enableCustomization={true}
                showHolographicEffect={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* AR/VR Experience Modal */}
      <ARVRExperience
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          category: product.category || 'Unknown',
          imageUrl: product.imageUrl
        }}
        isOpen={showARVR}
        onClose={() => setShowARVR(false)}
      />
    </div>
  );
}