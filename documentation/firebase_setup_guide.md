# Guide d'intégration de Firebase dans MGcaisse 3.0

Ce guide vous explique pas à pas comment créer un projet Firebase gratuit et l'intégrer à votre application MGcaisse 3.0 pour ajouter l'authentification, la synchronisation des données et les sauvegardes.

## Étape 1 : Créer un projet Firebase

1. Accédez à la [Console Firebase](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Donnez un nom à votre projet (par exemple "MGcaisse3")
4. Désactivez Google Analytics si vous le souhaitez (optionnel)
5. Cliquez sur "Créer un projet"

## Étape 2 : Activer l'authentification

1. Dans le menu de gauche de votre projet Firebase, cliquez sur "Authentication"
2. Cliquez sur "Commencer"
3. Activez la méthode "Adresse e-mail/Mot de passe"
4. Cliquez sur "Enregistrer"

## Étape 3 : Configurer Firestore Database

1. Dans le menu de gauche, cliquez sur "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Sélectionnez "Démarrer en mode test" (pour simplifier le développement)
4. Choisissez l'emplacement de la base de données le plus proche de vos utilisateurs
5. Cliquez sur "Activer"

## Étape 4 : Configurer Storage

1. Dans le menu de gauche, cliquez sur "Storage"
2. Cliquez sur "Commencer"
3. Sélectionnez "Démarrer en mode test"
4. Cliquez sur "Suivant" puis "Terminé"

## Étape 5 : Ajouter Firebase à votre application web

1. Sur la page d'accueil de votre projet Firebase, cliquez sur l'icône "</>" (Ajouter une application web)
2. Donnez un nom à votre application (par exemple "MGcaisse3-Web")
3. Cochez "Configurer également Firebase Hosting" si vous souhaitez héberger votre application sur Firebase
4. Cliquez sur "Enregistrer l'application"
5. Copiez le bloc de configuration Firebase qui s'affiche (il contient apiKey, authDomain, etc.)

## Étape 6 : Intégrer la configuration Firebase dans votre application

1. Ouvrez le fichier `/src/firebase/config.ts` dans votre projet MGcaisse 3.0
2. Remplacez les valeurs de l'objet `firebaseConfig` par celles que vous avez copiées à l'étape précédente
3. Sauvegardez le fichier

## Liens directs utiles

- [Console Firebase](https://console.firebase.google.com/)
- [Documentation Firebase pour le Web](https://firebase.google.com/docs/web/setup)
- [Guide d'authentification Firebase](https://firebase.google.com/docs/auth/web/start)
- [Guide Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Guide Storage](https://firebase.google.com/docs/storage/web/start)
- [Limites du plan gratuit Firebase](https://firebase.google.com/pricing)

## Limites du plan gratuit Firebase (Spark)

- **Firestore Database** : 1 Go de stockage, 50K lectures/jour, 20K écritures/jour
- **Authentication** : 50K authentifications/mois
- **Storage** : 5 Go de stockage, 1 Go de transfert/jour
- **Hosting** : 10 Go de stockage, 360 Mo de transfert/jour

Ces limites sont largement suffisantes pour une petite à moyenne entreprise.
