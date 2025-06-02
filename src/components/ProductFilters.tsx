"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { Product } from "../models/Product"

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

/**
 * Composant de filtrage et tri des produits
 * Permet la recherche, le tri et le filtrage par catégorie
 */
export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "name-asc":
        return "Nom (A-Z)"
      case "name-desc":
        return "Nom (Z-A)"
      case "price-asc":
        return "Prix (croissant)"
      case "price-desc":
        return "Prix (décroissant)"
      default:
        return "Trier par"
    }
  }

  return (
    <div className="w-full space-y-2 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2.5 top-2.5"
              onClick={() => onSearchChange("")}
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filtres avancés"
          className={isFilterOpen ? "bg-muted" : ""}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {isFilterOpen && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Catégorie:</span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={selectedCategory === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="h-8"
              >
                Toutes
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className="h-8"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium">Trier par:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {getSortLabel(sortOption)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options de tri</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSortChange("name-asc")}>Nom (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange("name-desc")}>Nom (Z-A)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange("price-asc")}>Prix (croissant)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange("price-desc")}>Prix (décroissant)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Fonction utilitaire pour filtrer et trier les produits
 */
export const filterAndSortProducts = (
  products: Product[],
  searchTerm: string,
  sortOption: SortOption,
  selectedCategory: string | null,
): Product[] => {
  // Filtrer par terme de recherche et catégorie
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === null || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Trier les produits
  return filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      default:
        return 0
    }
  })
}

/**
 * Fonction utilitaire pour extraire les catégories uniques des produits
 */
export const extractCategories = (products: Product[]): string[] => {
  const categoriesSet = new Set<string>()

  products.forEach((product) => {
    if (product.category && product.category.trim() !== "") {
      categoriesSet.add(product.category)
    }
  })

  return Array.from(categoriesSet).sort()
}
