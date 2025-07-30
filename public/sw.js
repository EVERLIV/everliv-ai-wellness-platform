// Enhanced Service Worker for EVERLIV PWA/TWA
const CACHE_NAME = 'everliv-v2';
const STATIC_CACHE_NAME = 'everliv-static-v2';
const DYNAMIC_CACHE_NAME = 'everliv-dynamic-v2';

// Static resources to cache immediately
const STATIC_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/site.webmanifest'
];

// Dynamic resources patterns
const CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp)$/,
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_URLS))
  );
});

// Enhanced fetch event with intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different types of requests
  if (STATIC_URLS.includes(url.pathname)) {
    // Static resources - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // Assets - stale while revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    // API calls - network first
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    // Other resources - network first with fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.startsWith('everliv-') || 
                ![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  return cached || networkAndCache(request, cacheName);
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const networkPromise = networkAndCache(request, cacheName);
  return cached || networkPromise;
}

async function networkFirst(request, cacheName) {
  try {
    return await networkAndCache(request, cacheName);
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function networkAndCache(request, cacheName) {
  const response = await fetch(request);
  if (response.status === 200) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}