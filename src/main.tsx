import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si vous souhaitez que votre application fonctionne hors ligne et se charge plus rapidement,
// vous pouvez modifier unregister() pour register() ci-dessous.
// Notez que cela comporte quelques inconvénients.
// En savoir plus sur les service workers : https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Notification à l'utilisateur qu'une mise à jour est disponible
    const waitingServiceWorker = registration.waiting;
    
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        // @ts-ignore
        if (event.target?.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});
