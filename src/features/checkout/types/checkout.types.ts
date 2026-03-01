export interface CustomerFormData {
  email: string;
  fullName: string;
  phone: string;
}

export interface ShippingFormData {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export type CheckoutFormData = CustomerFormData & ShippingFormData;
