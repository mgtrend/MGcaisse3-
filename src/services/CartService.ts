/**
 * Service de gestion du panier pour MGcaisse3.0
 * Gère les opérations sur le panier et les ventes
 */

import { Cart, CartItem, PaymentMethod, Sale } from '../models/Cart';
import { databaseService } from './DatabaseService';
import { productService } from './ProductService';

export class CartService {
  private cart: Cart;
  private readonly TAX_RATE = 0.19; // 19% TVA

  constructor() {
    // Initialiser un panier vide
    this.cart = {
      items: [],
      subtotal: 0,
      taxRate: this.TAX_RATE,
      taxAmount: 0,
      total: 0
    };
  }

  /**
   * Récupère l'état actuel du panier
   */
  public getCart(): Cart {
    return { ...this.cart };
  }

  /**
   * Ajoute un produit au panier
   */
  public async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    try {
      const product = await productService.getProductById(productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = this.cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si le produit est déjà dans le panier
        const newQuantity = this.cart.items[existingItemIndex].quantity + quantity;
        
        if (product.stock < newQuantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        
        this.cart.items[existingItemIndex].quantity = newQuantity;
        this.cart.items[existingItemIndex].totalPrice = newQuantity * product.price;
      } else {
        // Ajouter un nouvel élément au panier
        const newItem: CartItem = {
          productId,
          product,
          quantity,
          unitPrice: product.price,
          totalPrice: quantity * product.price
        };
        
        this.cart.items.push(newItem);
      }
      
      // Recalculer les totaux
      this._recalculateCart();
      
      return { ...this.cart };
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }

  /**
   * Met à jour la quantité d'un produit dans le panier
   */
  public async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      
      const itemIndex = this.cart.items.findIndex(item => item.productId === productId);
      
      if (itemIndex < 0) {
        throw new Error(`Product with ID ${productId} not found in cart`);
      }
      
      const product = await productService.getProductById(productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      this.cart.items[itemIndex].quantity = quantity;
      this.cart.items[itemIndex].totalPrice = quantity * this.cart.items[itemIndex].unitPrice;
      
      // Recalculer les totaux
      this._recalculateCart();
      
      return { ...this.cart };
    } catch (error) {
      console.error('Error updating quantity in cart:', error);
      throw error;
    }
  }

  /**
   * Supprime un produit du panier
   */
  public removeFromCart(productId: string): Cart {
    this.cart.items = this.cart.items.filter(item => item.productId !== productId);
    
    // Recalculer les totaux
    this._recalculateCart();
    
    return { ...this.cart };
  }

  /**
   * Vide le panier
   */
  public clearCart(): Cart {
    this.cart = {
      items: [],
      subtotal: 0,
      taxRate: this.TAX_RATE,
      taxAmount: 0,
      total: 0
    };
    
    return { ...this.cart };
  }

  /**
   * Finalise la vente avec la méthode de paiement spécifiée
   */
  public async checkout(paymentMethod: PaymentMethod): Promise<Sale> {
    try {
      if (this.cart.items.length === 0) {
        throw new Error('Cannot checkout with empty cart');
      }
      
      // Vérifier les stocks avant de finaliser
      for (const item of this.cart.items) {
        const product = await productService.getProductById(item.productId);
        
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
      }
      
      // Créer l'objet vente
      const sale: Sale = {
        id: crypto.randomUUID(),
        items: [...this.cart.items],
        subtotal: this.cart.subtotal,
        taxRate: this.cart.taxRate,
        taxAmount: this.cart.taxAmount,
        total: this.cart.total,
        paymentMethod,
        timestamp: Date.now(),
        synced: false
      };
      
      // Enregistrer la vente
      await databaseService.saveSale(sale);
      
      // Mettre à jour les stocks
      for (const item of this.cart.items) {
        await productService.decrementProductStock(item.productId, item.quantity);
      }
      
      // Vider le panier
      this.clearCart();
      
      return sale;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }

  /**
   * Recalcule les totaux du panier
   */
  private _recalculateCart(): void {
    // Calculer le sous-total
    this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Calculer la TVA
    this.cart.taxAmount = this.cart.subtotal * this.cart.taxRate;
    
    // Calculer le total
    this.cart.total = this.cart.subtotal + this.cart.taxAmount;
  }
}

// Singleton instance
export const cartService = new CartService();
