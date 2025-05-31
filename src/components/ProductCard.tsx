/**
 * Composant carte de produit pour MGcaisse3.0
 * Affiche un produit avec son icône et permet de l'ajouter au panier
 */

import React from 'react';
import { Product } from '../models/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  compact?: boolean; // Mode compact pour mobile
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onProductClick,
  compact = false
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id, 1);
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Vérifier si le stock est bas (moins de 5 unités)
  const isLowStock = product.stock < 5;

  return (
    <div 
      onClick={handleClick}
      className={`
        relative bg-white border rounded-lg shadow-sm overflow-hidden transition-all
        hover:shadow-md hover:border-indigo-300 cursor-pointer
        ${compact ? 'p-2' : 'p-4'}
      `}
    >
      {/* Indicateur de stock bas */}
      {isLowStock && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          Stock bas
        </div>
      )}

      <div className={`flex ${compact ? 'flex-row items-center' : 'flex-col items-center'}`}>
        {/* Icône du produit */}
        <div className={`
          flex items-center justify-center bg-gray-50 rounded-lg
          ${compact ? 'h-10 w-10 mr-3' : 'h-20 w-20 mb-3'}
        `}>
          {product.icon ? (
            <span className={`${compact ? 'text-2xl' : 'text-4xl'}`}>{product.icon}</span>
          ) : (
            <div className={`
              bg-gray-200 rounded-lg flex items-center justify-center
              ${compact ? 'h-10 w-10' : 'h-20 w-20'}
            `}>
              <span className="text-gray-400">?</span>
            </div>
          )}
        </div>

        {/* Informations du produit */}
        <div className={`${compact ? 'flex-1' : 'w-full text-center'}`}>
          <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-lg mb-1'}`}>
            {product.name}
          </h3>
          
          {!compact && product.category && (
            <p className="text-xs text-gray-500 mb-2">{product.category}</p>
          )}
          
          <div className={`flex ${compact ? 'justify-between items-center' : 'justify-center mt-2'}`}>
            <span className={`font-bold text-indigo-600 ${compact ? 'text-sm' : 'text-lg'}`}>
              {product.price.toFixed(2)} €
            </span>
            
            {!compact && (
              <span className="text-xs text-gray-500 ml-2">
                Stock: {product.stock}
              </span>
            )}
          </div>
        </div>

        {/* Bouton d'ajout au panier (visible uniquement en mode non compact) */}
        {!compact && (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ajouter
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
