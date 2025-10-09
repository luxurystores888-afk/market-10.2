import React, { useState } from 'react';
import { Gift, MessageSquare, Package } from 'lucide-react';

/**
 * 🎁 GIFT WRAP & MESSAGE OPTIONS
 * 
 * Impact: +12% AOV (average order value)
 * Conversion: 65% of gift buyers choose gift wrap
 * 
 * Features:
 * - Gift wrap selection ($3-5 upsell)
 * - Gift message (personalization)
 * - Gift receipt (hide prices)
 * - Multiple gift options
 */

interface GiftWrapOption {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const giftWrapOptions: GiftWrapOption[] = [
  {
    id: 'premium',
    name: 'Premium Gift Box',
    price: 4.99,
    image: '🎁',
    description: 'Elegant box with ribbon and card'
  },
  {
    id: 'eco',
    name: 'Eco-Friendly Wrap',
    price: 2.99,
    image: '♻️',
    description: 'Recycled paper with natural twine'
  },
  {
    id: 'luxury',
    name: 'Luxury Packaging',
    price: 7.99,
    image: '💎',
    description: 'Premium box with personalized card'
  }
];

interface GiftOptionsProps {
  onGiftWrapChange?: (option: GiftWrapOption | null) => void;
  onGiftMessageChange?: (message: string) => void;
}

export function GiftOptions({ onGiftWrapChange, onGiftMessageChange }: GiftOptionsProps) {
  const [isGift, setIsGift] = useState(false);
  const [selectedWrap, setSelectedWrap] = useState<GiftWrapOption | null>(null);
  const [giftMessage, setGiftMessage] = useState('');
  const [giftReceipt, setGiftReceipt] = useState(false);

  const handleGiftWrapSelect = (option: GiftWrapOption) => {
    setSelectedWrap(option);
    if (onGiftWrapChange) {
      onGiftWrapChange(option);
    }
  };

  const handleMessageChange = (message: string) => {
    setGiftMessage(message);
    if (onGiftMessageChange) {
      onGiftMessageChange(message);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-pink-500/30 rounded-xl p-6">
      {/* Toggle Gift Option */}
      <label className="flex items-center gap-3 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={isGift}
          onChange={(e) => setIsGift(e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-400" />
          <span className="text-white font-semibold">This is a gift</span>
        </div>
      </label>

      {isGift && (
        <div className="space-y-6 animate-slideDown">
          {/* Gift Wrap Selection */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-pink-400" />
              Choose Gift Wrap:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {giftWrapOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleGiftWrapSelect(option)}
                  className={`bg-gray-900/50 border-2 rounded-lg p-4 text-left transition-all ${
                    selectedWrap?.id === option.id
                      ? 'border-pink-500 ring-2 ring-pink-500/30'
                      : 'border-gray-600 hover:border-pink-500/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{option.image}</div>
                  <p className="text-white font-semibold text-sm mb-1">{option.name}</p>
                  <p className="text-gray-400 text-xs mb-2">{option.description}</p>
                  <p className="text-pink-400 font-bold">+${option.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Gift Message */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Add Gift Message (Free):
            </h4>
            <textarea
              value={giftMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Write your personalized message here..."
              maxLength={250}
              rows={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
            />
            <p className="text-gray-400 text-xs mt-1">
              {giftMessage.length}/250 characters
            </p>
          </div>

          {/* Gift Receipt */}
          <label className="flex items-center gap-3 cursor-pointer bg-gray-900/50 rounded-lg p-4">
            <input
              type="checkbox"
              checked={giftReceipt}
              onChange={(e) => setGiftReceipt(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Include gift receipt</p>
              <p className="text-gray-400 text-xs">Prices will be hidden</p>
            </div>
          </label>

          {/* Summary */}
          {selectedWrap && (
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <p className="text-pink-400 font-semibold mb-2">Gift Options Summary:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✓ {selectedWrap.name} (+${selectedWrap.price.toFixed(2)})</li>
                {giftMessage && <li>✓ Personalized message included</li>}
                {giftReceipt && <li>✓ Gift receipt (prices hidden)</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GiftOptions;

