import { create } from 'zustand';
import type { ProductResponseDto } from '../features/catalog/types/product.types';

export interface CartItem {
  product: ProductResponseDto;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;

  addItem: (product: ProductResponseDto, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (code: string, percentage: number) => void;
  clearDiscount: () => void;
  clear: () => void;

  /** Precio total de productos en COP pesos */
  getTotalPrice: () => number;
  /** Total de unidades en el carrito */
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discountCode: null,
  discountPercentage: 0,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
    })),

  applyDiscount: (code, percentage) =>
    set({ discountCode: code, discountPercentage: percentage }),

  clearDiscount: () => set({ discountCode: null, discountPercentage: 0 }),

  clear: () => set({ items: [], discountCode: null, discountPercentage: 0 }),

  getTotalPrice: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getTotalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
