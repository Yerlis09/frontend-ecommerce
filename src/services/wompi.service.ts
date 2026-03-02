import { WOMPI_PUBLIC_KEY } from '../config/wompi.config';

interface TokenizeCardParams {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

class WompiService {
  private readonly publicKey: string;
  private readonly apiUrl: string;
  readonly isSandbox: boolean;

  constructor() {
    this.publicKey = WOMPI_PUBLIC_KEY;

    if (this.publicKey.startsWith('pub_stagtest_')) {
      this.apiUrl = 'https://api-sandbox.co.uat.wompi.dev/v1';
      this.isSandbox = true;
    } else if (this.publicKey.startsWith('pub_test_')) {
      this.apiUrl = 'https://sandbox.wompi.co/v1';
      this.isSandbox = true;
    } else {
      this.apiUrl = 'https://production.wompi.co/v1';
      this.isSandbox = false;
    }
  }

  async tokenizeCard(cardData: TokenizeCardParams): Promise<string> {
    const response = await fetch(`${this.apiUrl}/tokens/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify({
        number:      cardData.number.replace(/\s/g, ''),
        cvc:         cardData.cvc,
        exp_month:   cardData.exp_month,
        exp_year:    cardData.exp_year,
        card_holder: cardData.card_holder,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      const reason = (body?.error as Record<string, unknown>)?.reason ?? `HTTP ${response.status}`;
      throw new Error(`No se pudo tokenizar la tarjeta: ${reason}`);
    }

    const body = await response.json() as { data: { id: string } };
    return body.data.id;
  }
}

export const wompiService = new WompiService();
