const CACHE_NAME = 'bharat-vision-v1';

// 1. INSTALL PHASE: Cache the core screens on the user's phone
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/pass',
        '/track',
        '/safety',
        '/chat',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// 2. FETCH PHASE: Serve from cache if offline, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached screen if it exists, otherwise try the network
      return response || fetch(event.request);
    }).catch(() => {
      // If the network is totally dead and it's not cached, fallback safely
      console.log("Network completely offline. Serving from cache.");
    })
  );
});

// 3. ACTIVATE PHASE: Clean up old caches when you update the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});