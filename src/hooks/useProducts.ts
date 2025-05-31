/**
 * Hook React pour la gestion des produits dans MGcaisse3.0
 * Fournit les fonctionnalités de gestion des produits aux composants
 */

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilter, ProductFormData } from '../models/Product';
import { productService } from '../services/ProductService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>({});

  // Charger tous les produits
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer les produits
  const filterProducts = useCallback(async (newFilter: ProductFilter) => {
    try {
      setLoading(true);
      setError(null);
      setFilter(newFilter);
      
      const filteredProducts = await productService.filterProducts(newFilter);
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error filtering products:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du filtrage des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un produit
  const addProduct = useCallback(async (productData: ProductFormData) => {
    try {
      setError(null);
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout du produit');
      throw err;
    }
  }, []);

  // Mettre à jour un produit
  const updateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error(`Error updating product ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour du produit');
      throw err;
    }
  }, []);

  // Supprimer un produit
  const deleteProduct = useCallback(async (id: string) => {
    try {
      setError(null);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(`Error deleting product ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression du produit');
      throw err;
    }
  }, []);

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    filter,
    loadProducts,
    filterProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
