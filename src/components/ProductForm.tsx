"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import type { Product } from "../models/Product"
import { v4 as uuidv4 } from "uuid"
import IconSelector from "./ui/IconSelector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { notify } from "./ui/toast-notification"

interface ProductFormProps {
  product: Product | null
  onSubmit: (product: Product) => void
  existingCategories?: string[]
}

/**
 * Formulaire de produit amélioré avec gestion des catégories et validation
 */
const ProductForm = ({ product, onSubmit, existingCategories = [] }: ProductFormProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [icon, setIcon] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialiser le formulaire avec les données du produit si en mode édition
  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || "")
      setPrice(product.price.toString())
      setIcon(product.icon || null)
      setCategory(product.category || "")
    } else {
      // Réinitialiser le formulaire en mode création
      setName("")
      setDescription("")
      setPrice("")
      setIcon(null)
      setCategory("")
    }
  }, [product])

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    if (!price.trim()) {
      newErrors.price = "Le prix est requis"
    } else if (isNaN(Number.parseFloat(price)) || Number.parseFloat(price) < 0) {
      newErrors.price = "Le prix doit être un nombre positif"
    }

    if (showNewCategoryInput && !newCategory.trim()) {
      newErrors.category = "La catégorie est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      notify("Veuillez corriger les erreurs dans le formulaire", "error")
      return
    }

    const finalCategory = showNewCategoryInput ? newCategory.trim() : category

    const productData: Product = {
      id: product?.id || uuidv4(),
      name: name.trim(),
      description: description.trim(),
      price: Number.parseFloat(price),
      icon,
      category: finalCategory,
    }

    onSubmit(productData)
  }

  // Gérer le changement de catégorie
  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategoryInput(true)
      setCategory("")
    } else {
      setShowNewCategoryInput(false)
      setCategory(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom du produit <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Café espresso"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            Prix <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 2.50"
            type="number"
            step="0.01"
            min="0"
            className={errors.price ? "border-destructive" : ""}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        {!showNewCategoryInput ? (
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune catégorie</SelectItem>
              {existingCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
              <SelectItem value="new">+ Nouvelle catégorie</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nouvelle catégorie"
              className={errors.category ? "border-destructive" : ""}
            />
            <Button type="button" variant="outline" onClick={() => setShowNewCategoryInput(false)}>
              Annuler
            </Button>
          </div>
        )}
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du produit (optionnel)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Icône</Label>
        <IconSelector selectedIcon={icon} onSelectIcon={setIcon} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" size="lg">
          {product ? "Mettre à jour" : "Ajouter"} le produit
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
