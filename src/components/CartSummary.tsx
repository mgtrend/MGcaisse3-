"use client"

import { memo, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import type { CartItem } from "../models/Cart"
import { Trash2, Plus, Minus, ShoppingCart, Receipt, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { notify } from "./ui/toast-notification"
import { cn } from "../lib/utils"

interface CartSummaryProps {
  items: CartItem[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  onClearCart: () => void
  className?: string
}

/**
 * Composant de résumé du panier optimisé avec memo
 */
const CartSummary = memo(
  ({ items, onQuantityChange, onRemoveItem, onCheckout, onClearCart, className }: CartSummaryProps) => {
    const [showReceiptModal, setShowReceiptModal] = useState(false)

    // Calculer le total du panier
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Formater le prix avec 2 décimales et le symbole €
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price)
    }

    const handleCheckout = () => {
      setShowReceiptModal(true)
    }

    const handleConfirmCheckout = () => {
      setShowReceiptModal(false)
      onCheckout()
      notify("Vente effectuée avec succès", "success", {
        description: `Total: ${formatPrice(total)}`,
        action: {
          label: "Voir reçu",
          onClick: () => setShowReceiptModal(true),
        },
      })
    }

    // Générer la date et l'heure actuelles pour le reçu
    const now = new Date()
    const dateStr = now.toLocaleDateString("fr-FR")
    const timeStr = now.toLocaleTimeString("fr-FR")

    return (
      <>
        <Card className={cn("flex flex-col h-full", className)}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier
              </CardTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearCart}
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vider
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto py-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">Votre panier est vide</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Cliquez sur un produit pour l'ajouter</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>

          <CardFooter className="flex-col pt-2 border-t">
            <div className="w-full flex justify-between items-center mb-3">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>

            <Button className="w-full" size="lg" disabled={items.length === 0} onClick={handleCheckout}>
              <Receipt className="mr-2 h-5 w-5" />
              Finaliser la vente
            </Button>
          </CardFooter>
        </Card>

        {/* Modal de reçu */}
        <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Reçu de vente</DialogTitle>
            </DialogHeader>

            <div className="bg-white p-4 rounded-md">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">MGcaisse3</h3>
                <p className="text-sm text-muted-foreground">
                  {dateStr} à {timeStr}
                </p>
              </div>

              <Separator className="my-2" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Article</span>
                  <div className="flex gap-8">
                    <span className="text-right w-10">Qté</span>
                    <span className="text-right w-20">Prix</span>
                  </div>
                </div>

                <Separator className="my-1" />

                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1">{item.name}</span>
                    <div className="flex gap-8">
                      <span className="text-right w-10">{item.quantity}</span>
                      <span className="text-right w-20">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}

                <Separator className="my-2" />

                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Merci pour votre achat!</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleConfirmCheckout} className="w-full">
                Confirmer la vente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
)

CartSummary.displayName = "CartSummary"

export default CartSummary
