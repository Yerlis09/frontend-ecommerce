import { useCheckoutStore } from '../../../store/checkout.store';
import { useCartStore } from '../../../store/cart.store';
import type { CustomerFormData, ShippingFormData } from '../types/checkout.types';

export const useCheckout = () => {
  const { step, customer, shipping, nextStep, prevStep, setCustomer, setShipping, reset } =
    useCheckoutStore();
  const { items, getTotalPrice } = useCartStore();

  const saveCustomer = (data: CustomerFormData) => {
    setCustomer({ ...data, address: shipping?.address ?? '', city: shipping?.city ?? '', country: shipping?.country ?? '' });
    nextStep();
  };

  const saveShipping = (data: ShippingFormData) => {
    setShipping(data);
    if (customer) {
      setCustomer({ ...customer, ...data });
    }
    nextStep();
  };

  return {
    step,
    customer,
    shipping,
    items,
    subtotal: getTotalPrice(),
    saveCustomer,
    saveShipping,
    nextStep,
    prevStep,
    reset,
  };
};
