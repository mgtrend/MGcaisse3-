// Service Worker pour MGcaisse 3.0
// Optimisé pour la performance et le fonctionnement hors-ligne

const CACHE_NAME = 'mgcaisse-v3-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/main.js',
  '/static/css/main.css'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours');
  
  // Mise en cache préventive des ressources essentielles
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours');
  
  // Nettoyage des anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : Cache First, puis réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes de chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Stratégie de mise en cache pour les ressources statiques
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retourner la ressource du cache si elle existe
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cloner la réponse car elle ne peut être utilisée qu'une fois
            const responseToCache = response.clone();
            
            // Mettre en cache la nouvelle ressource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, essayer de servir une page offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Ou retourner une image par défaut pour les requêtes d'images
            if (event.request.destination === 'image') {
              return caches.match('/images/offline-image.png');
            }
            
            // Sinon, laisser l'erreur se propager
            return new Response('Contenu non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
