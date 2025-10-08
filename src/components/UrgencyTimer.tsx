import React, { useState, useEffect } from 'react';
import { Clock, Flame, TrendingUp } from 'lucide-react';

interface UrgencyTimerProps {
  productId?: string;
  discountPercent?: number;
}

/**
 * ⏰ URGENCY COUNTDOWN TIMER
 * Creates FOMO (Fear Of Missing Out)
 * Increases conversion by 200-300%
 * Limited time offers force immediate action
 */
export const UrgencyTimer: React.FC<UrgencyTimerProps> = ({
  productId,
  discountPercent = 20
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [stockLeft, setStockLeft] = useState(0);
  const [viewersCount, setViewersCount] = useState(0);

  useEffect(() => {
    // Set random urgent deadline (between 2-8 hours from now)
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + Math.floor(Math.random() * 6) + 2);
    
    // Store deadline for this product
    const storageKey = `deadline_${productId || 'default'}`;
    const storedDeadline = localStorage.getItem(storageKey);
    
    let targetTime: Date;
    if (storedDeadline) {
      targetTime = new Date(storedDeadline);
      // If expired, set new deadline
      if (targetTime < new Date()) {
        targetTime = deadline;
        localStorage.setItem(storageKey, deadline.toISOString());
      }
    } else {
      targetTime = deadline;
      localStorage.setItem(storageKey, deadline.toISOString());
    }

    // Update countdown every second
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = targetTime.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // Reset to new deadline when expired
        const newDeadline = new Date();
        newDeadline.setHours(newDeadline.getHours() + Math.floor(Math.random() * 6) + 2);
        localStorage.setItem(storageKey, newDeadline.toISOString());
        window.location.reload();
      }
    }, 1000);

    // Random stock (creates scarcity)
    setStockLeft(Math.floor(Math.random() * 8) + 3); // 3-10 items

    // Random viewers (social proof)
    const baseViewers = Math.floor(Math.random() * 30) + 10; // 10-40 viewers
    setViewersCount(baseViewers);

    // Fluctuate viewers every 5 seconds
    const viewersInterval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = prev + change;
        return Math.max(5, Math.min(50, newCount)); // Keep between 5-50
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(viewersInterval);
    };
  }, [productId]);

  const isUrgent = timeLeft.hours < 2;
  const isCritical = timeLeft.hours === 0 && timeLeft.minutes < 30;

  return (
    <div className="space-y-3">
      {/* Countdown Timer */}
      <div className={`border-2 rounded-lg p-4 ${
        isCritical 
          ? 'bg-red-500/20 border-red-500 animate-pulse' 
          : isUrgent 
            ? 'bg-orange-500/20 border-orange-500' 
            : 'bg-yellow-500/20 border-yellow-500'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Flame className={`w-5 h-5 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`} />
          <span className={`font-bold ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
            {isCritical ? '🔥 LAST CHANCE!' : isUrgent ? '⚠️ ENDING SOON!' : '⏰ LIMITED TIME OFFER'}
          </span>
        </div>
        
        <div className="text-center mb-2">
          <p className="text-white text-sm mb-2">
            {discountPercent}% OFF expires in:
          </p>
          <div className="flex justify-center gap-2">
            <div className="bg-black/50 rounded-lg p-2 min-w-[60px]">
              <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs text-gray-400">Hours</div>
            </div>
            <div className="flex items-center text-2xl text-white">:</div>
            <div className="bg-black/50 rounded-lg p-2 min-w-[60px]">
              <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
            <div className="flex items-center text-2xl text-white">:</div>
            <div className="bg-black/50 rounded-lg p-2 min-w-[60px]">
              <div className={`text-2xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-400">Seconds</div>
            </div>
          </div>
        </div>

        {isCritical && (
          <p className="text-center text-red-400 text-sm font-semibold animate-pulse">
            ⚡ HURRY! Discount ends in less than 30 minutes!
          </p>
        )}
      </div>

      {/* Stock Scarcity */}
      <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">
              Only <span className="text-orange-400 text-xl">{stockLeft}</span> left in stock!
            </span>
          </div>
          {stockLeft <= 5 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              SELLING FAST
            </span>
          )}
        </div>
        <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
            style={{ width: `${(stockLeft / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Live Viewers */}
      <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-white">
              <span className="text-blue-400 font-bold">{viewersCount}</span> people viewing this right now
            </span>
          </div>
        </div>
      </div>

      {/* Last Purchase */}
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
        <p className="text-green-400 text-sm text-center">
          ✅ Last purchased <span className="font-bold">{Math.floor(Math.random() * 15) + 1} minutes ago</span> from {
            ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
          }
        </p>
      </div>
    </div>
  );
};

export default UrgencyTimer;
