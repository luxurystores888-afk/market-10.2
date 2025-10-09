import React, { useEffect, useState } from 'react';

interface Metric {
  label: string;
  value: string | number;
}

export default function StatusPage() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Build', value: 'Running' },
    { label: 'Analytics', value: 'Active' },
    { label: 'Realtime', value: 'Idle' },
    { label: 'Referrals', value: 'Listening' },
  ]);

  useEffect(() => {
    const listener = (e: any) => {
      setMetrics(prev => {
        const next = [...prev];
        const idx = next.findIndex(m => m.label === 'Realtime');
        if (idx >= 0) next[idx] = { label: 'Realtime', value: e.detail?.type || 'Update' };
        return next;
      });
    };
    window.addEventListener('cybermart-realtime-update' as any, listener);
    return () => window.removeEventListener('cybermart-realtime-update' as any, listener);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">Live System Status</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map(m => (
            <div key={m.label} className="p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl">
              <div className="text-gray-400 text-sm">{m.label}</div>
              <div className="text-white text-xl font-semibold">{String(m.value)}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-gray-900/60 border border-purple-500/30 rounded-xl">
          <h2 className="text-white font-semibold mb-2">What’s running now</h2>
          <ul className="text-gray-300 list-disc pl-5 space-y-1">
            <li>Free analytics injected and tracking events</li>
            <li>Referral share analytics wired</li>
            <li>Checkout micro-donation enabled</li>
            <li>Realtime price updates ready (websocket backend)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


