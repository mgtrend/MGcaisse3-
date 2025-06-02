"use client"

import { useState, useEffect, useCallback } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCart } from "../hooks/useCart"
import ProductGrid from "../components/ProductGrid"
import CartSummary from "../components/CartSummary"
import type { Product } from "../models/Product"
import { ProductFilters, type SortOption, extractCategories } from "../components/ProductFilters"
import { Toaster } from "sonner"
import { notify } from "../components/ui/toast-notification"
import { useMobile } from "../hooks/use-mobile"
import { ShoppingCart } from "lucide-react"
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"

/**
 * Page principale de l'application (caisse)
 * Améliorée avec filtrage, tri et notifications
 */
const MainPage = () => {
  const { products, loading: productsLoading } = useProducts()
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, checkout } = useCart()

  const isMobile = useMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Extraire les catégories uniques des produits
  useEffect(() => {
    if (products.length > 0) {
      setCategories(extractCategories(products))
    }
  }, [products])

  // Gérer l'ajout d'un produit au panier
  const handleProductClick = useCallback(
    (product: Product) => {
      addToCart(product)
      notify(`${product.name} ajouté au panier`, "success")

      // Sur mobile, ouvrir automatiquement le panier après l'ajout d'un produit
      if (isMobile) {
        setIsCartOpen(true)
      }
    },
    [addToCart, isMobile],
  )

  // Gérer la finalisation de la vente
  const handleCheckout = useCallback(() => {
    checkout()
    setIsCartOpen(false)
  }, [checkout])

  // Calculer les IDs des produits dans le panier pour les mettre en surbrillance
  const cartProductIds = cartItems.map((item) => item.id)

  return (
    <div className="container mx-auto p-4 h-full">
      <Toaster position="top-center" richColors closeButton />

      <div className="flex flex-col h-full gap-4">
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

        <div className="flex flex-1 gap-4 min-h-0">
          {/* Grille de produits */}
          <div className="flex-1 overflow-auto">
            {productsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
                compact={true}
                searchTerm={searchTerm}
                sortOption={sortOption}
                selectedCategory={selectedCategory}
                selectedProductIds={cartProductIds}
              />
            )}
          </div>

          {/* Panier (version desktop) */}
          {!isMobile && (
            <div className="w-80 hidden md:block">
              <CartSummary
                items={cartItems}
                onQuantityChange={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
              />
            </div>
          )}
        </div>

        {/* Bouton panier flottant (version mobile) */}
        {isMobile && (
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-10">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 p-0">
              <CartSummary
                items={cartItems}
                onQuantityChange={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
                className="border-0 rounded-none h-full"
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}

export default MainPage
