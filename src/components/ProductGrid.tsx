/**
 * Composant grille de produits pour MGcaisse3.0
 * Affiche les produits en mode grille ou liste selon la taille d'écran
 */

import React, { useState } from 'react';
import { Product } from '../models/Product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onProductClick,
  loading = false,
  error = null
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-md text-center">
        <p className="text-lg">Aucun produit disponible</p>
        <p className="text-sm mt-2">Ajoutez des produits pour les voir apparaître ici.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Contrôles de vue (visible uniquement sur desktop) */}
      <div className="hidden sm:flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Grille
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 border-l-0`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Grille de produits - Responsive */}
      <div className={`
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        ${viewMode === 'list' ? 'sm:!grid-cols-1' : ''}
      `}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
            compact={viewMode === 'list' || false}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
