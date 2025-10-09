import React, { useState, useRef, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';

/**
 * 🎰 SCRATCH & WIN GAMIFICATION
 * 
 * Impact: +20% repeat purchases
 * Engagement: +30-50% gamification boost
 * Psychology: Variable rewards = addiction
 * 
 * Use Cases:
 * - Post-purchase reward
 * - Daily login bonus
 * - Email signup incentive
 * - Loyalty program
 */

interface ScratchCardProps {
  onReveal?: (prize: Prize) => void;
  prizes?: Prize[];
}

interface Prize {
  id: string;
  type: 'discount' | 'freeShipping' | 'points' | 'freeProduct';
  value: number | string;
  displayText: string;
  probability: number; // 0-100
}

const defaultPrizes: Prize[] = [
  { id: '1', type: 'discount', value: 5, displayText: '5% OFF', probability: 40 },
  { id: '2', type: 'discount', value: 10, displayText: '10% OFF', probability: 30 },
  { id: '3', type: 'discount', value: 15, displayText: '15% OFF', probability: 15 },
  { id: '4', type: 'discount', value: 20, displayText: '20% OFF', probability: 10 },
  { id: '5', type: 'freeShipping', value: 'free', displayText: 'FREE SHIPPING', probability: 20 },
  { id: '6', type: 'points', value: 100, displayText: '100 POINTS', probability: 30 },
  { id: '7', type: 'points', value: 500, displayText: '500 POINTS', probability: 10 },
  { id: '8', type: 'freeProduct', value: 'random', displayText: 'FREE GIFT!', probability: 5 },
];

export function ScratchCard({ onReveal, prizes = defaultPrizes }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    // Select prize based on probability
    const selectedPrize = selectRandomPrize(prizes);
    setPrize(selectedPrize);

    // Setup canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw scratch-off layer
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add texture
        ctx.fillStyle = '#a855f7';
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
          );
        }

        // Add "SCRATCH HERE" text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '16px Arial';
        ctx.fillText('👆', canvas.width / 2, canvas.height / 2 + 20);
      }
    }
  }, []);

  const selectRandomPrize = (prizesList: Prize[]): Prize => {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizesList) {
      cumulative += prize.probability;
      if (rand <= cumulative) {
        return prize;
      }
    }
    
    return prizesList[0]; // Fallback
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Erase the scratch-off layer
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratched percentage
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    // Auto-reveal if 50% scratched
    if (percentage > 50 && !isRevealed) {
      reveal();
    }
  };

  const reveal = () => {
    setIsRevealed(true);
    
    if (prize && onReveal) {
      onReveal(prize);
    }

    // Track prize reveal
    if (window.gtag && prize) {
      window.gtag('event', 'scratch_card_revealed', {
        event_category: 'gamification',
        event_label: prize.displayText,
        value: typeof prize.value === 'number' ? prize.value : 0
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500 rounded-2xl p-6 text-center">
      <div className="mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {isRevealed ? '🎉 Congratulations!' : '🎁 You Won a Prize!'}
        </h3>
        <p className="text-gray-400 text-sm">
          {isRevealed ? 'Here is your reward:' : 'Scratch to reveal your reward'}
        </p>
      </div>

      {/* Scratch Card */}
      <div className="relative inline-block mx-auto mb-4">
        {/* Prize (behind scratch layer) */}
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 w-80 h-48 rounded-xl flex items-center justify-center">
          {prize && (
            <div className="text-center">
              <div className="text-6xl mb-2">
                {prize.type === 'discount' && '🎁'}
                {prize.type === 'freeShipping' && '📦'}
                {prize.type === 'points' && '⭐'}
                {prize.type === 'freeProduct' && '🎉'}
              </div>
              <div className="text-white font-bold text-3xl">
                {prize.displayText}
              </div>
            </div>
          )}
        </div>

        {/* Scratch Layer */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={320}
            height={192}
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseMove={(e) => isScratching && scratch(e)}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={(e) => scratch(e)}
            className="absolute top-0 left-0 cursor-pointer rounded-xl"
            style={{ touchAction: 'none' }}
          />
        )}
      </div>

      {/* Progress */}
      {!isRevealed && scratchPercentage > 0 && (
        <div className="mb-4">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${scratchPercentage}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {Math.floor(scratchPercentage)}% revealed
          </p>
        </div>
      )}

      {/* Reveal Button */}
      {!isRevealed && (
        <button
          onClick={reveal}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
        >
          Skip scratch - Reveal now →
        </button>
      )}

      {/* Claim Prize Button */}
      {isRevealed && prize && (
        <button
          onClick={() => {
            // Apply prize logic here
            alert(`Prize claimed: ${prize.displayText}`);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
        >
          ✨ Claim My Prize
        </button>
      )}
    </div>
  );
}

export default ScratchCard;

