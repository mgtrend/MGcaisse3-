/**
 * Service de gestion des produits avec Firestore pour MGcaisse 3.0
 * Gère le stockage et la synchronisation des produits avec Firebase
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { Product, ProductFormData } from '../models/Product';
import { authService } from './authService';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

class FirestoreProductService {
  private products: Product[] = [];
  private listeners: ((products: Product[]) => void)[] = [];
  private unsubscribeFirestore: (() => void) | null = null;

  constructor() {
    // Initialiser l'écoute des changements dans Firestore
    this.initFirestoreListener();
  }

  /**
   * Initialise l'écoute des changements dans la collection des produits
   */
  private initFirestoreListener() {
    // Arrêter l'écoute précédente si elle existe
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
    }

    // Créer une nouvelle écoute
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    this.unsubscribeFirestore = onSnapshot(productsRef, (snapshot) => {
      const updatedProducts: Product[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        updatedProducts.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category || '',
          icon: data.icon || '',
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      });
      
      this.products = updatedProducts;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to Firestore products:', error);
    });
  }

  /**
   * Notifie tous les écouteurs d'un changement dans les produits
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener([...this.products]);
    });
  }

  /**
   * Ajoute un écouteur pour les changements dans les produits
   */
  public onProductsChange(listener: (products: Product[]) => void): () => void {
    this.listeners.push(listener);
    
    // Notifier immédiatement avec l'état actuel
    listener([...this.products]);
    
    // Retourner une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Récupère tous les produits
   */
  public async getAllProducts(): Promise<Product[]> {
    try {
      // Si les produits sont déjà chargés, les retourner
      if (this.products.length > 0) {
        return [...this.products];
      }
      
      // Sinon, les charger depuis Firestore
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(productsRef);
      
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category || '',
          icon: data.icon || '',
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      });
      
      this.products = products;
      return [...this.products];
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  /**
   * Récupère un produit par son ID
   */
  public async getProductById(id: string): Promise<Product | null> {
    try {
      // Vérifier d'abord dans le cache local
      const cachedProduct = this.products.find(p => p.id === id);
      if (cachedProduct) {
        return { ...cachedProduct };
      }
      
      // Sinon, récupérer depuis Firestore
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const data = productDoc.data();
        return {
          id: productDoc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category || '',
          icon: data.icon || '',
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Filtre les produits selon différents critères
   */
  public async filterProducts(filters: { search?: string, category?: string }): Promise<Product[]> {
    try {
      // Pour l'instant, nous filtrons côté client
      // Dans une implémentation plus avancée, on pourrait utiliser des requêtes Firestore
      let filteredProducts = [...this.products];
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          (product.category && product.category.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filters.category
        );
      }
      
      return filteredProducts;
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  }

  /**
   * Ajoute un nouveau produit
   */
  public async addProduct(productData: ProductFormData): Promise<Product> {
    try {
      // Vérifier si l'utilisateur est authentifié et admin
      if (!authService.isAuthenticated() || !authService.isAdmin()) {
        throw new Error('Unauthorized: Only admins can add products');
      }
      
      const productId = crypto.randomUUID();
      const newProduct: Product = {
        id: productId,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || '',
        icon: productData.icon || '',
        lastUpdated: new Date()
      };
      
      // Ajouter à Firestore
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await setDoc(productRef, {
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        category: newProduct.category,
        icon: newProduct.icon,
        lastUpdated: Timestamp.fromDate(newProduct.lastUpdated)
      });
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  /**
   * Met à jour un produit existant
   */
  public async updateProduct(id: string, productData: ProductFormData): Promise<Product> {
    try {
      // Vérifier si l'utilisateur est authentifié et admin
      if (!authService.isAuthenticated() || !authService.isAdmin()) {
        throw new Error('Unauthorized: Only admins can update products');
      }
      
      // Vérifier si le produit existe
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      const updatedProduct: Product = {
        id,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || '',
        icon: productData.icon || '',
        lastUpdated: new Date()
      };
      
      // Mettre à jour dans Firestore
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await setDoc(productRef, {
        name: updatedProduct.name,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        category: updatedProduct.category,
        icon: updatedProduct.icon,
        lastUpdated: Timestamp.fromDate(updatedProduct.lastUpdated)
      }, { merge: true });
      
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un produit
   */
  public async deleteProduct(id: string): Promise<void> {
    try {
      // Vérifier si l'utilisateur est authentifié et admin
      if (!authService.isAuthenticated() || !authService.isAdmin()) {
        throw new Error('Unauthorized: Only admins can delete products');
      }
      
      // Supprimer de Firestore
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Décrémente le stock d'un produit
   */
  public async decrementProductStock(id: string, quantity: number): Promise<Product> {
    try {
      // Récupérer le produit actuel
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      // Mettre à jour le stock
      const updatedProduct: Product = {
        ...product,
        stock: product.stock - quantity,
        lastUpdated: new Date()
      };
      
      // Mettre à jour dans Firestore
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await setDoc(productRef, {
        stock: updatedProduct.stock,
        lastUpdated: Timestamp.fromDate(updatedProduct.lastUpdated)
      }, { merge: true });
      
      return updatedProduct;
    } catch (error) {
      console.error(`Error decrementing stock for product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Importe plusieurs produits en une seule opération (batch)
   */
  public async importProducts(products: ProductFormData[]): Promise<Product[]> {
    try {
      // Vérifier si l'utilisateur est authentifié et admin
      if (!authService.isAuthenticated() || !authService.isAdmin()) {
        throw new Error('Unauthorized: Only admins can import products');
      }
      
      const batch = writeBatch(db);
      const importedProducts: Product[] = [];
      
      for (const productData of products) {
        const productId = crypto.randomUUID();
        const newProduct: Product = {
          id: productId,
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          category: productData.category || '',
          icon: productData.icon || '',
          lastUpdated: new Date()
        };
        
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        batch.set(productRef, {
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          icon: newProduct.icon,
          lastUpdated: Timestamp.fromDate(newProduct.lastUpdated)
        });
        
        importedProducts.push(newProduct);
      }
      
      await batch.commit();
      return importedProducts;
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }
}

// Singleton instance
export const firestoreProductService = new FirestoreProductService();
