const CACHE_NAME = 'tea-cafe-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/images/tea-field.jpg',
  '/assets/images/tea-cup.png',
  '/assets/images/tea-plant.png',
  '/assets/images/counter.png',
  '/assets/images/table.png',
  '/assets/images/character1.png',
  '/assets/images/character2.png',
  '/assets/audio/bgm-main.mp3',
  '/assets/audio/bgm-cafe.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
