const CACHE_NAME = "ws-ref-cache-v1";
const TO_CACHE = [
  "/ws-ref/",
  "/ws-ref/index.html",
  "/ws-ref/manifest.json",
  "/ws-ref/icon-512.png"
  // Add more assets here (e.g., CSS/JS files) if you want them available offline
];

// Install event: cache all critical files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches if needed
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: respond from cache if available, else from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Notification click event (can be customized)
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/ws-ref/")
  );
});