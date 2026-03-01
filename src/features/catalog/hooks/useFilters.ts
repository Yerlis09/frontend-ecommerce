import { useState, useMemo } from 'react';
import type { ProductResponseDto } from '../types/product.types';

interface Filters {
  category: string;
  search: string;
  minPrice: number;
  maxPrice: number;
}

const DEFAULT_FILTERS: Filters = {
  category: 'all',
  search: '',
  minPrice: 0,
  maxPrice: Infinity,
};

export const useFilters = (products: ProductResponseDto[]) => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = filters.category === 'all' || p.category === filters.category;
      const matchSearch =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      return matchCategory && matchSearch && matchPrice;
    });
  }, [products, filters]);

  const setCategory = (category: string) => setFilters((f) => ({ ...f, category }));
  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setPriceRange = (min: number, max: number) =>
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max }));
  const reset = () => setFilters(DEFAULT_FILTERS);

  return { filters, filtered, setCategory, setSearch, setPriceRange, reset };
};
