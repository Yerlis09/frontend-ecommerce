import { useProduct } from '../../../features/catalog/hooks/useProducts';

export const useProductDetail = (id: string) => {
  const { data: product, isLoading, error } = useProduct(id);
  return { product, isLoading, error };
};
