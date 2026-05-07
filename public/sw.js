const CACHE_NAME = "awuf-v1";
const OFFLINE_ASSETS = ["/", "/manifest.json", "/pricing.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/pricing.json")) {
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
  }
});
