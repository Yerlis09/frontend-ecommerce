import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductResponseDto } from '../features/catalog/types/product.types';

export interface CartItem {
  product: ProductResponseDto;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;
}

const initialState: CartState = {
  items: [],
  discountCode: null,
  discountPercentage: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: ProductResponseDto; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },

    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
      } else {
        const item = state.items.find((i) => i.product.id === productId);
        if (item) item.quantity = quantity;
      }
    },

    applyDiscount(state, action: PayloadAction<{ code: string; percentage: number }>) {
      state.discountCode = action.payload.code;
      state.discountPercentage = action.payload.percentage;
    },

    clearDiscount(state) {
      state.discountCode = null;
      state.discountPercentage = 0;
    },

    clearCart(state) {
      state.items = [];
      state.discountCode = null;
      state.discountPercentage = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, applyDiscount, clearDiscount, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
