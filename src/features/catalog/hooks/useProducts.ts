import { useQuery } from '@tanstack/react-query';
import { productsService } from '../../../services/products.service';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
