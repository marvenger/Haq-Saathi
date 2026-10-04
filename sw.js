const V = 'haq-saathi-v1';
const SHELL = ['./', 'index.html', 'css/styles.css', 'js/rules.js', 'js/scam.js', 'js/app.js', 'manifest.json', 'assets/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// Cache-first for the app shell so it opens on weak or no network. Nothing user-typed is ever cached.
self.addEventListener('fetch', e => { if (e.request.method === 'GET') e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('index.html')))); });
