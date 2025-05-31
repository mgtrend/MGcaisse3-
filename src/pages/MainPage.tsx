/**
 * Page principale de l'application MGcaisse3.0
 * Intègre la gestion des produits par icônes et l'optimisation mobile
 */

import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import ProductGrid from '../components/ProductGrid';
import CartSummary from '../components/CartSummary';
import { Sale } from '../models/Cart';

export const MainPage: React.FC = () => {
  const { products, loading: productsLoading, error: productsError, filterProducts } = useProducts();
  const { 
    cart, 
    loading: cartLoading, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    checkout,
    lastSale
  } = useCart();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showCart, setShowCart] = useState(false);

  // Gérer le redimensionnement de la fenêtre pour la vue mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowCart(false); // Réinitialiser l'état du panier en vue desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mettre à jour la vue quand une vente est finalisée
  useEffect(() => {
    if (lastSale) {
      setCurrentSale(lastSale);
      setShowReceipt(true);
    }
  }, [lastSale]);

  // Gérer la recherche de produits
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts({ search: value });
  };

  // Gérer le checkout
  const handleCheckout = async (paymentMethod: 'cash' | 'card' | 'd17') => {
    try {
      await checkout(paymentMethod);
    } catch (error) {
      console.error('Checkout error:', error);
      // Gérer l'erreur (pourrait être affiché dans un toast ou une notification)
    }
  };

  // Fermer le reçu
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCurrentSale(null);
  };

  // Basculer l'affichage du panier en vue mobile
  const toggleCart = () => {
    setShowCart(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">MGcaisse 3.0</h1>
            
            {/* Bouton panier mobile */}
            {isMobileView && (
              <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full bg-indigo-600 text-white"
              >
                {showCart ? '🛒 ✕' : '🛒'}
                {cart.items.length > 0 && !showCart && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.items.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
          </div>
        </div>

        {/* Layout responsive */}
        <div className={`${isMobileView ? '' : 'flex gap-6'}`}>
          {/* Liste des produits */}
          <div className={`${isMobileView ? 'w-full' : 'flex-1'} ${showCart && isMobileView ? 'hidden' : ''}`}>
            <ProductGrid
              products={products}
              onAddToCart={addToCart}
              loading={productsLoading}
              error={productsError}
            />
          </div>

          {/* Panier */}
          <div 
            className={`
              ${isMobileView ? 'w-full' : 'w-96'} 
              ${showCart || !isMobileView ? '' : 'hidden'}
              ${isMobileView ? 'mt-4' : ''}
            `}
          >
            <CartSummary
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
              isProcessing={cartLoading}
            />
            
            {/* Bouton retour en vue mobile */}
            {isMobileView && showCart && (
              <button
                onClick={toggleCart}
                className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour aux produits
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modal de reçu */}
      {showReceipt && currentSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-center">Reçu de Vente</h2>
              
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-500">
                  {new Date(currentSale.timestamp).toLocaleString()}
                </p>
                <p className="text-sm font-medium">
                  Méthode de paiement: {
                    currentSale.paymentMethod === 'cash' ? 'Espèces' :
                    currentSale.paymentMethod === 'card' ? 'Carte' : 'D17'
                  }
                </p>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Produit</th>
                      <th className="pb-2 text-right">Qté</th>
                      <th className="pb-2 text-right">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSale.items.map((item) => (
                      <tr key={item.productId}>
                        <td className="py-1">
                          <div className="flex items-center">
                            {item.product.icon && (
                              <span className="mr-1">{item.product.icon}</span>
                            )}
                            {item.product.name}
                          </div>
                        </td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">{item.totalPrice.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-1 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>{currentSale.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA ({(currentSale.taxRate * 100).toFixed(0)}%):</span>
                  <span>{currentSale.taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{currentSale.total.toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-4">
                <p>Merci pour votre achat!</p>
                <p>MGcaisse 3.0</p>
              </div>
              
              <button
                onClick={handleCloseReceipt}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
