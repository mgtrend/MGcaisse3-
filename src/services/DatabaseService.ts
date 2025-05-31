/**
 * Service de gestion de la base de données pour MGcaisse3.0
 * Utilise IndexedDB pour le stockage local des données
 * Version adaptée et modernisée pour TypeScript
 */

import { Product } from '../models/Product';
import { Sale } from '../models/Cart';

export class DatabaseService {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private isInitialized: boolean = false;

  constructor(dbName: string = "MGCaisseDB_v3", version: number = 1) {
    this.dbName = dbName;
    this.version = version;
    console.log(`DatabaseService instantiated for ${this.dbName} v${this.version}`);
  }

  /**
   * Initialise la base de données
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.db = await this._openDB();
      this.isInitialized = true;
      console.log(`Database ${this.dbName} initialized successfully`);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Ouvre ou crée la base de données IndexedDB.
   */
  private async _openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error("Database error:", error);
        reject(new Error(`Erreur d'ouverture de la base de données: ${error?.message || 'Unknown error'}`));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log(`Database ${this.dbName} opened successfully.`);
        
        // Attacher un gestionnaire d'erreur global à la connexion DB
        this.db.onerror = (event) => {
          console.error(`Database error (global): ${(event.target as IDBRequest).error}`);
        };
        
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        console.log(`Upgrading database ${this.dbName} from version ${event.oldVersion} to ${event.newVersion}...`);
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Création des object stores si nécessaire
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('name', 'name', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
          console.log('Created products store');
        }

        if (!db.objectStoreNames.contains('sales')) {
          const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
          salesStore.createIndex('timestamp', 'timestamp', { unique: false });
          salesStore.createIndex('synced', 'synced', { unique: false });
          console.log('Created sales store');
        }
      };
    });
  }

  /**
   * Ajoute ou met à jour un produit dans la base de données
   */
  public async saveProduct(product: Product): Promise<string> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        
        // Si c'est un nouveau produit, générer un ID
        if (!product.id) {
          product.id = crypto.randomUUID();
        }
        
        // Mettre à jour les timestamps
        const now = Date.now();
        if (!product.createdAt) {
          product.createdAt = now;
        }
        product.updatedAt = now;
        
        const request = store.put(product);
        
        request.onsuccess = () => {
          console.log(`Product saved: ${product.id}`);
          resolve(product.id);
        };
        
        request.onerror = (event) => {
          console.error('Error saving product:', (event.target as IDBRequest).error);
          reject(new Error(`Failed to save product: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }

  /**
   * Récupère tous les produits de la base de données
   */
  public async getAllProducts(): Promise<Product[]> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['products'], 'readonly');
        const store = transaction.objectStore('products');
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result as Product[]);
        };
        
        request.onerror = (event) => {
          console.error('Error getting products:', (event.target as IDBRequest).error);
          reject(new Error(`Failed to get products: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }

  /**
   * Récupère un produit par son ID
   */
  public async getProductById(id: string): Promise<Product | null> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['products'], 'readonly');
        const store = transaction.objectStore('products');
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result as Product || null);
        };
        
        request.onerror = (event) => {
          console.error(`Error getting product ${id}:`, (event.target as IDBRequest).error);
          reject(new Error(`Failed to get product: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }

  /**
   * Supprime un produit par son ID
   */
  public async deleteProduct(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.delete(id);
        
        request.onsuccess = () => {
          console.log(`Product deleted: ${id}`);
          resolve();
        };
        
        request.onerror = (event) => {
          console.error(`Error deleting product ${id}:`, (event.target as IDBRequest).error);
          reject(new Error(`Failed to delete product: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }

  /**
   * Enregistre une vente dans la base de données
   */
  public async saveSale(sale: Sale): Promise<string> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['sales'], 'readwrite');
        const store = transaction.objectStore('sales');
        
        // Si c'est une nouvelle vente, générer un ID
        if (!sale.id) {
          sale.id = crypto.randomUUID();
        }
        
        // S'assurer que le timestamp est défini
        if (!sale.timestamp) {
          sale.timestamp = Date.now();
        }
        
        // Par défaut, les ventes ne sont pas synchronisées
        if (sale.synced === undefined) {
          sale.synced = false;
        }
        
        const request = store.put(sale);
        
        request.onsuccess = () => {
          console.log(`Sale saved: ${sale.id}`);
          resolve(sale.id);
        };
        
        request.onerror = (event) => {
          console.error('Error saving sale:', (event.target as IDBRequest).error);
          reject(new Error(`Failed to save sale: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }

  /**
   * Récupère toutes les ventes de la base de données
   */
  public async getAllSales(): Promise<Sale[]> {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(['sales'], 'readonly');
        const store = transaction.objectStore('sales');
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result as Sale[]);
        };
        
        request.onerror = (event) => {
          console.error('Error getting sales:', (event.target as IDBRequest).error);
          reject(new Error(`Failed to get sales: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      } catch (error) {
        console.error('Transaction error:', error);
        reject(error);
      }
    });
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
