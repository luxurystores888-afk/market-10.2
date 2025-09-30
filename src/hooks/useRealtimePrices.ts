import { useEffect, useRef, useState } from 'react';

export interface PriceUpdate {
  productId: string;
  newPrice: number;
  oldPrice?: number;
  change?: number;
  timestamp?: number;
}

export function useRealtimePrices() {
  const [lastUpdate, setLastUpdate] = useState<PriceUpdate | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.host}/cyber-realtime`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg?.type === 'price_update') {
          const data = msg.data as PriceUpdate;
          setLastUpdate({ ...data, timestamp: msg.timestamp });
          // Bubble up to global listeners for status page
          window.dispatchEvent(new CustomEvent('cybermart-realtime-update', { detail: msg }));
        } else if (msg?.type === 'price_alert') {
          // Forward alert events globally
          window.dispatchEvent(new CustomEvent('cybermart-realtime-update', { detail: msg }));
          // Persist to local feed
          try {
            const raw = localStorage.getItem('pulse_notifications_feed') || '[]';
            const arr = JSON.parse(raw);
            // Deduplicate: if last entry for same product within 60s, update instead
            const last = arr[arr.length - 1];
            if (last && last.type === 'price_alert' && last.url === `/products/${msg.data?.productId}` && msg.timestamp - last.timestamp < 60000) {
              last.message = `Price alert for ${msg.data?.productId}: $${msg.data?.newPrice}`;
              last.timestamp = msg.timestamp;
            } else {
              arr.push({
              id: `${msg.timestamp}-${msg.data?.productId}`,
              type: 'price_alert',
              message: `Price alert for ${msg.data?.productId}: $${msg.data?.newPrice}`,
              timestamp: msg.timestamp,
              url: `/products/${msg.data?.productId}`
              });
            }
            if (arr.length > 200) arr.splice(0, arr.length - 200);
            localStorage.setItem('pulse_notifications_feed', JSON.stringify(arr));
          } catch {}
        }
      } catch {}
    };

    // Subscribe to price channel
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ action: 'subscribe', channel: 'prices' }));
    });

    return () => {
      try { ws.close(); } catch {}
    };
  }, []);

  return { lastUpdate, connected };
}


