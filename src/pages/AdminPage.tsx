"use client"

import { useState, useEffect, useCallback } from "react"
import { useProducts } from "../hooks/useProducts"
import ProductForm from "../components/ProductForm"
import ProductGrid from "../components/ProductGrid"
import type { Product } from "../models/Product"
import { Button } from "../components/ui/button"
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { ProductFilters, type SortOption, extractCategories } from "../components/ProductFilters"
import { Toaster } from "sonner"
import { notify } from "../components/ui/toast-notification"

/**
 * Page d'administration améliorée avec filtrage, tri et notifications
 */
const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  // Extraire les catégories uniques des produits
  useEffect(() => {
    if (products.length > 0) {
      setCategories(extractCategories(products))
    }
  }, [products])

  // Gérer la soumission du formulaire (ajout ou modification)
  const handleFormSubmit = useCallback(
    (product: Product) => {
      if (editingProduct) {
        updateProduct(product)
        notify(`Produit "${product.name}" mis à jour`, "success")
      } else {
        addProduct(product)
        notify(`Produit "${product.name}" ajouté`, "success")
      }
      setIsFormOpen(false)
      setEditingProduct(null)
    },
    [addProduct, updateProduct, editingProduct],
  )

  // Ouvrir le formulaire en mode édition
  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }, [])

  // Confirmer la suppression d'un produit
  const handleConfirmDelete = useCallback(() => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
      notify(`Produit "${productToDelete.name}" supprimé`, "info")
      setProductToDelete(null)
    }
  }, [deleteProduct, productToDelete])

  // Gérer le clic sur un produit dans la grille
  const handleProductClick = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" richColors closeButton />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/app">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Administration des produits</h1>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Filtres de produits */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Affichage conditionnel : formulaire ou grille de produits */}
      {isFormOpen ? (
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingProduct ? `Modifier ${editingProduct.name}` : "Nouveau produit"}
            </h2>
            <Button
              variant="ghost"
              onClick={() => {
                setIsFormOpen(false)
                setEditingProduct(null)
              }}
            >
              Annuler
            </Button>
          </div>

          <ProductForm product={editingProduct} onSubmit={handleFormSubmit} existingCategories={categories} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          {/* Grille de produits */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <ProductGrid
                  products={products}
                  onProductClick={handleProductClick}
                  compact={false}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                  selectedCategory={selectedCategory}
                />
              </div>
            )}
          </div>

          {/* Actions rapides pour chaque produit */}
          <div className="hidden md:block">
            <div className="bg-muted/30 p-4 rounded-lg w-64">
              <h3 className="font-medium mb-3">Actions rapides</h3>
              {products.length > 0 ? (
                <ul className="space-y-2">
                  {products
                    .filter(
                      (p) =>
                        (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                        (selectedCategory === null || p.category === selectedCategory),
                    )
                    .map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center justify-between p-2 rounded bg-background hover:bg-muted"
                      >
                        <span className="truncate flex-1 text-sm">{product.name}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun produit disponible</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminPage
