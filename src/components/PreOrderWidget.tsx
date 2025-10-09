import React, { useState } from 'react';
import { Clock, Bell, Package, Calendar, CreditCard, Check } from 'lucide-react';

/**
 * 🎯 PRE-ORDER SYSTEM
 * 
 * Impact: Sell before you have stock
 * Apple makes BILLIONS from pre-orders
 * 
 * Use Cases:
 * - New product launches
 * - Limited editions
 * - Out of stock items
 * - Upcoming releases
 * 
 * Features:
 * - Pre-order with deposit or full payment
 * - Expected delivery date
 * - Email notification when available
 * - Pre-order discount incentive
 * - Waitlist management
 */

interface PreOrderWidgetProps {
  productId: string;
  productName: string;
  productPrice: number;
  expectedDeliveryDate: Date;
  depositPercentage?: number;
  preOrderDiscount?: number;
  limitedQuantity?: number;
  onPreOrder?: (data: PreOrderData) => void;
}

interface PreOrderData {
  productId: string;
  email: string;
  quantity: number;
  paymentType: 'full' | 'deposit';
}

export function PreOrderWidget({
  productId,
  productName,
  productPrice,
  expectedDeliveryDate,
  depositPercentage = 20,
  preOrderDiscount = 10,
  limitedQuantity,
  onPreOrder
}: PreOrderWidgetProps) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [hasPreOrdered, setHasPreOrdered] = useState(false);

  const discountedPrice = productPrice * (1 - preOrderDiscount / 100);
  const depositAmount = productPrice * (depositPercentage / 100);
  const remainingAmount = productPrice - depositAmount;

  const handlePreOrder = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const preOrderData: PreOrderData = {
      productId,
      email,
      quantity,
      paymentType
    };

    // Send to backend
    try {
      const response = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preOrderData)
      });

      if (response.ok) {
        setHasPreOrdered(true);
        
        if (onPreOrder) {
          onPreOrder(preOrderData);
        }

        // Track pre-order
        if (window.gtag) {
          window.gtag('event', 'pre_order_placed', {
            event_category: 'ecommerce',
            event_label: productName,
            value: paymentType === 'full' ? discountedPrice : depositAmount
          });
        }
      }
    } catch (error) {
      console.error('Pre-order error:', error);
      alert('Failed to process pre-order. Please try again.');
    }
  };

  if (hasPreOrdered) {
    return (
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-xl p-6 text-center">
        <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Pre-Order Confirmed! 🎉
        </h3>
        <p className="text-gray-300 mb-4">
          We'll email you at <span className="text-cyan-400 font-medium">{email}</span> when your order ships
        </p>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Expected Delivery:</p>
          <p className="text-white font-bold text-lg">
            {expectedDeliveryDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-2 border-orange-500 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Pre-Order Now</h3>
          <p className="text-orange-400 text-sm font-semibold">
            Save {preOrderDiscount}% - Limited Availability
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-400 text-sm">Expected Delivery:</span>
        </div>
        <p className="text-white font-bold text-lg">
          {expectedDeliveryDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Limited Quantity Alert */}
      {limitedQuantity && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
          <p className="text-red-400 font-semibold text-center">
            🔥 Only {limitedQuantity} pre-orders available!
          </p>
        </div>
      )}

      {/* Payment Options */}
      <div className="space-y-3 mb-4">
        <label className={`flex items-start gap-3 bg-gray-800/50 border-2 rounded-lg p-4 cursor-pointer transition-all ${
          paymentType === 'full'
            ? 'border-green-500 ring-2 ring-green-500/30'
            : 'border-gray-600 hover:border-green-500/50'
        }`}>
          <input
            type="radio"
            name="paymentType"
            checked={paymentType === 'full'}
            onChange={() => setPaymentType('full')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-white font-semibold">Pay in Full</span>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                Save {preOrderDiscount}%
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Secure your order now and save {preOrderDiscount}%
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 line-through">${productPrice.toFixed(2)}</span>
              <span className="text-green-400 font-bold text-xl">${discountedPrice.toFixed(2)}</span>
            </div>
          </div>
        </label>

        <label className={`flex items-start gap-3 bg-gray-800/50 border-2 rounded-lg p-4 cursor-pointer transition-all ${
          paymentType === 'deposit'
            ? 'border-cyan-500 ring-2 ring-cyan-500/30'
            : 'border-gray-600 hover:border-cyan-500/50'
        }`}>
          <input
            type="radio"
            name="paymentType"
            checked={paymentType === 'deposit'}
            onChange={() => setPaymentType('deposit')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-semibold">Pay Deposit</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Reserve with {depositPercentage}% deposit, pay rest before shipping
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Deposit today:</span>
                <span className="text-cyan-400 font-bold">${depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pay before shipping:</span>
                <span className="text-gray-300">${remainingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="text-gray-300 text-sm font-semibold mb-2 block">
          Email for Updates:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
          required
        />
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <label className="text-gray-300 text-sm font-semibold mb-2 block">
          Quantity:
        </label>
        <input
          type="number"
          min="1"
          max={limitedQuantity || 10}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Pre-Order Button */}
      <button
        onClick={handlePreOrder}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5" />
        <span>Pre-Order Now - Save {preOrderDiscount}%</span>
      </button>

      {/* Benefits */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <Check className="w-3 h-3 text-green-400" />
          <span>Guaranteed delivery</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Check className="w-3 h-3 text-green-400" />
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Check className="w-3 h-3 text-green-400" />
          <span>Best price guarantee</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Check className="w-3 h-3 text-green-400" />
          <span>Email updates</span>
        </div>
      </div>

      {/* Trust Message */}
      <p className="mt-4 text-center text-xs text-gray-500">
        🔒 Secure payment • Cancel anytime • No commitment
      </p>
    </div>
  );
}

// Waiting List / Notify When Available
export function NotifyWhenAvailable({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = async () => {
    if (!email) return;

    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email })
      });

      setSubscribed(true);

      if (window.gtag) {
        window.gtag('event', 'waitlist_joined', {
          event_category: 'engagement',
          event_label: productId
        });
      }
    } catch (error) {
      console.error('Waitlist error:', error);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
        <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-semibold">You're on the list!</p>
        <p className="text-gray-400 text-sm">We'll email you when {productName} is back in stock</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-cyan-400" />
        <h4 className="text-white font-semibold">Notify Me When Available</h4>
      </div>
      
      <p className="text-gray-400 text-sm mb-3">
        Get an email as soon as {productName} is back in stock
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleNotify}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          Notify Me
        </button>
      </div>
    </div>
  );
}

export default PreOrderWidget;

