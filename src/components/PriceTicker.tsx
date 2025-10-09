import React from 'react';
import { useRealtimePrices } from '../hooks/useRealtimePrices';

export function PriceTicker() {
  const { lastUpdate, connected } = useRealtimePrices();
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded bg-gray-900/80 border border-cyan-500/30 text-xs text-gray-200">
      <span className={connected ? 'text-green-400' : 'text-gray-400'}>
        {connected ? '●' : '○'}
      </span>
      <span className="ml-2">Realtime Prices</span>
      {lastUpdate && (
        <span className="ml-3 text-cyan-300">
          {lastUpdate.productId}: ${lastUpdate.newPrice.toFixed(2)}
          {typeof lastUpdate.change === 'number' && (
            <span className={lastUpdate.change >= 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
              ({lastUpdate.change >= 0 ? '+' : ''}{lastUpdate.change?.toFixed(2)})
            </span>
          )}
        </span>
      )}
    </div>
  );
}


