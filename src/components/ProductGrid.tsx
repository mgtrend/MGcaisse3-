"use client"

import { memo } from "react"
import ProductCard from "./ProductCard"
import type { Product } from "../models/Product"
import { filterAndSortProducts, type SortOption } from "./ProductFilters"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
  compact?: boolean
  searchTerm: string
  sortOption: SortOption
  selectedCategory: string | null
  selectedProductIds?: string[]
}

/**
 * Grille de produits optimisée avec memo
 * Intègre le filtrage et le tri des produits
 */
const ProductGrid = memo(
  ({
    products,
    onProductClick,
    compact = false,
    searchTerm = "",
    sortOption = "name-asc",
    selectedCategory = null,
    selectedProductIds = [],
  }: ProductGridProps) => {
    // Filtrer et trier les produits
    const filteredProducts = filterAndSortProducts(products, searchTerm, sortOption, selectedCategory)

    // État vide
    if (filteredProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg h-64">
          <p className="text-lg font-medium text-muted-foreground mb-2">Aucun produit trouvé</p>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchTerm || selectedCategory
              ? "Essayez de modifier vos critères de recherche ou de filtrage."
              : "Ajoutez des produits depuis la page d'administration."}
          </p>
        </div>
      )
    }

    return (
      <div
        className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            compact={compact}
            selected={selectedProductIds?.includes(product.id)}
          />
        ))}
      </div>
    )
  },
)

ProductGrid.displayName = "ProductGrid"

export default ProductGrid
