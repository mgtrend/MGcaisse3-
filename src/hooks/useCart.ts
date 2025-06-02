/**
 * Hook React pour la gestion du panier dans MGcaisse3.0
 * Fournit les fonctionnalités de gestion du panier aux composants
 */

import { useState, useCallback } from 'react';
import { Cart, PaymentMethod, Sale } from '../models/Cart';
import { cartService } from '../services/CartService';

export function useCart() {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // Ajouter un produit au panier
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout au panier');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour la quantité d'un produit dans le panier
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour de la quantité');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un produit du panier
  const removeFromCart = useCallback((productId: string) => {
    try {
      setError(null);
      
      const updatedCart = cartService.removeFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression du produit du panier');
      throw err;
    }
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    try {
      setError(null);
      
      const emptyCart = cartService.clearCart();
      setCart(emptyCart);
      return emptyCart;
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la vidange du panier');
      throw err;
    }
  }, []);

  // Finaliser la vente
  const checkout = useCallback(async (paymentMethod: PaymentMethod) => {
    try {
      setLoading(true);
      setError(null);
      
      const sale = await cartService.checkout(paymentMethod);
      setLastSale(sale);
      setCart(cartService.getCart()); // Panier vide après checkout
      return sale;
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la finalisation de la vente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cart,
    loading,
    error,
    lastSale,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout
  };
}
