import httpClient from './http.client';

export interface DiscountCodeResponseDto {
  id: string;
  code: string;
  discountPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateDiscountResponse {
  valid: boolean;
  discountCode?: DiscountCodeResponseDto;
  message: string;
}

export const discountCodesService = {
  getAll: () =>
    httpClient.get<DiscountCodeResponseDto[]>('/discount-codes').then((r) => r.data),

  validate: (code: string) =>
    httpClient
      .get<ValidateDiscountResponse>(`/discount-codes/validate/${code}`)
      .then((r) => r.data),
};
