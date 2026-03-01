import React, { useState } from 'react';
import { discountCodesService } from '../../../../services/discount-codes.service';
import { useCartStore } from '../../../../store/cart.store';

export const DiscountCodeInput: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { applyDiscount, clearDiscount, discountCode } = useCartStore();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const result = await discountCodesService.validate(code.trim().toUpperCase());
      if (result.valid && result.discountCode) {
        applyDiscount(result.discountCode.code, result.discountCode.discountPercentage);
        setMessage(`✅ Descuento del ${result.discountCode.discountPercentage}% aplicado`);
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch {
      setMessage('❌ Error al validar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    clearDiscount();
    setCode('');
    setMessage('');
  };

  return (
    <div>
      {discountCode ? (
        <div>
          <span>Código aplicado: <strong>{discountCode}</strong></span>
          <button onClick={handleRemove}>Quitar</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Código de descuento"
          />
          <button onClick={handleApply} disabled={loading}>
            {loading ? 'Verificando...' : 'Aplicar'}
          </button>
        </div>
      )}
      {message && <p style={{ marginTop: '8px', fontSize: '0.875rem' }}>{message}</p>}
    </div>
  );
};
