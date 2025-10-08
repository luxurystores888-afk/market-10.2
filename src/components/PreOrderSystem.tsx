import React, { useState } from 'react';
import { Clock, TrendingUp, Users, Zap } from 'lucide-react';

/**
 * 📦 PRE-ORDER SYSTEM (Like Apple)
 * Generate revenue BEFORE product arrives!
 * Creates hype, collects emails, validates demand
 * 
 * Apple makes BILLIONS from pre-orders before launch!
 */

export const PreOrderSystem: React.FC<{ productId: string }> = ({ productId }) => {
  const [preOrderCount, setPreOrderCount] = useState(1247); // Demo
  const [daysLeft, setDaysLeft] = useState(15);
  const [hasPreOrdered, setHasPreOrdered] = useState(false);

  const handlePreOrder = () => {
    setHasPreOrdered(true);
    setPreOrderCount(prev => prev + 1);
    
    // Vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Success notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Pre-Order Confirmed!', {
        body: 'You\'ll be among the first to receive this product!',
        icon: '/icon-192x192.png'
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500 rounded-xl p-6 my-6">
      {/* Pre-Order Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm">
          🎯 PRE-ORDER - Coming Soon!
        </div>
        <div className="text-gray-300 text-sm">
          <Clock className="w-4 h-4 inline mr-1" />
          Ships in {daysLeft} days
        </div>
      </div>

      {/* Hype Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/50 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{preOrderCount.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Pre-Orders</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-pink-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">
            {Math.floor(preOrderCount / daysLeft)}
          </div>
          <div className="text-xs text-gray-400">Orders/Day</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3 text-center">
          <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">#{Math.floor(Math.random() * 5) + 1}</div>
          <div className="text-xs text-gray-400">Trending</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Stock Reserved:</span>
          <span>{Math.floor((preOrderCount / 2000) * 100)}% of batch</span>
        </div>
        <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
            style={{ width: `${Math.floor((preOrderCount / 2000) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Pre-Order Button */}
      {!hasPreOrdered ? (
        <button
          onClick={handlePreOrder}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
        >
          🎯 Pre-Order Now - Be Among First!
        </button>
      ) : (
        <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 text-center">
          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-bold">Pre-Order Confirmed!</p>
          <p className="text-gray-300 text-sm mt-1">You're #{preOrderCount} in line</p>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400">✅</span>
          <span>Guaranteed earliest delivery</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400">✅</span>
          <span>Exclusive pre-order discount</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400">✅</span>
          <span>No charge until it ships</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400">✅</span>
          <span>Cancel anytime before shipping</span>
        </div>
      </div>

      {/* Social Proof */}
      <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
        <p className="text-yellow-300 text-sm text-center">
          🔥 {Math.floor(Math.random() * 50) + 20} people pre-ordered in the last hour!
        </p>
      </div>
    </div>
  );
};

export default ProductQA;
