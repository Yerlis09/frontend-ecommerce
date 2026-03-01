import httpClient from './http.client';

export interface CustomerDto {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface CustomerResponseDto extends CustomerDto {
  id: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export const customersService = {
  create: (data: CustomerDto) =>
    httpClient.post<CustomerResponseDto>('/customers', data).then((r) => r.data),

  getAll: () =>
    httpClient.get<CustomerResponseDto[]>('/customers').then((r) => r.data),

  getByEmail: (email: string) =>
    httpClient.get<CustomerResponseDto>('/customers', { params: { email } }).then((r) => r.data),

  getById: (id: string) =>
    httpClient.get<CustomerResponseDto>(`/customers/${id}`).then((r) => r.data),

  update: (id: string, data: Partial<CustomerDto>) =>
    httpClient.put<CustomerResponseDto>(`/customers/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    httpClient.delete(`/customers/${id}`),
};
