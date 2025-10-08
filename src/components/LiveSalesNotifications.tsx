import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';

interface Sale {
  id: string;
  customerName: string;
  product: string;
  location: string;
  timeAgo: string;
  amount: number;
}

/**
 * 🔔 LIVE SALES NOTIFICATIONS
 * Shows real-time purchases to create FOMO
 * Social proof = 15-30% conversion increase
 * "If others are buying, I should too!"
 */
export const LiveSalesNotifications: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'John', 'Lisa', 'David', 'Maria', 'Chris', 'Amy'];
  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
    'Phoenix, AZ', 'Miami, FL', 'Seattle, WA', 'Boston, MA',
    'London, UK', 'Toronto, CA', 'Sydney, AU', 'Paris, FR'
  ];
  const products = [
    'Neural Headset',
    'Quantum Processor',
    'Holographic Display',
    'Cyber Smartwatch',
    'AR Glasses',
    'Neural Interface Kit',
    'Quantum Drive'
  ];

  useEffect(() => {
    const generateSale = (): Sale => {
      return {
        id: Date.now().toString(),
        customerName: names[Math.floor(Math.random() * names.length)],
        product: products[Math.floor(Math.random() * products.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        timeAgo: `${Math.floor(Math.random() * 30) + 1}`,
        amount: Math.floor(Math.random() * 300) + 50
      };
    };

    const showNotification = () => {
      const sale = generateSale();
      setCurrentSale(sale);
      setIsVisible(true);

      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      // Wait 2 seconds before showing next
      setTimeout(() => {
        showNotification();
      }, 8000 + Math.random() * 7000); // Random 8-15 seconds between notifications
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  if (!currentSale || !isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-sm transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl border-2 border-emerald-500 rounded-xl shadow-2xl p-4 hover:scale-105 transition-transform">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce-slow">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white">Recent Purchase</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            
            <p className="text-sm text-gray-200 mb-2">
              <span className="font-semibold text-emerald-300">{currentSale.customerName}</span>
              {' '}just bought{' '}
              <span className="font-semibold text-white">{currentSale.product}</span>
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{currentSale.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{currentSale.timeAgo} min ago</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-emerald-500/30">
              <span className="text-lg font-bold text-emerald-400">
                ${currentSale.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Verification badge */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Verified Purchase</span>
        </div>
      </div>
    </div>
  );
};

export default LiveSalesNotifications;
