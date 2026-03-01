import httpClient from './http.client';
import type { ProductResponseDto } from '../features/catalog/types/product.types';

export const productsService = {
  getAll: () =>
    httpClient.get<ProductResponseDto[]>('/products').then((r) => r.data),

  getById: (id: string) =>
    httpClient.get<ProductResponseDto>(`/products/${id}`).then((r) => r.data),

  create: (data: Omit<ProductResponseDto, 'id' | 'createdAt' | 'updatedAt'>) =>
    httpClient.post<ProductResponseDto>('/products', data).then((r) => r.data),

  update: (id: string, data: Partial<Omit<ProductResponseDto, 'id' | 'createdAt' | 'updatedAt'>>) =>
    httpClient.patch<ProductResponseDto>(`/products/${id}`, data).then((r) => r.data),
};
