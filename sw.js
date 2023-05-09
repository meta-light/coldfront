self.addEventListener("install", e => {
    e.waitUnitl(
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
