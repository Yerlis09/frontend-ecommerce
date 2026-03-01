import type { Product, ProductResponseDto } from '../types/product.types';

/**
 * Convierte el DTO del backend al modelo de producto del frontend.
 * - `imgUrl`      → `image`
 * - `brand`       no existe en el backend; se deja vacío
 * - `reviewCount` no existe en el backend; se usa 0
 * - `originalPrice` / `discount` no existen en el backend; se omiten
 */
export const mapProductDto = (dto: ProductResponseDto): Product => ({
  id: dto.id,
  brand: '',
  name: dto.name,
  price: dto.price,
  rating: dto.rating,
  reviewCount: 0,
  image: dto.imgUrl,
  category: dto.category,
});
