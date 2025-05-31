/**
 * Hook React pour la synchronisation des données avec Firebase
 * Gère la synchronisation entre les appareils et les sauvegardes automatiques
 */

import { useState, useEffect, useCallback } from 'react';
import { firestoreProductService } from './firestoreProductService';
import { firestoreSalesService } from './firestoreSalesService';
import { authService } from './authService';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Intervalle de sauvegarde automatique en millisecondes (1 heure)
const AUTO_BACKUP_INTERVAL = 60 * 60 * 1000;

export function useFirebaseSync() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [backupUrls, setBackupUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour forcer une synchronisation manuelle
  const syncNow = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      setError(null);
      
      // Vérifier si l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour synchroniser les données');
      }
      
      // Récupérer les produits et les ventes depuis Firestore
      // (Cela se fait automatiquement grâce aux écouteurs dans les services)
      await firestoreProductService.getAllProducts();
      await firestoreSalesService.getAllSales();
      
      // Mettre à jour le statut de synchronisation
      setLastSyncTime(new Date());
      setSyncStatus('idle');
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue lors de la synchronisation');
      setSyncStatus('error');
      return false;
    }
  }, []);

  // Fonction pour créer une sauvegarde manuelle
  const createBackup = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      setError(null);
      
      // Vérifier si l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour créer une sauvegarde');
      }
      
      // Créer une sauvegarde des ventes
      const salesBackupUrl = await firestoreSalesService.createBackup();
      
      // Créer une sauvegarde complète (produits + ventes)
      const products = await firestoreProductService.getAllProducts();
      const sales = await firestoreSalesService.getAllSales();
      
      const fullBackup = {
        products,
        sales,
        createdAt: new Date().toISOString(),
        userId: authService.getCurrentUser()?.uid || 'anonymous'
      };
      
      // Convertir en JSON
      const backupJson = JSON.stringify(fullBackup, null, 2);
      
      // Créer un nom de fichier unique
      const fileName = `full_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      // Référence au fichier dans Storage
      const backupRef = ref(storage, `backups/${fileName}`);
      
      // Uploader le fichier
      await uploadString(backupRef, backupJson, 'raw');
      
      // Récupérer l'URL de téléchargement
      const fullBackupUrl = await getDownloadURL(backupRef);
      
      // Mettre à jour la liste des sauvegardes
      setBackupUrls(prev => [...prev, fullBackupUrl]);
      
      // Mettre à jour le statut de synchronisation
      setLastSyncTime(new Date());
      setSyncStatus('idle');
      
      return fullBackupUrl;
    } catch (error) {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue lors de la création de la sauvegarde');
      setSyncStatus('error');
      throw error;
    }
  }, []);

  // Configurer la synchronisation automatique
  useEffect(() => {
    // Synchroniser au chargement si l'utilisateur est authentifié
    if (authService.isAuthenticated()) {
      syncNow();
    }
    
    // Configurer les écouteurs d'authentification
    const unsubscribeAuth = authService.onAuthStateChange((user) => {
      if (user) {
        // Synchroniser lorsque l'utilisateur se connecte
        syncNow();
      }
    });
    
    // Configurer la sauvegarde automatique
    let backupInterval: NodeJS.Timeout | null = null;
    
    if (authService.isAuthenticated()) {
      backupInterval = setInterval(async () => {
        try {
          // Créer une sauvegarde automatique si l'utilisateur est connecté
          if (authService.isAuthenticated()) {
            await createBackup();
            console.log('Sauvegarde automatique créée avec succès');
          }
        } catch (error) {
          console.error('Erreur lors de la sauvegarde automatique:', error);
        }
      }, AUTO_BACKUP_INTERVAL);
    }
    
    // Nettoyer les écouteurs et intervalles
    return () => {
      unsubscribeAuth();
      if (backupInterval) {
        clearInterval(backupInterval);
      }
    };
  }, [syncNow, createBackup]);

  return {
    syncStatus,
    lastSyncTime,
    backupUrls,
    error,
    syncNow,
    createBackup
  };
}
