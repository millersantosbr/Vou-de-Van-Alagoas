// Vou de Van - Service Worker PWA
const CACHE_NAME = "voudevan-cache-v3"
const PRECACHE_ASSETS = [
  "/",
  "/site.webmanifest",
  "/favicon.ico",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/logonome.webp",
  "/logoicon.webp"
]

// Install: precache key brand assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("SW precache warning:", err))
  )
})

// Activate: clean up old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch strategy:
// Network-first for HTML / navigation requests (prevents stale code traps)
// Stale-while-revalidate for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== "GET") return

  // For page navigations: Always network first, fallback to cache if offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return networkResponse
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/")
          })
        })
    )
    return
  }

  // For static assets (images, icons, scripts, styles):
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => cached)

      return cached || fetchPromise
    })
  )
})
