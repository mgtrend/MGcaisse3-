# Documentation MGcaisse 3.0

## Présentation

MGcaisse 3.0 est une application de caisse enregistreuse Progressive Web App (PWA) optimisée pour les appareils mobiles et dotée d'une gestion intuitive des produits par icônes. Cette nouvelle version apporte des améliorations significatives en termes d'expérience utilisateur, de performance et de compatibilité mobile.

## Fonctionnalités principales

- **Gestion des produits par icônes** : Interface intuitive permettant d'associer des icônes (emojis) aux produits pour une identification rapide
- **Optimisation mobile** : Interface responsive adaptée aux smartphones et tablettes
- **Mode hors-ligne** : Fonctionnement sans connexion internet grâce à la technologie PWA
- **Landing page moderne** : Présentation claire des fonctionnalités et limitations de l'application
- **Accès administrateur local** : Gestion des produits avec transparence sur les limitations client-side

## Structure technique

L'application a été développée avec les technologies suivantes :
- **React 18** avec **TypeScript** pour une base de code robuste et maintenable
- **Tailwind CSS** pour un design responsive et moderne
- **IndexedDB** pour le stockage local des données
- **Service Worker** pour le fonctionnement hors-ligne
- **PWA** pour l'installation sur les appareils

## Installation et déploiement

### Option 1 : Déploiement sur GitHub Pages

1. Créez un nouveau dépôt GitHub ou utilisez un dépôt existant
2. Copiez le contenu du dossier `mgcaisse3-dist` à la racine de votre dépôt
3. Activez GitHub Pages dans les paramètres du dépôt (Settings > Pages)
4. Sélectionnez la branche principale comme source
5. Votre application sera disponible à l'adresse `https://[votre-nom-utilisateur].github.io/[nom-du-repo]`

### Option 2 : Déploiement sur un serveur web

1. Copiez le contenu du dossier `mgcaisse3-dist` sur votre serveur web
2. Configurez votre serveur pour rediriger toutes les requêtes vers `index.html` (nécessaire pour le routage React)
3. Assurez-vous que votre serveur est configuré pour servir les fichiers avec les bons types MIME

### Configuration du serveur web (exemple pour Apache)

Créez un fichier `.htaccess` à la racine avec le contenu suivant :

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Utilisation

### Accès à l'application

- **Page d'accueil** : `index.html`
- **Application principale** : `/app`
- **Administration** : `/admin`

### Accès administrateur

- **Email** : onz.sbz@gmail.com
- **Mot de passe** : 06034434mg

**Note importante** : L'authentification est simulée en client-side et n'offre pas de sécurité réelle. Les données sont stockées uniquement dans le navigateur de l'utilisateur.

## Limitations importantes

- **Stockage local uniquement** : Toutes les données sont stockées dans le navigateur (IndexedDB)
- **Pas de synchronisation** : Pas de synchronisation entre appareils, pas de sauvegarde automatique
- **Authentification simulée** : L'accès administrateur n'est pas protégé par une véritable authentification sécurisée
- **Paiements simulés** : Les méthodes de paiement sont simulées et ne traitent pas de véritables transactions

## Recommandations pour une utilisation en production

Pour une utilisation en production réelle, il serait nécessaire de développer :
1. Un backend avec une authentification sécurisée
2. Un stockage centralisé des données
3. Une synchronisation entre appareils
4. Une gestion des paiements réels

## Support et contact

Pour toute question ou assistance, veuillez contacter : onz.sbz@gmail.com
