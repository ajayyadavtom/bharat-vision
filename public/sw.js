// Bharat Vision Service Worker — Production PWA Cache
const CACHE_NAME = "bharat-vision-v4";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Never cache external map tile requests to prevent stale tiles
  if (
    url.hostname.includes("tile") || 
    url.hostname.includes("cartocdn") || 
    url.hostname.includes("olamaps") || 
    url.hostname.includes("mappls") ||
    url.hostname.includes("openstreetmap")
  ) {
    return;
  }

  // Network-first strategy for dynamic pages and API calls
  if (url.pathname.startsWith("/api/") || url.pathname === "/track" || url.pathname === "/route") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
