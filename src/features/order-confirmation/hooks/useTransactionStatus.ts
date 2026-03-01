import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../../../services/transactions.service';

/**
 * Consulta el estado de una transacción con polling cada 3 segundos
 * mientras el estado sea PENDING.
 */
export const useTransactionStatus = (transactionId: string) => {
  const queryClient = useQueryClient();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const query = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => transactionsService.getById(transactionId),
    enabled: !!transactionId,
  });

  useEffect(() => {
    if (query.data?.status === 'PENDING') {
      pollingRef.current = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      }, 3000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [query.data?.status, transactionId, queryClient]);

  return query;
};
