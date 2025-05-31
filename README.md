# MGcaisse 3.0

Application de caisse enregistreuse Progressive Web App (PWA) avec gestion des produits par icônes et intégration Firebase.

## Fonctionnalités

- **Gestion des produits par icônes** : Interface intuitive avec sélection d'emojis
- **Optimisation mobile** : Interface responsive adaptée aux smartphones et tablettes
- **Mode hors-ligne** : Fonctionnement sans connexion internet (PWA)
- **Synchronisation Firebase** : Synchronisation des données entre appareils
- **Authentification** : Gestion des utilisateurs et des droits d'administration
- **Sauvegardes automatiques** : Protection des données via Firebase Storage

## Installation et déploiement

### Prérequis

- Node.js 16+ et npm/yarn
- Compte Firebase (gratuit)

### Installation locale

```bash
# Installer les dépendances
yarn install

# Lancer en mode développement
yarn dev

# Compiler pour la production
yarn build
```

### Configuration Firebase

Suivez les instructions détaillées dans le dossier `documentation` pour configurer votre projet Firebase et intégrer les services d'authentification, de base de données et de stockage.

## Structure du projet

- `src/` : Code source de l'application
  - `components/` : Composants React réutilisables
  - `firebase/` : Services d'intégration Firebase
  - `models/` : Types et interfaces TypeScript
  - `pages/` : Pages principales de l'application
  - `services/` : Services métier
- `public/` : Ressources statiques
- `documentation/` : Guides d'utilisation et d'intégration

## Accès administrateur

- Email : onz.sbz@gmail.com
- Mot de passe : Configuré dans Firebase Authentication

## Licence

Tous droits réservés - MGTrend 2025
