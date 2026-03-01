export interface CardFormData {
  number: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

export const detectCardBrand = (number: string): CardBrand => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  return 'unknown';
};
