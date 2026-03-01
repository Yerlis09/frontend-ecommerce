import httpClient from './http.client';

export interface WompiAcceptanceTokensResponse {
  acceptanceToken: string;
  acceptPersonalAuth: string;
  permalinks: {
    termsAndConditions: string;
    privacyPolicy: string;
  };
}

export interface WompiCardData {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export const wompiService = {
  getAcceptanceTokens: () =>
    httpClient
      .get<WompiAcceptanceTokensResponse>('/wompi/acceptance-tokens')
      .then((r) => r.data),

  /**
   * La tokenización se hace desde el frontend con el SDK de Wompi.
   * Este método es un helper que llama al SDK global `window.Wompi`.
   */
  tokenizeCard: async (cardData: WompiCardData, publicKey: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (window as any).Wompi.tokenizeCard({
      ...cardData,
      publicKey,
    });
    return response.id as string;
  },
};
