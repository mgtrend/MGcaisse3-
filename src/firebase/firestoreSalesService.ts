/**
 * Service de gestion des ventes avec Firestore pour MGcaisse 3.0
 * Gère le stockage et la synchronisation des ventes avec Firebase
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Sale, PaymentMethod } from '../models/Cart';
import { firestoreProductService } from './firestoreProductService';
import { authService } from './authService';

// Collection Firestore pour les ventes
const SALES_COLLECTION = 'sales';
// Dossier Storage pour les sauvegardes
const BACKUPS_FOLDER = 'backups';

class FirestoreSalesService {
  private sales: Sale[] = [];
  private listeners: ((sales: Sale[]) => void)[] = [];
  private unsubscribeFirestore: (() => void) | null = null;

  constructor() {
    // Initialiser l'écoute des changements dans Firestore
    this.initFirestoreListener();
  }

  /**
   * Initialise l'écoute des changements dans la collection des ventes
   */
  private initFirestoreListener() {
    // Arrêter l'écoute précédente si elle existe
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
    }

    // Créer une nouvelle écoute
    const salesRef = collection(db, SALES_COLLECTION);
    const q = query(salesRef, orderBy('timestamp', 'desc'));
    
    this.unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const updatedSales: Sale[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        updatedSales.push({
          id: doc.id,
          items: data.items,
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp.toDate().getTime(),
          synced: true
        });
      });
      
      this.sales = updatedSales;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to Firestore sales:', error);
    });
  }

  /**
   * Notifie tous les écouteurs d'un changement dans les ventes
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener([...this.sales]);
    });
  }

  /**
   * Ajoute un écouteur pour les changements dans les ventes
   */
  public onSalesChange(listener: (sales: Sale[]) => void): () => void {
    this.listeners.push(listener);
    
    // Notifier immédiatement avec l'état actuel
    listener([...this.sales]);
    
    // Retourner une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Récupère toutes les ventes
   */
  public async getAllSales(): Promise<Sale[]> {
    try {
      // Si les ventes sont déjà chargées, les retourner
      if (this.sales.length > 0) {
        return [...this.sales];
      }
      
      // Sinon, les charger depuis Firestore
      const salesRef = collection(db, SALES_COLLECTION);
      const q = query(salesRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      const sales: Sale[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        sales.push({
          id: doc.id,
          items: data.items,
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp.toDate().getTime(),
          synced: true
        });
      });
      
      this.sales = sales;
      return [...this.sales];
    } catch (error) {
      console.error('Error getting sales:', error);
      throw error;
    }
  }

  /**
   * Récupère une vente par son ID
   */
  public async getSaleById(id: string): Promise<Sale | null> {
    try {
      // Vérifier d'abord dans le cache local
      const cachedSale = this.sales.find(s => s.id === id);
      if (cachedSale) {
        return { ...cachedSale };
      }
      
      // Sinon, récupérer depuis Firestore
      const saleRef = doc(db, SALES_COLLECTION, id);
      const saleDoc = await getDoc(saleRef);
      
      if (saleDoc.exists()) {
        const data = saleDoc.data();
        return {
          id: saleDoc.id,
          items: data.items,
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp.toDate().getTime(),
          synced: true
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting sale with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Filtre les ventes selon différents critères
   */
  public async filterSales(filters: { 
    startDate?: Date, 
    endDate?: Date, 
    paymentMethod?: PaymentMethod 
  }): Promise<Sale[]> {
    try {
      // Pour l'instant, nous filtrons côté client
      // Dans une implémentation plus avancée, on pourrait utiliser des requêtes Firestore
      let filteredSales = [...this.sales];
      
      if (filters.startDate) {
        const startTimestamp = filters.startDate.getTime();
        filteredSales = filteredSales.filter(sale => 
          sale.timestamp >= startTimestamp
        );
      }
      
      if (filters.endDate) {
        const endTimestamp = filters.endDate.getTime();
        filteredSales = filteredSales.filter(sale => 
          sale.timestamp <= endTimestamp
        );
      }
      
      if (filters.paymentMethod) {
        filteredSales = filteredSales.filter(sale => 
          sale.paymentMethod === filters.paymentMethod
        );
      }
      
      return filteredSales;
    } catch (error) {
      console.error('Error filtering sales:', error);
      throw error;
    }
  }

  /**
   * Enregistre une nouvelle vente
   */
  public async saveSale(sale: Sale): Promise<Sale> {
    try {
      // Mettre à jour les stocks des produits
      for (const item of sale.items) {
        await firestoreProductService.decrementProductStock(item.productId, item.quantity);
      }
      
      // Préparer les données pour Firestore
      const saleData = {
        items: sale.items,
        subtotal: sale.subtotal,
        taxRate: sale.taxRate,
        taxAmount: sale.taxAmount,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        timestamp: Timestamp.fromMillis(sale.timestamp),
        userId: authService.getCurrentUser()?.uid || 'anonymous'
      };
      
      // Enregistrer dans Firestore
      const saleRef = doc(db, SALES_COLLECTION, sale.id);
      await setDoc(saleRef, saleData);
      
      // Mettre à jour le statut de synchronisation
      const syncedSale: Sale = {
        ...sale,
        synced: true
      };
      
      return syncedSale;
    } catch (error) {
      console.error('Error saving sale:', error);
      throw error;
    }
  }

  /**
   * Crée une sauvegarde des données de vente
   */
  public async createBackup(): Promise<string> {
    try {
      // Vérifier si l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        throw new Error('Unauthorized: User must be authenticated to create backups');
      }
      
      // Récupérer toutes les ventes
      const sales = await this.getAllSales();
      
      // Créer un objet de sauvegarde
      const backup = {
        sales,
        createdAt: new Date().toISOString(),
        userId: authService.getCurrentUser()?.uid || 'anonymous'
      };
      
      // Convertir en JSON
      const backupJson = JSON.stringify(backup, null, 2);
      
      // Créer un nom de fichier unique
      const fileName = `sales_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      // Référence au fichier dans Storage
      const backupRef = ref(storage, `${BACKUPS_FOLDER}/${fileName}`);
      
      // Uploader le fichier
      await uploadString(backupRef, backupJson, 'raw');
      
      // Récupérer l'URL de téléchargement
      const downloadUrl = await getDownloadURL(backupRef);
      
      return downloadUrl;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des ventes
   */
  public async getSalesStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageTicket: number;
    topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
  }> {
    try {
      // Récupérer les ventes pour la période spécifiée
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const sales = await this.filterSales({ startDate });
      
      // Calculer les statistiques
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
      
      // Calculer les produits les plus vendus
      const productMap = new Map<string, { 
        productId: string; 
        name: string; 
        quantity: number; 
        revenue: number 
      }>();
      
      for (const sale of sales) {
        for (const item of sale.items) {
          const existing = productMap.get(item.productId);
          
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.totalPrice;
          } else {
            productMap.set(item.productId, {
              productId: item.productId,
              name: item.product.name,
              quantity: item.quantity,
              revenue: item.totalPrice
            });
          }
        }
      }
      
      // Trier par revenu
      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      return {
        totalSales,
        totalRevenue,
        averageTicket,
        topProducts
      };
    } catch (error) {
      console.error('Error getting sales stats:', error);
      throw error;
    }
  }
}

// Singleton instance
export const firestoreSalesService = new FirestoreSalesService();
