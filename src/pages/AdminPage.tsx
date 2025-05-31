/**
 * Page d'administration pour MGcaisse3.0
 * Permet la gestion des produits avec icônes, avec transparence sur les limitations client-side
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import { Product, ProductFormData } from '../models/Product';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les produits en fonction du terme de recherche
  useEffect(() => {
    if (!products) return;

    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  // Gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Gérer l'ajout d'un produit
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsAdding(true);
    setIsEditing(false);
    setFormError(null);
  };

  // Gérer la modification d'un produit
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAdding(false);
    setIsEditing(true);
    setFormError(null);
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await deleteProduct(productId);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erreur lors de la suppression du produit.');
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmitForm = async (productData: ProductFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (isAdding) {
        await addProduct(productData);
        setIsAdding(false);
      } else if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        setIsEditing(false);
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Annuler l'ajout/modification
  const handleCancelForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedProduct(null);
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 mr-2">⚙️</span>
              <h1 className="text-xl font-bold text-gray-900">Administration MGcaisse 3.0</h1>
            </div>
            <div>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 mr-4"
              >
                Accueil
              </Link>
              <Link
                to="/app"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Application
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bannière d'avertissement */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-lg">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Mode administration non sécurisé. Les modifications affectent uniquement les données de ce navigateur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Formulaire d'ajout/modification */}
        {(isAdding || isEditing) && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {isAdding ? 'Ajouter un produit' : 'Modifier le produit'}
            </h2>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
              error={formError}
            />
          </div>
        )}

        {/* Gestion des produits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Gestion des produits</h2>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ajouter un produit
            </button>
          </div>

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

          {/* Liste des produits */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-md text-center">
              <p className="text-lg">Aucun produit trouvé</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'Essayez une autre recherche.' : 'Ajoutez des produits pour les voir apparaître ici.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icône
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-md">
                          {product.icon ? (
                            <span className="text-xl">{product.icon}</span>
                          ) : (
                            <span className="text-gray-400">?</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.price.toFixed(2)} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock < 5 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
