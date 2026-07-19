const CACHE_VERSION = "v1";
const CACHE_NAME = `sepolscis-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/login.html",
  "/signup.html",
  "/style.css",
  "/app.js",
  "/learning-content.js",
  "/logo.png",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Pre-cache essential app shell and offline page
      await cache.addAll(
        STATIC_ASSETS.map((path) => new Request(path, { cache: "reload" }))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Simple runtime cache helper
async function fromNetworkThenCache(request) {
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const acceptHeader = event.request.headers.get("accept") || "";
  const isNavigation =
    event.request.mode === "navigate" || acceptHeader.includes("text/html");

  if (isNavigation) {
    // Network-first for navigations: try network, fallback to cache, then offline page
    event.respondWith(
      (async () => {
        try {
          return await fromNetworkThenCache(event.request);
        } catch (err) {
          const cached =
            (await caches.match(event.request)) ||
            (await caches.match("/index.html")) ||
            (await caches.match("/offline.html"));
          return (
            cached ||
            new Response("<h1>Offline</h1>", {
              status: 503,
              headers: { "Content-Type": "text/html" },
            })
          );
        }
      })()
    );
    return;
  }

  // For other requests use cache-first, then network fallback and cache result
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      try {
        const networkResp = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResp.clone());
        return networkResp;
      } catch (err) {
        // Return a fallback image if image requested
        if (event.request.destination === "image") {
          return await caches.match("/icons/icon-192.png");
        }
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});
