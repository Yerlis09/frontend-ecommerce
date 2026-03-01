/** Estructura de error estándar del backend */
export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
}

/** Wrapper genérico para respuestas exitosas */
export type ApiResponse<T> = T;

/** Para listas paginadas (si se agrega en el futuro) */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
