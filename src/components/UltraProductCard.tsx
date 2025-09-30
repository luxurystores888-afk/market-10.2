// 🌟 ULTRA-ATTRACTIVE PRODUCT CARD - MAXIMUM VISUAL IMPACT
import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Zap, Box, Glasses, Star, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/price';

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

interface UltraProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export function UltraProductCard({ product, onAddToCart, onQuickView }: UltraProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [showARVR, setShowARVR] = useState(false);

  return (
    <div 
      className="ultra-glow-card holographic particle-system group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Glowing Border Effect */}
      <div className="rainbow-border">
        <div className="bg-black/80 backdrop-blur-lg rounded-lg overflow-hidden">
          
          {/* Product Image with Effects */}
          <div className="relative aspect-square bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden electric-grid">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? 'scale-110 brightness-110 saturate-150' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center vortex-effect">
                <Zap className="h-16 w-16 text-cyan-400 ultra-text-glow" />
              </div>
            )}
            
            {/* Holographic Overlay */}
            <div className="absolute inset-0 holographic opacity-20"></div>
            
            {/* Interactive Hover Effects */}
            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-4 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={() => setShow3D(true)}
                className="ultra-button flame-button text-white p-3 rounded-full transform hover:scale-125 transition-all"
                title="3D Holographic View"
              >
                <Box className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => setShowARVR(true)}
                className="ultra-button bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full transform hover:scale-125 transition-all"
                title="AR/VR Experience"
              >
                <Glasses className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => onQuickView?.(product.id)}
                className="ultra-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-full transform hover:scale-125 transition-all"
                title="Quick View"
              >
                <Eye className="h-6 w-6" />
              </button>
            </div>

            {/* Category Badge with Glow */}
            {product.category && (
              <div className="absolute top-3 left-3 bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold cyber-glow crystalline-border">
                {product.category}
              </div>
            )}

            {/* Stock Status with Animation */}
            <div className="absolute top-3 right-3">
              {product.stock > 0 ? (
                <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold cyber-glow animate-pulse">
                  ✅ In Stock ({product.stock})
                </span>
              ) : (
                <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold cyber-glow">
                  ❌ Out of Stock
                </span>
              )}
            </div>

            {/* Special Effects for Premium Products */}
            {(product.price as number) > 5000 && (
              <div className="absolute bottom-3 left-3 fire-effect">
                <span className="bg-yellow-500/90 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>PREMIUM</span>
                </span>
              </div>
            )}
          </div>

          {/* Product Info with Enhanced Typography */}
          <div className="p-6 space-y-4">
            
            {/* Product Name with Glow */}
            <h3 className="text-xl font-bold text-white ultra-text-glow line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {product.name}
            </h3>
            
            {/* Description with Fade Effect */}
            <p className="text-gray-300 text-sm line-clamp-3 group-hover:text-gray-200 transition-colors">
              {product.description}
            </p>
            
            {/* Enhanced Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all cursor-pointer ultra-interactive"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price with Ultra Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 ultra-text-glow">
                  ${formatPrice(product.price)}
                </div>
                {(product.price as number) > 1000 && (
                  <div className="text-xs text-yellow-400 flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>High Value Item</span>
                  </div>
                )}
              </div>
              
              {/* Ultra Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="ultra-button bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-400 p-2 rounded-lg transition-all transform hover:scale-110 crosshair-target">
                  <Heart className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => onAddToCart?.(product.id)}
                  disabled={product.stock === 0}
                  className="ultra-button flame-button disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-semibold transform hover:scale-105 transition-all disabled:cursor-not-allowed rocket-trail"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Power Level Indicator */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="sound-wave">
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                </div>
                <span className="text-cyan-400">Power Level: MAXIMUM</span>
              </div>
              
              <div className="flex items-center space-x-1 text-yellow-400">
                <Zap className="h-3 w-3" />
                <span>Cyberpunk Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading States */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="tornado-loader absolute top-4 right-4"></div>
        </div>
      )}
    </div>
  );
}
