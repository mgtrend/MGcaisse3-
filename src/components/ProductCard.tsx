"use client"

import { memo } from "react"
import { Card, CardContent } from "./ui/card"
import type { Product } from "../models/Product"
import { cn } from "../lib/utils"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
  compact?: boolean
  selected?: boolean
}

/**
 * Composant de carte produit optimisé avec memo pour éviter les re-rendus inutiles
 */
const ProductCard = memo(({ product, onClick, compact = false, selected = false }: ProductCardProps) => {
  // Récupérer l'icône dynamiquement depuis Lucide
  const IconComponent = product.icon && (LucideIcons[product.icon as keyof typeof LucideIcons] as LucideIcon)

  // Formater le prix avec 2 décimales et le symbole €
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price)

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        compact ? "h-24" : "h-36",
        selected && "ring-2 ring-primary bg-primary/5",
      )}
      onClick={() => onClick(product)}
    >
      <CardContent
        className={cn("flex items-center h-full p-3", compact ? "gap-2" : "gap-3 flex-col justify-center text-center")}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-md bg-muted",
            compact ? "h-16 w-16 min-w-16" : "h-20 w-20",
          )}
        >
          {IconComponent ? (
            <IconComponent className={cn("text-primary", compact ? "h-8 w-8" : "h-10 w-10")} />
          ) : (
            <div
              className={cn(
                "flex items-center justify-center bg-primary/10 text-primary font-bold rounded-md",
                compact ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl",
              )}
            >
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={cn("flex flex-col", compact ? "flex-1 min-w-0" : "w-full")}>
          <h3 className={cn("font-medium leading-tight", compact ? "text-sm truncate" : "text-base")}>
            {product.name}
          </h3>

          {product.category && (
            <span className={cn("text-muted-foreground", compact ? "text-xs truncate" : "text-sm")}>
              {product.category}
            </span>
          )}

          <span className={cn("font-semibold text-primary", compact ? "text-sm mt-auto" : "text-base mt-1")}>
            {formattedPrice}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = "ProductCard"

export default ProductCard
