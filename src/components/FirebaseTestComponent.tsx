/**
 * Composant de test de synchronisation Firebase pour MGcaisse 3.0
 * Permet de tester la synchronisation et les sauvegardes
 */

import React, { useState } from 'react';
import { authService } from '../firebase/authService';
import { firestoreProductService } from '../firebase/firestoreProductService';
import { firestoreSalesService } from '../firebase/firestoreSalesService';
import { useFirebaseSync } from '../firebase/useFirebaseSync';

export const FirebaseTestComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    syncStatus, 
    lastSyncTime, 
    error: syncError, 
    syncNow, 
    createBackup 
  } = useFirebaseSync();

  // Gérer la connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      await authService.login(email, password);
      setTestResult('Connexion réussie!');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await authService.signOut();
      setTestResult('Déconnexion réussie!');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setTestResult(`Erreur de déconnexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Tester la synchronisation
  const handleTestSync = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const success = await syncNow();
      if (success) {
        setTestResult('Synchronisation réussie!');
      } else {
        setTestResult('Échec de la synchronisation');
      }
    } catch (error) {
      console.error('Erreur de test de synchronisation:', error);
      setTestResult(`Erreur de synchronisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Tester la sauvegarde
  const handleTestBackup = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const backupUrl = await createBackup();
      setTestResult(`Sauvegarde réussie! URL: ${backupUrl}`);
    } catch (error) {
      console.error('Erreur de test de sauvegarde:', error);
      setTestResult(`Erreur de sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Tester la récupération des produits
  const handleTestProducts = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const products = await firestoreProductService.getAllProducts();
      setTestResult(`Récupération des produits réussie! ${products.length} produits trouvés.`);
    } catch (error) {
      console.error('Erreur de récupération des produits:', error);
      setTestResult(`Erreur de récupération des produits: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Tester la récupération des ventes
  const handleTestSales = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const sales = await firestoreSalesService.getAllSales();
      setTestResult(`Récupération des ventes réussie! ${sales.length} ventes trouvées.`);
    } catch (error) {
      console.error('Erreur de récupération des ventes:', error);
      setTestResult(`Erreur de récupération des ventes: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentUser = authService.getCurrentUser();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Test Firebase</h2>
      
      {/* Statut de connexion */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Statut de connexion:</h3>
        {currentUser ? (
          <div className="text-green-600">
            <p>Connecté en tant que: {currentUser.email}</p>
            <p>UID: {currentUser.uid}</p>
            <p>Admin: {currentUser.isAdmin ? 'Oui' : 'Non'}</p>
          </div>
        ) : (
          <p className="text-red-600">Non connecté</p>
        )}
      </div>
      
      {/* Formulaire de connexion */}
      {!currentUser ? (
        <form onSubmit={handleLogin} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {loginError && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      ) : (
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full mb-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300"
        >
          {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      )}
      
      {/* Statut de synchronisation */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Statut de synchronisation:</h3>
        <p>État: {
          syncStatus === 'idle' ? 'Inactif' : 
          syncStatus === 'syncing' ? 'Synchronisation en cours...' : 
          'Erreur'
        }</p>
        {lastSyncTime && (
          <p>Dernière synchronisation: {lastSyncTime.toLocaleString()}</p>
        )}
        {syncError && (
          <p className="text-red-600">Erreur: {syncError}</p>
        )}
      </div>
      
      {/* Tests */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleTestSync}
          disabled={isLoading || !currentUser}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          Tester la synchronisation
        </button>
        <button
          onClick={handleTestBackup}
          disabled={isLoading || !currentUser}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
        >
          Tester la sauvegarde
        </button>
        <button
          onClick={handleTestProducts}
          disabled={isLoading || !currentUser}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
        >
          Tester les produits
        </button>
        <button
          onClick={handleTestSales}
          disabled={isLoading || !currentUser}
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:bg-yellow-300"
        >
          Tester les ventes
        </button>
      </div>
      
      {/* Résultat du test */}
      {testResult && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Résultat:</h3>
          <p className={testResult.includes('réussie') ? 'text-green-600' : 'text-red-600'}>
            {testResult}
          </p>
        </div>
      )}
    </div>
  );
};

export default FirebaseTestComponent;
