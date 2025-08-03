const CACHE_NAME = 'everliv-v1.0.0';
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/ai-consultation',
  '/dashboard/health',
  '/dashboard/profile',
  '/dashboard/plan',
  '/manifest.json',
  '/favicon.ico'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Обработка fetch запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кешированную версию или загружаем из сети
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ для кеширования
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Push уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от EVERLIV',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('EVERLIV', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});