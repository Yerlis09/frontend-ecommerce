import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { type CartState } from './cartSlice';

const STORAGE_KEY = 'shopwave_cart';

// ── Carga el carrito desde localStorage al arrancar ────────────────────────
const loadCart = (): { cart: CartState } | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return { cart: JSON.parse(raw) as CartState };
  } catch {
    return undefined;
  }
};

// ── Guarda el carrito en localStorage en cada cambio ──────────────────────
const saveCart = (state: CartState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // cuota de storage excedida — ignoramos
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: loadCart(),
});

// Suscripción: persiste el slice del carrito en cada dispatch
store.subscribe(() => {
  saveCart(store.getState().cart);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
