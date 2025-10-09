import React, { useEffect, useState } from 'react';

interface AlertItem {
  id: string;
  productId: string;
  threshold: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts/price')
      .then(r => r.json())
      .then(d => setAlerts(d.alerts || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">My Alerts</h1>
        {loading ? (
          <div className="text-cyan-300">Loading...</div>
        ) : alerts.length === 0 ? (
          <div className="text-gray-400">No alerts yet.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Product</div>
                  <div className="text-white font-semibold">{a.productId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Threshold</div>
                  <div className="text-cyan-300 font-semibold">${parseFloat(a.threshold).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


