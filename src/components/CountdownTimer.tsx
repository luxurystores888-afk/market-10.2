import React, { useState, useEffect } from 'react';
import { Clock, Zap, TrendingUp } from 'lucide-react';

/**
 * ⏰ COUNTDOWN TIMER Component
 * 
 * Impact: +30% conversion on timed offers
 * Creates urgency and FOMO (Fear Of Missing Out)
 * 
 * Usage:
 * <CountdownTimer endDate={new Date('2025-12-31')} />
 * <FlashSaleTimer duration={3600} /> // 1 hour
 */

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
  showDays?: boolean;
  compact?: boolean;
}

export function CountdownTimer({ 
  endDate, 
  onExpire, 
  showDays = true,
  compact = false 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-center">
        <p className="text-red-400 font-bold">⏰ Offer Expired!</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-full px-4 py-2">
        <Clock className="w-4 h-4 text-red-400" />
        <span className="text-red-400 font-bold text-sm">
          {showDays && timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-xl p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-orange-400 animate-pulse" />
        <h3 className="text-lg font-bold text-white">ENDS IN:</h3>
      </div>
      
      <div className="flex justify-center gap-2 md:gap-4">
        {showDays && timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="Days" />
        )}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gray-900/80 border border-red-500/50 rounded-lg p-2 md:p-4 min-w-[60px] md:min-w-[80px]">
      <div className="text-2xl md:text-4xl font-bold text-red-400 text-center">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-400 text-center mt-1">
        {label}
      </div>
    </div>
  );
}

// Flash Sale Timer - Duration Based
interface FlashSaleTimerProps {
  duration: number; // seconds
  productName?: string;
  discount?: number;
}

export function FlashSaleTimer({ duration, productName, discount = 50 }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  if (timeLeft === 0) {
    return (
      <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-400 font-bold">⚡ Flash Sale Ended!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-2 border-red-500 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-400 animate-pulse" />
          <span className="text-white font-bold">FLASH SALE!</span>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {discount}% OFF
        </div>
      </div>

      {productName && (
        <p className="text-gray-300 text-sm mb-3">{productName}</p>
      )}

      <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
        <Clock className="w-4 h-4 text-red-400" />
        <span className="text-red-400 font-mono font-bold text-lg">
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
        <span className="text-gray-400 text-sm ml-auto">left!</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-1000"
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Daily Deal Timer - Resets at Midnight
export function DailyDealTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeUntilMidnight());

  function calculateTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight.getTime() - now.getTime();
    
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h4 className="text-white font-bold">DEAL OF THE DAY</h4>
      </div>

      <div className="flex items-center justify-center gap-2 bg-black/40 rounded-lg p-3">
        <span className="text-gray-400 text-sm">Ends in:</span>
        <span className="text-purple-400 font-mono font-bold text-xl">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      <p className="text-gray-400 text-xs text-center mt-2">
        ⏰ New deal starts at midnight
      </p>
    </div>
  );
}

// Stock Scarcity Timer
export function StockScarcityBadge({ stock, threshold = 10 }: { stock: number; threshold?: number }) {
  if (stock > threshold) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
      stock <= 3 
        ? 'bg-red-500/20 border border-red-500 text-red-400'
        : 'bg-orange-500/20 border border-orange-500 text-orange-400'
    }`}>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
      <span className="font-semibold text-sm">
        Only {stock} left in stock!
      </span>
    </div>
  );
}

// Live Viewers Counter (creates urgency)
export function LiveViewersCounter({ count }: { count?: number }) {
  const [viewers, setViewers] = useState(count || Math.floor(Math.random() * 50) + 10);

  useEffect(() => {
    // Simulate live viewers changing
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        const newCount = Math.max(5, prev + change);
        return Math.min(200, newCount);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500 rounded-full px-3 py-1">
      <div className="relative">
        <div className="w-2 h-2 bg-blue-400 rounded-full" />
        <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
      </div>
      <span className="text-blue-400 text-sm font-semibold">
        {viewers} people viewing
      </span>
    </div>
  );
}

export default CountdownTimer;

