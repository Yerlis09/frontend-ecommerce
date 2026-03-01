import httpClient from './http.client';
import type { TransactionStatus } from '../shared/types/common.types';

export interface TransactionResponseDto {
  id: string;
  customerId: string;
  customerEmail: string;
  customerFullName: string;
  customerPhoneNumber: string;
  amountInCents: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
  wompiTransactionId: string;
  paymentMethod: Record<string, unknown>;
  redirectUrl: string | null;
  paymentLinkId: string | null;
  shippingAddress: Record<string, unknown>;
  metadata: Record<string, unknown>;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTransactionDto {
  status?: TransactionStatus;
  wompiTransactionId?: string;
  metadata?: Record<string, unknown>;
  errorMessage?: string | null;
}

export const transactionsService = {
  getById: (id: string) =>
    httpClient.get<TransactionResponseDto>(`/transactions/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateTransactionDto) =>
    httpClient.patch<TransactionResponseDto>(`/transactions/${id}`, data).then((r) => r.data),

  getByEmail: (email: string) =>
    httpClient
      .get<TransactionResponseDto[]>(`/transactions/email/${email}`)
      .then((r) => r.data),
};
