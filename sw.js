const CACHE = 'crashkurs-v2';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  // Seite: erst Netz (neueste Fassung), ohne Netz aus dem Speicher
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', k)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // alles andere (Icons, Schriften): erst Speicher, sonst Netz und merken
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok || res.type === 'opaque') { const k = res.clone(); caches.open(CACHE).then(c => c.put(r, k)); }
    return res;
  })));
});
