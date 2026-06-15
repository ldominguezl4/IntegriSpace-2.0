const CACHE_NAME = 'integrispace-cache-v2';
const ASSETS = [
  './index.html',
  './pages/historial.html',
  './css/style.css',
  './css/historial.css',
  './assets/logo_integrispace.png'
];

// Instalar la PWA y guardar archivos en el celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activar y limpiar archivos viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Hacer que la app funcione incluso sin internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});