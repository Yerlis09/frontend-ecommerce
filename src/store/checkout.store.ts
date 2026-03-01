import { create } from 'zustand';
import type { CustomerDto } from '../services/customers.service';

export type CheckoutStep = 'cart' | 'customer' | 'shipping' | 'payment' | 'confirmation';

interface ShippingData {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface CheckoutState {
  step: CheckoutStep;
  customer: CustomerDto | null;
  shipping: ShippingData | null;

  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCustomer: (customer: CustomerDto) => void;
  setShipping: (shipping: ShippingData) => void;
  reset: () => void;
}

const STEPS: CheckoutStep[] = ['cart', 'customer', 'shipping', 'payment', 'confirmation'];

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: 'cart',
  customer: null,
  shipping: null,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const current = STEPS.indexOf(get().step);
    if (current < STEPS.length - 1) set({ step: STEPS[current + 1] });
  },

  prevStep: () => {
    const current = STEPS.indexOf(get().step);
    if (current > 0) set({ step: STEPS[current - 1] });
  },

  setCustomer: (customer) => set({ customer }),
  setShipping: (shipping) => set({ shipping }),
  reset: () => set({ step: 'cart', customer: null, shipping: null }),
}));
