export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** 10–15 dígitos, puede iniciar con + */
export const isValidPhone = (phone: string): boolean =>
  /^\+?\d{10,15}$/.test(phone);

export const isValidPostalCode = (code: string): boolean =>
  code.length >= 4 && code.length <= 10;

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
