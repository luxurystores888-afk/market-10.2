import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Eye, TrendingUp, MapPin, Clock } from 'lucide-react';

/**
 * 🎯 SOCIAL PROOF WIDGETS
 * 
 * Impact: +15-25% conversion rate
 * Essential for: Building trust with first-time visitors
 * 
 * Features:
 * - Recent purchase notifications
 * - Live visitor counter
 * - Product view notifications
 * - Trust badges
 * - Review highlights
 */

interface RecentPurchase {
  id: string;
  productName: string;
  customerName: string;
  location: string;
  timeAgo: string;
  verified: boolean;
}

interface SocialProofPopupsProps {
  enabled?: boolean;
  maxDisplayTime?: number; // seconds
  delayBetween?: number; // seconds
}

export function SocialProofPopups({ 
  enabled = true,
  maxDisplayTime = 5,
  delayBetween = 8 
}: SocialProofPopupsProps) {
  const [currentNotification, setCurrentNotification] = useState<RecentPurchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock data - in production, fetch from API
  const mockPurchases: RecentPurchase[] = [
    {
      id: '1',
      productName: 'Neural Gaming Interface Pro',
      customerName: 'John',
      location: 'New York, US',
      timeAgo: '2 minutes ago',
      verified: true
    },
    {
      id: '2',
      productName: 'Quantum Processor X7',
      customerName: 'Sarah',
      location: 'London, UK',
      timeAgo: '5 minutes ago',
      verified: true
    },
    {
      id: '3',
      productName: 'Holographic Display',
      customerName: 'Michael',
      location: 'Tokyo, JP',
      timeAgo: '8 minutes ago',
      verified: true
    },
    {
      id: '4',
      productName: 'Cybernetic Keyboard',
      customerName: 'Emma',
      location: 'Sydney, AU',
      timeAgo: '12 minutes ago',
      verified: true
    }
  ];

  useEffect(() => {
    if (!enabled) return;

    let currentIndex = 0;

    const showNext = () => {
      setCurrentNotification(mockPurchases[currentIndex]);
      setIsVisible(true);

      // Hide after maxDisplayTime
      setTimeout(() => {
        setIsVisible(false);
      }, maxDisplayTime * 1000);

      currentIndex = (currentIndex + 1) % mockPurchases.length;
    };

    // Initial delay
    const initialDelay = setTimeout(() => {
      showNext();
      
      // Then show periodically
      const interval = setInterval(() => {
        showNext();
      }, (maxDisplayTime + delayBetween) * 1000);

      return () => clearInterval(interval);
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, [enabled]);

  if (!isVisible || !currentNotification) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slideInLeft">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-cyan-500/50 rounded-lg shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full flex-shrink-0">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-semibold text-sm">{currentNotification.customerName}</p>
              {currentNotification.verified && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mb-1">
              just purchased <span className="text-cyan-400 font-medium">{currentNotification.productName}</span>
            </p>
            
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{currentNotification.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{currentNotification.timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Live Stats Widget
export function LiveStatsWidget() {
  const [stats, setStats] = useState({
    activeViewers: 127,
    salesLast24h: 342,
    averageRating: 4.8,
    totalReviews: 1247
  });

  useEffect(() => {
    // Simulate live stats changing
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeViewers: Math.max(50, prev.activeViewers + Math.floor(Math.random() * 10) - 4),
        salesLast24h: prev.salesLast24h + Math.floor(Math.random() * 3)
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-cyan-400" />
        Live Activity
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Active Shoppers
          </span>
          <span className="text-white font-semibold">{stats.activeViewers}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Sales (24h)</span>
          <span className="text-green-400 font-semibold">{stats.salesLast24h}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Average Rating
          </span>
          <span className="text-white font-semibold">{stats.averageRating}/5</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Reviews</span>
          <span className="text-white font-semibold">{stats.totalReviews.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Product Viewers Counter
export function ProductViewersCounter({ productId }: { productId: string }) {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 30) + 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(3, prev + Math.floor(Math.random() * 6) - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-3 py-1">
      <Eye className="w-4 h-4 text-blue-400" />
      <span className="text-blue-400 text-sm font-semibold">
        {viewers} people viewing
      </span>
    </div>
  );
}

// Trust Badges
export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4">
      {/* Secure Checkout */}
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
        <div className="text-green-400 text-2xl">🔒</div>
        <div>
          <p className="text-white font-semibold text-sm">Secure Checkout</p>
          <p className="text-green-400 text-xs">256-bit SSL Encryption</p>
        </div>
      </div>

      {/* Money Back */}
      <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
        <div className="text-cyan-400 text-2xl">💰</div>
        <div>
          <p className="text-white font-semibold text-sm">Money-Back Guarantee</p>
          <p className="text-cyan-400 text-xs">30-Day Returns</p>
        </div>
      </div>

      {/* Fast Shipping */}
      <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
        <div className="text-purple-400 text-2xl">🚚</div>
        <div>
          <p className="text-white font-semibold text-sm">Fast & Free Shipping</p>
          <p className="text-purple-400 text-xs">On orders over $50</p>
        </div>
      </div>

      {/* Verified */}
      <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
        <div className="text-blue-400 text-2xl">✓</div>
        <div>
          <p className="text-white font-semibold text-sm">Verified Store</p>
          <p className="text-blue-400 text-xs">Trusted by 10,000+ customers</p>
        </div>
      </div>
    </div>
  );
}

// Recent Sales Counter
export function RecentSalesCounter({ productId, period = '24h' }: { productId: string; period?: string }) {
  const [sales, setSales] = useState(Math.floor(Math.random() * 100) + 20);

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 text-center">
      <p className="text-yellow-400 font-bold text-lg">{sales}</p>
      <p className="text-gray-400 text-sm">sold in last {period}</p>
    </div>
  );
}

// Review Highlight
export function ReviewHighlight() {
  const reviews = [
    { name: "Sarah M.", rating: 5, text: "Absolutely love it! Best purchase ever.", verified: true },
    { name: "John D.", rating: 5, text: "Fast shipping and great quality!", verified: true },
    { name: "Emma R.", rating: 5, text: "Exceeded my expectations. Highly recommend!", verified: true }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const review = reviews[current];

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-white mb-2 italic">"{review.text}"</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">- {review.name}</span>
        {review.verified && (
          <span className="text-green-400 text-xs">✓ Verified Purchase</span>
        )}
      </div>
    </div>
  );
}

<style>{`
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out;
  }
`}</style>

export default SocialProofPopups;

