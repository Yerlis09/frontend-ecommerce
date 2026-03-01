import { useState } from 'react';
import { wompiService } from '../../../services/wompi.service';
import { WOMPI_PUBLIC_KEY } from '../../../config/wompi.config';
import type { CardFormData } from '../types/payment.types';

export const useCardTokenization = () => {
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const tokenize = async (cardData: CardFormData): Promise<string | null> => {
    setIsTokenizing(true);
    setTokenError(null);
    try {
      const token = await wompiService.tokenizeCard(
        {
          number: cardData.number.replace(/\s/g, ''),
          cvc: cardData.cvc,
          exp_month: cardData.expMonth,
          exp_year: cardData.expYear,
          card_holder: cardData.cardHolder,
        },
        WOMPI_PUBLIC_KEY
      );
      return token;
    } catch {
      setTokenError('Error al procesar la tarjeta. Verifica los datos e intenta de nuevo.');
      return null;
    } finally {
      setIsTokenizing(false);
    }
  };

  return { tokenize, isTokenizing, tokenError };
};
