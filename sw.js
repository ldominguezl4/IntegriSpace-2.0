const CACHE_NAME = 'integrispace-cache-v3'; // Cambiamos a v3 para forzar la actualización
const ASSETS = [
  './pages/index.html',
  './css/style.css',
  './assets/logo_integrispace.png'
  // Nota: Si ya tienes listo historial.html e historial.css en tu GitHub, 
  // puedes descomentar las líneas de abajo quitando las barras '//'
  // './pages/historial.html',
  // './css/historial.css'
];

// Instalar la PWA y guardar archivos esenciales en el celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Guardando archivos en caché...');
      // Usamos un bucle para que si un archivo falla, los demás sí se guarden y la PWA no muera
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.log('Aviso: No se pudo precargar en caché:', url, err));
        })
      );
    }).then(() => self.skipWaiting()) // Fuerza al Service Worker a activarse de inmediato
  );
});

// Activar y limpiar versiones viejas de la caché
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Limpiando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de las pestañas abiertas inmediatamente
  );
});

// Permitir que cargue el contenido sin internet (Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});