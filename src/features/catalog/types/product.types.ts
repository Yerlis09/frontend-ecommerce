/** Respuesta exacta del backend GET /api/v1/products */
export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

/** Modelo de producto enriquecido para el frontend (mapea desde ProductResponseDto) */
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
}

export interface ProductCardProps {
  product: Product;
  onNavigate?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onFavorite?: (productId: string) => void;
  className?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CategoryChipsProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  highlight: string;
  ctaText: string;
  onCtaClick?: () => void;
  imageUrl?: string;
  endTime?: Date;
}