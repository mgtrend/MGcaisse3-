// Configuration Firebase pour MGcaisse 3.0
// Importez ce fichier pour initialiser Firebase dans votre application

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Remplacez ces valeurs par celles de votre projet Firebase
// Vous obtiendrez ces informations après avoir créé votre projet sur https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "votre-messaging-sender-id",
  appId: "votre-app-id"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
