// Configuration Firebase pour MGcaisse 3.0
// Importez ce fichier pour initialiser Firebase dans votre application

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase avec les valeurs réelles du projet
const firebaseConfig = {
  apiKey: "AIzaSyAhri2iXVG7qrPhjLWzpq6rVLBO-i2Xw8",
  authDomain: "mgcaisse3.firebaseapp.com",
  projectId: "mgcaisse3",
  storageBucket: "mgcaisse3.firebasestorage.com",
  messagingSenderId: "2550737714",
  appId: "1:2550737714:web:9da1ba638c2c"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
