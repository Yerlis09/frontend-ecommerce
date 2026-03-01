/**
 * Formatea un número en pesos colombianos (COP).
 * @example formatCOP(1399930) → "$1.399.930"
 */
export const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Convierte pesos COP a centavos (para la API de Wompi/payments).
 * @example toCents(59900) → 5990000
 */
export const toCents = (pesos: number): number => Math.round(pesos * 100);

/**
 * Convierte centavos a pesos COP.
 * @example fromCents(5990000) → 59900
 */
export const fromCents = (cents: number): number => cents / 100;
