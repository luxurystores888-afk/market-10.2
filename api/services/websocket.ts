import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', message => {
    // Handle subscriptions, e.g., to product prices
  });
});

// Function to broadcast price update
export function broadcastPriceUpdate(productId: string, newPrice: number) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'priceUpdate', productId, newPrice }));
  });
}
