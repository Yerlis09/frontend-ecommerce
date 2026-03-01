import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentResponseDto } from '../../../../services/payments.service';

interface DeclinedStateProps {
  payment: PaymentResponseDto;
}

export const DeclinedState: React.FC<DeclinedStateProps> = ({ payment }) => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '80px', color: '#ef4444' }}>
        cancel
      </span>
      <h1 style={{ marginTop: '16px', color: '#991b1b' }}>Pago rechazado</h1>
      {payment.errorMessage && (
        <p style={{ color: '#64748b' }}>Motivo: {payment.errorMessage}</p>
      )}
      <p style={{ color: '#64748b' }}>Referencia: <strong>{payment.reference}</strong></p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
        <button onClick={() => navigate('/payment')}>Intentar de nuevo</button>
        <button onClick={() => navigate('/')}>Volver a la tienda</button>
      </div>
    </div>
  );
};
