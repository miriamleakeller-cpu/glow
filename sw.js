/* Service worker: makes the app work offline.
   IMPORTANT: whenever you change index.html, bump the number
   in CACHE (v1 -> v2 -> v3 ...) so your iPhone loads the new
   version instead of the stored one. */

const CACHE = 'glow-v3';

const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit =>
      hit || fetch(e.request).then(resp => {
        /* cache new files (like font files) on first load - but never errors */
        if(resp.ok){
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
