/**
 * Modèle de données pour les produits dans MGcaisse3.0
 * Inclut le support pour les icônes (emoji ou classe CSS)
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  icon?: string; // Emoji ou classe CSS de l'icône (ex: "🍕" ou "fas fa-pizza-slice")
  lastUpdated: Date; // Ajout de la propriété manquante
  createdAt: number;
  updatedAt: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  icon?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'stock' | 'category';
  sortDirection?: 'asc' | 'desc';
}
