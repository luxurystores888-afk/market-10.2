import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache manifest (generate via build)
precacheAndRoute(self.__WB_MANIFEST);

// Cache product pages
registerRoute(
  ({url}) => url.pathname.startsWith('/product/'),
  new StaleWhileRevalidate({
    cacheName: 'product-cache',
  })
);

// 🚀 CYBERPUNK SERVICE WORKER - REALITY TRANSCENDING CACHING
const CACHE_VERSION = 'v1.2.0';
const CACHE_NAME = `cyberpunk-omniplex-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Files to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// API endpoints to cache with different strategies
const API_ENDPOINTS = [
  '/api/products',
  '/api/ai/status', 
  '/api/ai/example-ideas',
  '/api/health'
];

// 🎮 INSTALL EVENT - INITIALIZE CYBERPUNK CACHING
self.addEventListener('install', event => {
  console.log('🚀 Cyberpunk Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets immediately
      caches.open(STATIC_CACHE).then(cache => {
        console.log('💾 Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('⚠️ Some assets failed to cache:', err);
        });
      }),
      // Initialize other caches
      caches.open(API_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(() => {
      console.log('✅ Cyberpunk Service Worker installed');
      self.skipWaiting(); // Activate immediately
    })
  );
});

// Add caching for more assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css', // Adjust paths
        '/scripts/main.js'
      ]);
    })
  );
});

// 🔄 ACTIVATE EVENT - CLEAN UP OLD CACHES
self.addEventListener('activate', event => {
  console.log('⚡ Cyberpunk Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Cyberpunk Service Worker activated');
      return self.clients.claim();
    })
  );
});

// 🌐 FETCH EVENT - INTELLIGENT CACHING STRATEGY
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests and non-GET requests
  if (!url.origin.includes(location.origin) || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // 🎯 STRATEGY 1: Static Assets - Cache First
    if (isStaticAsset(path)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // 🤖 STRATEGY 2: API Calls - Network First with Cache Fallback  
    if (isApiCall(path)) {
      return await networkFirst(request, API_CACHE);
    }

    // 🖼️ STRATEGY 3: Images - Cache First with Network Fallback
    if (isImage(path)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }

    // 🌟 STRATEGY 4: HTML Pages - Network First with Cache Fallback
    if (isHtmlRequest(request)) {
      return await networkFirst(request, STATIC_CACHE);
    }

    // Default: Network only
    return await fetch(request);

  } catch (error) {
    console.error('🚨 Service Worker fetch error:', error);
    
    // Return offline fallback for HTML requests
    if (isHtmlRequest(request)) {
      return await getOfflinePage();
    }
    
    throw error;
  }
}

// 🎯 CACHE FIRST STRATEGY
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('💾 Cache hit:', request.url);
    return cached;
  }

  console.log('🌐 Cache miss, fetching:', request.url);
  const response = await fetch(request);
  
  if (response.status === 200) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// 🌐 NETWORK FIRST STRATEGY  
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    console.log('🌐 Network first:', request.url);
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    console.log('💾 Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// 🔍 UTILITY FUNCTIONS
function isStaticAsset(path) {
  return path.includes('/assets/') || 
         path.endsWith('.js') ||
         path.endsWith('.css') ||
         path.endsWith('.wasm') ||
         path === '/manifest.json';
}

function isApiCall(path) {
  return path.startsWith('/api/');
}

function isImage(path) {
  return path.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i);
}

function isHtmlRequest(request) {
  return request.headers.get('Accept')?.includes('text/html');
}

async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  return await cache.match('/') || new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>🚀 Cyberpunk Omniplex - Offline</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #000 0%, #1a0033 50%, #000066 100%);
            color: #00D4FF; 
            text-align: center; 
            padding: 2rem;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          h1 { color: #00D4FF; font-size: 3em; margin-bottom: 0.5em; }
          p { color: #FF00FF; font-size: 1.2em; }
          .cyber { text-shadow: 0 0 10px #00D4FF; }
        </style>
      </head>
      <body>
        <div>
          <h1 class="cyber">🚀 CYBERPUNK OMNIPLEX</h1>
          <p>⚡ You're offline, but the cyberpunk experience continues...</p>
          <p>🔄 Check your connection to access AI features</p>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}

// 📡 MESSAGE HANDLING FOR PWA FEATURES
self.addEventListener('message', event => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_CLEAR':
        clearAllCaches();
        break;
      case 'CACHE_STATUS':
        getCacheStatus().then(status => {
          event.source.postMessage({ type: 'CACHE_STATUS_RESPONSE', status });
        });
        break;
    }
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ All caches cleared');
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }
  
  return status;
}

// 🚀 BACKGROUND SYNC FOR CART DATA
self.addEventListener('sync', event => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
});

async function syncCartData() {
  try {
    // Sync cart data when online
    console.log('🔄 Syncing cart data...');
    // Implementation would sync with backend
    return true;
  } catch (error) {
    console.error('❌ Cart sync failed:', error);
    throw error;
  }
}

self.addEventListener('push', event => {
  const data = event.data.json();
  if (data.type === 'restock') {
    self.registration.showNotification('Restock Alert', { body: `${data.product} is back in stock!` });
  }
});

console.log('🚀 Cyberpunk Service Worker loaded - Reality transcending caching active!');