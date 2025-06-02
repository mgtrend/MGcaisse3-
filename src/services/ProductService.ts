/**
 * Service de gestion des produits pour MGcaisse3.0
 * Gère les opérations CRUD sur les produits et intègre la gestion des icônes
 */

import { Product, ProductFilter, ProductFormData } from '../models/Product';
import { databaseService } from './DatabaseService';

export class ProductService {
  /**
   * Récupère tous les produits
   */
  public async getAllProducts(): Promise<Product[]> {
    try {
      return await databaseService.getAllProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Récupère un produit par son ID
   */
  public async getProductById(id: string): Promise<Product | null> {
    try {
      return await databaseService.getProductById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau produit
   */
  public async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastUpdated: new Date() // Ajout de la propriété manquante
      };
      
      await databaseService.saveProduct(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Met à jour un produit existant
   */
  public async updateProduct(id: string, productData: ProductFormData): Promise<Product> {
    try {
      const existingProduct = await this.getProductById(id);
      
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      const updatedProduct: Product = {
        ...existingProduct,
        ...productData,
        updatedAt: Date.now()
      };
      
      await databaseService.saveProduct(updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un produit
   */
  public async deleteProduct(id: string): Promise<void> {
    try {
      await databaseService.deleteProduct(id);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Filtre les produits selon les critères spécifiés
   */
  public async filterProducts(filter: ProductFilter): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      
      return allProducts.filter(product => {
        // Filtre par recherche textuelle
        if (filter.search && !product.name.toLowerCase().includes(filter.search.toLowerCase())) {
          return false;
        }
        
        // Filtre par catégorie
        if (filter.category && product.category !== filter.category) {
          return false;
        }
        
        return true;
      }).sort((a, b) => {
        // Tri par le champ spécifié
        if (!filter.sortBy) return 0;
        
        const direction = filter.sortDirection === 'desc' ? -1 : 1;
        
        switch (filter.sortBy) {
          case 'name':
            return direction * a.name.localeCompare(b.name);
          case 'price':
            return direction * (a.price - b.price);
          case 'stock':
            return direction * (a.stock - b.stock);
          case 'category':
            return direction * ((a.category || '').localeCompare(b.category || ''));
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  }

  /**
   * Met à jour le stock d'un produit
   */
  public async updateProductStock(id: string, newStock: number): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      const updatedProduct: Product = {
        ...product,
        stock: newStock,
        updatedAt: Date.now()
      };
      
      await databaseService.saveProduct(updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Décrémente le stock d'un produit (utilisé lors d'une vente)
   */
  public async decrementProductStock(id: string, quantity: number): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      return await this.updateProductStock(id, product.stock - quantity);
    } catch (error) {
      console.error(`Error decrementing stock for product ${id}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const productService = new ProductService();
