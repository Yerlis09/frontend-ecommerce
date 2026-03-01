import { useCartStore } from '../../../store/cart.store';

/** Hook de conveniencia que expone el store del carrito */
export const useCart = () => {
  const {
    items,
    discountCode,
    discountPercentage,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearDiscount,
    clear,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const subtotal = getTotalPrice();
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const BASE_FEE = 10;       // COP $10 (1000 centavos)
  const DELIVERY_FEE = 50;   // COP $50 (5000 centavos)
  const total = subtotal - discountAmount + BASE_FEE + DELIVERY_FEE;

  return {
    items,
    discountCode,
    discountPercentage,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearDiscount,
    clear,
    subtotal,
    discountAmount,
    total,
    totalItems: getTotalItems(),
    isEmpty: items.length === 0,
  };
};
