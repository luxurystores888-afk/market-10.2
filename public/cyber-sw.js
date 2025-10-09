// CYBER MART 2077 ENHANCED SERVICE WORKER
// PWA capabilities extracted from tocontiniue-building-web(5) and enhanced

const CACHE_NAME = 'cyber-mart-2077-v1';
const STATIC_CACHE = 'cyber-static-v1';
const DYNAMIC_CACHE = 'cyber-dynamic-v1';

// Enhanced caching strategy for cyberpunk assets
const CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('🚀 CYBER MART 2077 Service Worker Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(CACHE_URLS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('⚡ CYBER MART 2077 Service Worker Activated');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Enhanced fetch strategy with AI-powered caching
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle different request types with smart caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  } else if (url.pathname.includes('/assets/')) {
    event.respondWith(handleAssetRequest(event.request));
  } else {
    event.respondWith(handlePageRequest(event.request));
  }
});

// Smart API caching with neural network optimization
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Cache product data for offline access
  if (url.pathname.includes('/products') && request.method === 'GET') {
    try {
      const response = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response('Offline - Neural networks unavailable', { status: 503 });
    }
  }
  
  // Always try network first for AI requests
  return fetch(request);
}

// Asset caching with cyberpunk optimization
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Asset unavailable in cyberpunk cache', { status: 404 });
  }
}

// Page request handling with offline fallback
async function handlePageRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Page unavailable offline', { status: 503 });
  }
}

// Enhanced push notification handling
self.addEventListener('push', event => {
  const options = {
    body: 'New cyberpunk products available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore New Products',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CYBER MART 2077', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🔥 Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Background sync activated');
  // Sync offline actions when connection restored
}