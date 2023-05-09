self.addEventListener("install", e => {
    e.waitUntil(
      caches.open("static").then(cache => {
        return cache.addAll(["./", "./style.css", "./media/profile144.jpg"]);
      })
    );
  });
  
  self.addEventListener("fetch", e => {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  });
  
  self.addEventListener("activate", e => {
    e.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith("static") && cacheName !== "static";
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
