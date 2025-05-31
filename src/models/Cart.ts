/**
 * Modèle de données pour le panier dans MGcaisse3.0
 */

import { Product } from './Product';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'card' | 'd17';

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: number;
  synced?: boolean;
}
