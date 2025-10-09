import React, { useEffect, useState } from 'react';

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const msg = e.detail;
      if (msg?.type === 'price_alert') {
        setCount((c) => c + 1);
        setLast(`Price alert: ${msg.data?.productId} @ $${msg.data?.newPrice}`);
      }
    };
    window.addEventListener('cybermart-realtime-update' as any, handler);
    return () => window.removeEventListener('cybermart-realtime-update' as any, handler);
  }, []);

  return (
    <div className="relative">
      <div className="px-3 py-2 rounded-lg border border-cyan-500/30 bg-gray-900/70 text-cyan-200 text-sm">
        🔔 Alerts {count > 0 && <span className="ml-1 text-white font-semibold">({count})</span>}
      </div>
      {last && (
        <div className="absolute right-0 mt-2 w-64 p-3 bg-gray-900/90 border border-cyan-500/30 rounded-lg text-xs text-gray-200">
          {last}
        </div>
      )}
    </div>
  );
}


