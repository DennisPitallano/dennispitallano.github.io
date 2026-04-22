/* The Oragon Gazette — Service Worker
   Strategy: stale-while-revalidate for same-origin GET requests.
   Bump VERSION when shipping major changes to bust the cache. */
const VERSION = 'gazette-v3';
const CORE = [
  '/',
  '/index.html',
  '/assets/newsprint/styles.css',
  '/assets/newsprint/main.js',
  '/assets/fonts/fonts.css',
  '/assets/fonts/playfair-latin.woff2',
  '/assets/fonts/oldstandard-400-latin.woff2',
  '/assets/fonts/oldstandard-700-latin.woff2',
  '/assets/fonts/specialelite-latin.woff2',
  '/assets/fonts/unifrakturcook-latin.woff2',
  '/img/favicon.svg',
  '/img/pita.jpg',
  '/img/pita.avif',
  '/img/pita.webp',
  '/img/apple-touch-icon.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle same-origin requests; let the browser deal with fonts/3rd-party
  if (url.origin !== self.location.origin) return;
  // Skip the service worker itself and the Docusaurus-built /blog and /docs sub-apps
  if (url.pathname === '/sw.js') return;

  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => cached); // offline: fall back to cache
      return cached || fetchPromise;
    })
  );
});
