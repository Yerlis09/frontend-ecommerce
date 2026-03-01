import { useToastContext } from '../components/ui/Toast/ToastProvider';

/**
 * Hook para mostrar notificaciones toast desde cualquier componente.
 *
 * @example
 * const toast = useToast();
 * toast.success('Producto agregado al carrito');
 * toast.error('Error al procesar el pago');
 */
export const useToast = () => {
  const { addToast } = useToastContext();

  return {
    success: (message: string) => addToast(message, 'success'),
    error:   (message: string) => addToast(message, 'error'),
    warning: (message: string) => addToast(message, 'warning'),
    info:    (message: string) => addToast(message, 'info'),
  };
};
