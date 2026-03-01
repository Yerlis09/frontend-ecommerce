import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  updateQuantity as updateQuantityAction,
  applyDiscount as applyDiscountAction,
  clearDiscount as clearDiscountAction,
  clearCart,
} from '../../../store/cartSlice';
import type { ProductResponseDto } from '../../catalog/types/product.types';

/** Hook de conveniencia que expone el store Redux del carrito */
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, discountCode, discountPercentage } = useSelector(
    (state: RootState) => state.cart,
  );

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const BASE_FEE = 10;
  const DELIVERY_FEE = 50;
  const total = subtotal - discountAmount + BASE_FEE + DELIVERY_FEE;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    discountCode,
    discountPercentage,
    addItem: (product: ProductResponseDto, quantity = 1) =>
      dispatch(addItemAction({ product, quantity })),
    removeItem: (productId: string) => dispatch(removeItemAction(productId)),
    updateQuantity: (productId: string, quantity: number) =>
      dispatch(updateQuantityAction({ productId, quantity })),
    applyDiscount: (code: string, percentage: number) =>
      dispatch(applyDiscountAction({ code, percentage })),
    clearDiscount: () => dispatch(clearDiscountAction()),
    clear: () => dispatch(clearCart()),
    subtotal,
    discountAmount,
    total,
    totalItems,
    isEmpty: items.length === 0,
  };
};
