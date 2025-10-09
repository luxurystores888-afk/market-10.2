import React, { useState } from 'react';
import { Package, Calendar, Percent, Check, RefreshCw, X } from 'lucide-react';

/**
 * 📦 SUBSCRIBE & SAVE Component
 * 
 * Impact: 10x customer lifetime value
 * Revenue Model: Recurring revenue = predictable cash flow
 * 
 * Examples:
 * - Dollar Shave Club: $1B acquisition
 * - BarkBox: $378M annual revenue
 * - HelloFresh: $2B annual revenue
 * 
 * Features:
 * - Flexible delivery frequency
 * - Cancel anytime
 * - Skip/pause options
 * - 10-15% discount vs one-time
 */

interface SubscriptionPlan {
  id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly';
  deliveryDays: number;
  discount: number; // percentage
  label: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'weekly',
    frequency: 'weekly',
    deliveryDays: 7,
    discount: 15,
    label: 'Every Week'
  },
  {
    id: 'biweekly',
    frequency: 'biweekly',
    deliveryDays: 14,
    discount: 12,
    label: 'Every 2 Weeks'
  },
  {
    id: 'monthly',
    frequency: 'monthly',
    deliveryDays: 30,
    discount: 10,
    label: 'Every Month'
  },
  {
    id: 'bimonthly',
    frequency: 'bimonthly',
    deliveryDays: 60,
    discount: 8,
    label: 'Every 2 Months'
  },
  {
    id: 'quarterly',
    frequency: 'quarterly',
    deliveryDays: 90,
    discount: 5,
    label: 'Every 3 Months'
  }
];

interface SubscribeAndSaveProps {
  productId: string;
  productName: string;
  basePrice: number;
  onSubscribe?: (plan: SubscriptionPlan) => void;
  compact?: boolean;
}

export function SubscribeAndSave({ 
  productId, 
  productName,
  basePrice, 
  onSubscribe,
  compact = false 
}: SubscribeAndSaveProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(subscriptionPlans[2]); // Default: Monthly
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscription'>('subscription');

  const discountedPrice = basePrice * (1 - selectedPlan.discount / 100);
  const savings = basePrice - discountedPrice;

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(selectedPlan);
    }

    // Track subscription selection
    if (window.gtag) {
      window.gtag('event', 'subscription_selected', {
        event_category: 'subscription',
        event_label: selectedPlan.frequency,
        value: discountedPrice
      });
    }
  };

  if (compact) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={purchaseType === 'subscription'}
            onChange={(e) => setPurchaseType(e.target.checked ? 'subscription' : 'onetime')}
            className="w-4 h-4"
          />
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              Subscribe & Save {selectedPlan.discount}%
            </p>
            <p className="text-gray-400 text-xs">
              ${discountedPrice.toFixed(2)} {selectedPlan.label.toLowerCase()}
            </p>
          </div>
          <span className="text-green-400 font-bold">
            Save ${savings.toFixed(2)}
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Subscribe & Save</h3>
          <p className="text-gray-400 text-sm">Get {selectedPlan.discount}% off and never run out</p>
        </div>
      </div>

      {/* Purchase Type Toggle */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setPurchaseType('onetime')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            purchaseType === 'onetime'
              ? 'bg-gray-700 border-2 border-cyan-500 text-white'
              : 'bg-gray-800/50 border border-gray-600 text-gray-400 hover:border-gray-500'
          }`}
        >
          <p className="text-sm">One-Time Purchase</p>
          <p className="text-lg font-bold">${basePrice.toFixed(2)}</p>
        </button>

        <button
          onClick={() => setPurchaseType('subscription')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all relative ${
            purchaseType === 'subscription'
              ? 'bg-green-700 border-2 border-green-500 text-white'
              : 'bg-gray-800/50 border border-gray-600 text-gray-400 hover:border-gray-500'
          }`}
        >
          {/* Best Value Badge */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            SAVE {selectedPlan.discount}%
          </div>
          <p className="text-sm">Subscribe & Save</p>
          <p className="text-lg font-bold">${discountedPrice.toFixed(2)}</p>
        </button>
      </div>

      {/* Subscription Options */}
      {purchaseType === 'subscription' && (
        <div className="space-y-4">
          {/* Frequency Selector */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 block">
              Delivery Frequency:
            </label>
            <select
              value={selectedPlan.id}
              onChange={(e) => {
                const plan = subscriptionPlans.find(p => p.id === e.target.value);
                if (plan) setSelectedPlan(plan);
              }}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              {subscriptionPlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.label} - Save {plan.discount}%
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Regular Price:</span>
              <span className="text-gray-400 line-through">${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subscription Discount ({selectedPlan.discount}%):</span>
              <span className="text-green-400">-${savings.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between">
              <span className="text-white font-bold">You Pay {selectedPlan.label}:</span>
              <span className="text-green-400 font-bold text-lg">${discountedPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-500/5 rounded-lg p-4">
            <p className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Subscription Benefits:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Save {selectedPlan.discount}% on every delivery</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Free shipping on all subscription orders</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Skip, pause, or cancel anytime</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Manage subscription from your account</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Never run out of {productName}</span>
              </li>
            </ul>
          </div>

          {/* Flexibility Note */}
          <div className="text-center text-sm text-gray-400">
            <p>✨ Full control - modify or cancel anytime from your dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Subscription Management Widget (for user dashboard)
export function SubscriptionManagementWidget() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: '1',
      productName: 'Premium Coffee Beans',
      frequency: 'monthly',
      nextDelivery: '2025-11-09',
      price: 24.99,
      status: 'active'
    }
  ]);

  const skipNextDelivery = (id: string) => {
    console.log('Skipping delivery:', id);
    alert('Next delivery has been skipped');
  };

  const pauseSubscription = (id: string) => {
    setSubscriptions(subs =>
      subs.map(sub =>
        sub.id === id ? { ...sub, status: 'paused' } : sub
      )
    );
    alert('Subscription paused');
  };

  const cancelSubscription = (id: string) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      setSubscriptions(subs => subs.filter(sub => sub.id !== id));
      alert('Subscription cancelled');
    }
  };

  return (
    <div className="space-y-4">
      {subscriptions.map(sub => (
        <div key={sub.id} className="bg-gray-800/50 border border-green-500/30 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-white font-bold">{sub.productName}</h4>
              <p className="text-gray-400 text-sm capitalize">Delivers {sub.frequency}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-lg">${sub.price.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">per delivery</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm">Next Delivery:</p>
            <p className="text-white font-semibold">{sub.nextDelivery}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => skipNextDelivery(sub.id)}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500 text-yellow-400 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Skip Next
            </button>
            <button
              onClick={() => pauseSubscription(sub.id)}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 text-blue-400 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {sub.status === 'paused' ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => cancelSubscription(sub.id)}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscribeAndSave;

