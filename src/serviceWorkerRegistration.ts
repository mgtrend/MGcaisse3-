// Ce fichier gère l'enregistrement du service worker
// pour permettre à l'application de fonctionner hors ligne

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // L'URL constructeur est disponible dans tous les navigateurs qui prennent en charge SW
    const publicUrl = new URL(
      process.env.PUBLIC_URL || '', 
      window.location.href
    );
    if (publicUrl.origin !== window.location.origin) {
      // Notre service worker ne fonctionnera pas si PUBLIC_URL est sur une origine différente
      // de celle de notre page. Cela peut se produire si un CDN est utilisé pour servir les assets.
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;

      if (isLocalhost) {
        // Ceci s'exécute sur localhost. Vérifions si un service worker existe toujours ou non.
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Cette application web est servie en premier lieu par un service worker. ' +
              'Pour en savoir plus, visitez https://cra.link/PWA'
          );
        });
      } else {
        // Ce n'est pas localhost. Enregistrons simplement le service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // À ce stade, l'ancien contenu sera purgé et
              // le nouveau contenu aura été ajouté au cache.
              console.log(
                'Nouveau contenu disponible et sera utilisé lorsque toutes les ' +
                  'onglets pour cette page sont fermés.'
              );

              // Exécuter callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // À ce stade, tout a été mis en cache.
              console.log('Le contenu est mis en cache pour une utilisation hors ligne.');

              // Exécuter callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erreur pendant l\'enregistrement du service worker:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Vérifier si le service worker peut être trouvé. S'il ne peut pas être rechargé la page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // S'assurer que le service worker existe et que nous obtenons vraiment un fichier JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Aucun service worker trouvé. Probablement une application différente. Rechargez la page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker trouvé. Procéder normalement.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Aucune connexion internet trouvée. L\'application s\'exécute en mode hors ligne.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
