import React, { useState, useEffect } from 'react';
import { Video, ShoppingCart, Heart, MessageCircle, Users, Zap } from 'lucide-react';

/**
 * 📺 LIVE SHOPPING (Like TikTok Shop + QVC)
 * Sell products via live video
 * TikTok makes $30M/day partly from this!
 * Conversion rate: 30%! (vs 3% normal)
 */

export const LiveShopping: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(3421);
  const [comments, setComments] = useState([
    { user: 'Sarah', text: 'Love this! 😍', time: '2s ago' },
    { user: 'Mike', text: 'Just ordered! 🛒', time: '5s ago' },
    { user: 'Emma', text: 'What colors available?', time: '10s ago' }
  ]);
  const [hasPreOrdered, setHasPreOrdered] = useState(false);

  const handlePreOrder = () => {
    setHasPreOrdered(true);
    // Add to cart logic would go here
  };

  useEffect(() => {
    if (isLive) {
      // Simulate live activity
      const interval = setInterval(() => {
        setViewers(prev => prev + Math.floor(Math.random() * 10) - 3);
        setLikes(prev => prev + Math.floor(Math.random() * 5));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border-2 border-red-500 rounded-xl p-6 my-8">
      {/* Live Badge */}
      {isLive && (
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-red-400 font-bold">LIVE NOW</span>
          <Users className="w-4 h-4 text-gray-400 ml-auto" />
          <span className="text-white">{viewers.toLocaleString()} watching</span>
        </div>
      )}

      <div className="text-center mb-6">
        <Video className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">
          📺 Live Shopping Show
        </h2>
        <p className="text-gray-300">
          Watch live demos, ask questions, buy instantly!
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="bg-black rounded-xl aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative text-center">
          <Video className="w-20 h-20 text-red-400 mx-auto mb-3" />
          <p className="text-white font-bold text-lg">Live Product Demo</p>
          <p className="text-gray-400 text-sm">Showing: Neural Headset</p>
        </div>

        {/* Live Interactions */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/80 backdrop-blur rounded-lg p-3 max-h-32 overflow-y-auto">
            {comments.map((comment, i) => (
              <div key={i} className="text-sm mb-1">
                <span className="text-cyan-400 font-semibold">{comment.user}:</span>
                <span className="text-white ml-2">{comment.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg py-3 flex flex-col items-center gap-1 transition-all">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-white text-sm font-semibold">{likes.toLocaleString()}</span>
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 rounded-lg py-3 flex flex-col items-center gap-1 transition-all">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <span className="text-white text-sm font-semibold">Comment</span>
        </button>
        <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-500 rounded-lg py-3 flex flex-col items-center gap-1 transition-all">
          <Users className="w-5 h-5 text-green-400" />
          <span className="text-white text-sm font-semibold">Share</span>
        </button>
      </div>

      {/* Buy Button */}
      <button
        onClick={handlePreOrder}
        disabled={hasPreOrdered}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          hasPreOrdered
            ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
            : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transform hover:scale-105'
        }`}
      >
        {hasPreOrdered ? (
          <span>✅ Added to Cart - Continue Shopping</span>
        ) : (
          <span>🛒 Buy Now - Live Special Price!</span>
        )}
      </button>

      {/* Stats */}
      <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-center">
        <p className="text-yellow-300 text-sm font-semibold">
          🔥 {Math.floor(Math.random() * 20) + 10} people bought during this live show!
        </p>
      </div>

      {/* Impact */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-blue-300 text-xs text-center">
          💡 Live shopping converts at 30% (vs 3% normal) - 10x better!
        </p>
      </div>
    </div>
  );
};

export default LiveShopping;
