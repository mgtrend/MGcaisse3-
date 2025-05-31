/**
 * Service d'authentification Firebase pour MGcaisse 3.0
 * Gère l'authentification des utilisateurs avec Firebase
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Initialiser l'écouteur d'état d'authentification
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setCurrentUser(this.transformUser(user));
      } else {
        this.setCurrentUser(null);
      }
    });
  }

  /**
   * Transforme un utilisateur Firebase en utilisateur de l'application
   */
  private transformUser(user: User): AuthUser {
    // Dans une implémentation réelle, vous pourriez vérifier les rôles dans Firestore
    // Pour l'instant, nous considérons que l'utilisateur avec l'email spécifié est admin
    const isAdmin = user.email === 'onz.sbz@gmail.com';
    
    return {
      uid: user.uid,
      email: user.email,
      isAdmin
    };
  }

  /**
   * Met à jour l'utilisateur actuel et notifie les écouteurs
   */
  private setCurrentUser(user: AuthUser | null) {
    this.currentUser = user;
    this.notifyListeners();
  }

  /**
   * Notifie tous les écouteurs d'un changement d'état d'authentification
   */
  private notifyListeners() {
    this.authStateListeners.forEach(listener => {
      listener(this.currentUser);
    });
  }

  /**
   * Ajoute un écouteur pour les changements d'état d'authentification
   */
  public onAuthStateChange(listener: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(listener);
    
    // Notifier immédiatement avec l'état actuel
    listener(this.currentUser);
    
    // Retourner une fonction pour se désabonner
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Vérifie si l'utilisateur connecté est un administrateur
   */
  public isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  /**
   * Crée un nouvel utilisateur avec email et mot de passe
   */
  public async register(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = this.transformUser(userCredential.user);
      this.setCurrentUser(authUser);
      return authUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Connecte un utilisateur avec email et mot de passe
   */
  public async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authUser = this.transformUser(userCredential.user);
      this.setCurrentUser(authUser);
      return authUser;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      this.setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}

// Singleton instance
export const authService = new AuthService();
