import { useState } from 'react';
import { paymentsService } from '../../../services/payments.service';
import type { CreatePaymentDto, PaymentResponseDto } from '../../../services/payments.service';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResponseDto | null>(null);

  const processPayment = async (data: CreatePaymentDto): Promise<PaymentResponseDto | null> => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      const result = await paymentsService.create(data);
      setPaymentResult(result);
      return result;
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Error al procesar el pago';
      setPaymentError(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing, paymentError, paymentResult };
};
