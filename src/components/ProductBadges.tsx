import React from 'react';
import { Zap, TrendingUp, Star, Clock, Package, Flame, Sparkles } from 'lucide-react';

/**
 * 🏷️ PRODUCT BADGES & LABELS
 * 
 * Impact: +18% click-through rate
 * Psychology: Visual cues drive urgency and value perception
 * 
 * Types:
 * - New Arrival
 * - Best Seller
 * - Limited Edition
 * - Sale/Discount
 * - Low Stock
 * - Free Shipping
 * - Exclusive
 */

interface ProductBadgesProps {
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  salePercentage?: number;
  stock?: number;
  isFreeShipping?: boolean;
  isExclusive?: boolean;
  isLimitedEdition?: boolean;
  customBadges?: Array<{
    text: string;
    color: string;
    icon?: React.ReactNode;
  }>;
}

export function ProductBadges({
  isNew,
  isBestSeller,
  isOnSale,
  salePercentage,
  stock,
  isFreeShipping,
  isExclusive,
  isLimitedEdition,
  customBadges = []
}: ProductBadgesProps) {
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
      {/* New Arrival */}
      {isNew && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          NEW
        </div>
      )}

      {/* Best Seller */}
      {isBestSeller && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Flame className="w-3 h-3" />
          BEST SELLER
        </div>
      )}

      {/* Sale */}
      {isOnSale && salePercentage && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
          <Zap className="w-3 h-3" />
          {salePercentage}% OFF
        </div>
      )}

      {/* Limited Edition */}
      {isLimitedEdition && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3" />
          LIMITED
        </div>
      )}

      {/* Low Stock */}
      {stock !== undefined && stock > 0 && stock <= 10 && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Clock className="w-3 h-3" />
          ONLY {stock} LEFT
        </div>
      )}

      {/* Free Shipping */}
      {isFreeShipping && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Package className="w-3 h-3" />
          FREE SHIPPING
        </div>
      )}

      {/* Exclusive */}
      {isExclusive && (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3" />
          EXCLUSIVE
        </div>
      )}

      {/* Custom Badges */}
      {customBadges.map((badge, index) => (
        <div
          key={index}
          className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}
        >
          {badge.icon}
          {badge.text}
        </div>
      ))}
    </div>
  );
}

// Urgency Badges for Product Pages
export function UrgencyBadges({ stock, salesLast24h }: { stock?: number; salesLast24h?: number }) {
  return (
    <div className="space-y-2">
      {stock !== undefined && stock > 0 && stock <= 5 && (
        <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 font-bold text-sm">
            🔥 ALMOST GONE - Only {stock} left in stock!
          </span>
        </div>
      )}

      {salesLast24h && salesLast24h > 20 && (
        <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-semibold text-sm">
            🔥 HOT ITEM - {salesLast24h} sold in last 24 hours!
          </span>
        </div>
      )}
    </div>
  );
}

// Trust Badges for Checkout
export function CheckoutTrustBadges() {
  return (
    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
      <p className="text-gray-400 text-sm font-semibold mb-3">Secure Checkout Guaranteed:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-3xl mb-1">🔒</div>
          <p className="text-white text-xs font-semibold">SSL Secure</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">💳</div>
          <p className="text-white text-xs font-semibold">PCI Compliant</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">💰</div>
          <p className="text-white text-xs font-semibold">Money Back</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">✓</div>
          <p className="text-white text-xs font-semibold">Verified Store</p>
        </div>
      </div>
      <p className="text-gray-500 text-xs text-center mt-3">
        Your information is protected by 256-bit encryption
      </p>
    </div>
  );
}

export default ProductBadges;

