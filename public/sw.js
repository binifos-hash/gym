// GymPlanner service worker.
// Strategy:
//   • Static app shell  → cache-first (fast launch, works offline).
//   • GET /api/*         → network-first, falling back to the last cached copy
//                          so the app still opens with the most recent data
//                          when offline.
//   • Non-GET requests   → always go to the network (never cached). Writes made
//                          while offline simply fail, as they did before.
// Bump CACHE_VERSION whenever the shell assets change to force an update.
const CACHE_VERSION = "gymplanner-v3";

const APP_SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/styles.css",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only ever cache GETs — never intercept PUT/POST/etc.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for API reads.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for the static shell, with a network fallback that also
  // refreshes the cache. Navigations fall back to the cached index.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
