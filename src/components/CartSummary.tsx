/**
 * Composant résumé du panier pour MGcaisse3.0
 * Affiche le contenu du panier et permet de finaliser la vente
 */

import React, { useState } from 'react';
import { Cart, PaymentMethod } from '../models/Cart';
import type { CartItem } from '../models/Cart';

interface CartSummaryProps {
  cart: Cart;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
  isProcessing?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isProcessing = false
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Gérer le paiement
  const handlePayment = (method: PaymentMethod) => {
    onCheckout(method);
    setShowPaymentOptions(false);
  };

  // Afficher un message si le panier est vide
  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Votre panier est vide</h3>
          <p className="text-gray-500">Ajoutez des produits pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* En-tête du panier */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-medium text-gray-900">Panier</h2>
      </div>

      {/* Liste des articles */}
      <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {cart.items.map((item) => (
          <CartItemComponent
            key={item.productId}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))}
      </ul>

      {/* Résumé des totaux */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Sous-total:</span>
          <span>{cart.subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>TVA ({(cart.taxRate * 100).toFixed(0)}%):</span>
          <span>{cart.taxAmount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{cart.total.toFixed(2)} €</span>
        </div>
      </div>

      {/* Actions du panier */}
      <div className="border-t border-gray-200 px-4 py-3 space-y-3">
        {showPaymentOptions ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Choisir un mode de paiement:</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePayment('cash')}
                disabled={isProcessing}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Espèces
              </button>
              <button
                onClick={() => handlePayment('card')}
                disabled={isProcessing}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Carte
              </button>
              <button
                onClick={() => handlePayment('d17')}
                disabled={isProcessing}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                D17
              </button>
            </div>
            <button
              onClick={() => setShowPaymentOptions(false)}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setShowPaymentOptions(true)}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isProcessing ? 'Traitement en cours...' : 'Payer'}
            </button>
            <button
              onClick={onClearCart}
              disabled={isProcessing}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Sous-composant pour un article du panier
const CartItemComponent: React.FC<{
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <li className="px-4 py-3">
      <div className="flex items-center">
        {/* Icône du produit */}
        <div className="flex-shrink-0 h-10 w-10 bg-gray-50 rounded-md flex items-center justify-center mr-3">
          {item.product.icon ? (
            <span className="text-xl">{item.product.icon}</span>
          ) : (
            <span className="text-gray-400">?</span>
          )}
        </div>

        {/* Informations du produit */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
          <p className="text-xs text-gray-500">{item.unitPrice.toFixed(2)} € × {item.quantity}</p>
        </div>

        {/* Prix total */}
        <div className="flex-shrink-0 text-sm font-medium text-gray-900">
          {item.totalPrice.toFixed(2)} €
        </div>
      </div>

      {/* Contrôles de quantité */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-2 py-1 text-sm">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
};

export default CartSummary;
