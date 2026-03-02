import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentResponseDto } from '../../../../services/payments.service';
import { formatCOP } from '../../../../shared/utils/currency';
import Icon from '../../../../shared/components/ui/Icon/Icon';

interface SuccessStateProps {
  payment: PaymentResponseDto;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ payment }) => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Icon name="check_circle" size={80} style={{ color: '#22c55e' }} />
      <h1 style={{ marginTop: '16px', color: '#166534' }}>¡Pago aprobado!</h1>
      <p style={{ color: '#64748b' }}>Referencia: <strong>{payment.reference}</strong></p>
      <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
        Total pagado: {formatCOP(payment.totalAmountInCents / 100)}
      </p>
      <button onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
        Seguir comprando
      </button>
    </div>
  );
};
