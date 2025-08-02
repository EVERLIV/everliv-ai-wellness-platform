// Enhanced Service Worker for EVERLIV PWA/TWA - v3 with improved error handling
const CACHE_NAME = 'everliv-v3';
const STATIC_CACHE_NAME = 'everliv-static-v3';
const DYNAMIC_CACHE_NAME = 'everliv-dynamic-v3';

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

// Install event - cache static resources with better error handling
self.addEventListener('install', (event) => {
  console.log('SW v3: Installing...');
  self.skipWaiting();
  
  event.waitUntil(
    (async () => {
      try {
        // Clear old caches first
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name.startsWith('everliv-') && !name.includes('v3'))
            .map(name => caches.delete(name))
        );

        const cache = await caches.open(STATIC_CACHE_NAME);
        
        // Cache resources individually to handle failures better
        for (const url of STATIC_URLS) {
          try {
            await cache.add(url);
            console.log('SW v3: Cached:', url);
          } catch (error) {
            console.warn('SW v3: Failed to cache:', url, error.message);
          }
        }
        
        console.log('SW v3: Installation complete');
      } catch (error) {
        console.error('SW v3: Installation failed:', error);
      }
    })()
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
    console.log('SW v3: Network failed for:', request.url);
    const cached = await caches.match(request);
    
    if (cached) {
      console.log('SW v3: Serving from cache:', request.url);
      return cached;
    }
    
    // Enhanced offline fallback for HTML pages
    if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>EVERLIV - Офлайн</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                margin: 0; padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
              }
              h1 { color: #2d3748; margin-bottom: 16px; }
              p { color: #4a5568; margin-bottom: 24px; line-height: 1.5; }
              button {
                background: #3182ce;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
              }
              button:hover { 
                background: #2c5282; 
                transform: translateY(-2px);
              }
              .error { 
                font-size: 12px; 
                color: #a0aec0; 
                margin-top: 20px; 
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔄 Нет подключения</h1>
              <p>Проверьте подключение к интернету и попробуйте еще раз</p>
              <button onclick="location.reload()">Обновить страницу</button>
              <div class="error">SW v3: ${error.message || 'Network unavailable'}</div>
            </div>
            <script>
              // Auto-retry when back online
              window.addEventListener('online', () => {
                location.reload();
              });
            </script>
          </body>
        </html>
      `, {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

async function networkAndCache(request, cacheName) {
  // Skip caching for unsupported schemes
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return fetch(request);
  }
  
  const response = await fetch(request);
  if (response.status === 200) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}