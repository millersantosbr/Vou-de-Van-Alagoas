// Self-destroying & Cache Purging Service Worker
// Automatically purges all old caches and unregisters to prevent stale HTML/CSS caching traps

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Purging old cache:", cacheName)
            return caches.delete(cacheName)
          })
        )
      })
      .then(() => {
        return self.registration.unregister()
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Always fetch directly from network without caching HTML/chunks
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request))
})
