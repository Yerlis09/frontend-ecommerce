import httpClient from './http.client';
import type { CustomerDto } from './customers.service';
import type { TransactionStatus } from '../shared/types/common.types';

export interface PaymentProductItem {
  productId: string;
  quantity: number;
}

export interface CreatePaymentDto {
  customer: CustomerDto;
  products: PaymentProductItem[];
  cardToken: string;
  installments?: number;
  discountCode?: string;
  /** Solo en sandbox: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' */
  sandboxStatus?: string;
}

export interface PaymentResponseDto {
  id: string;
  reference: string;
  wompiTransactionId: string;
  status: TransactionStatus;
  customerId: string;
  products: PaymentProductItem[];
  discountCodeId: string | null;
  productPriceInCents: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  discountAmountInCents: number;
  totalAmountInCents: number;
  currency: string;
  installments: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export const paymentsService = {
  create: (data: CreatePaymentDto) =>
    httpClient.post<PaymentResponseDto>('/payments', data).then((r) => r.data),

  getById: (id: string) =>
    httpClient.get<PaymentResponseDto>(`/payments/${id}`).then((r) => r.data),

  sync: (id: string) =>
    httpClient.post<PaymentResponseDto>(`/payments/${id}/sync`).then((r) => r.data),

  getByCustomerEmail: (email: string) =>
    httpClient
      .get<PaymentResponseDto[]>(`/payments/customer/${email}`)
      .then((r) => r.data),
};
