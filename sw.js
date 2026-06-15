const CACHE_NAME = 'integrispace-cache-v2';
const ASSETS = [
  './pages/index.html',
  './pages/historial.html',
  './css/style.css',
  './css/historial.css',
  './assets/logo_integrispace.png'
];

// Instalar la PWA y guardar archivos esenciales en el celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activar y limpiar versiones viejas de la caché en el dispositivo
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

// Permitir que cargue el contenido sin internet (Offline mode)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});