import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#cbd5e1' }}>
        shopping_cart
      </span>
      <h2 style={{ marginTop: '16px', color: '#64748b' }}>Tu carrito está vacío</h2>
      <p style={{ color: '#94a3b8' }}>Explora nuestros productos y agrega algo que te guste.</p>
      <button onClick={() => navigate('/')}>Ir a la tienda</button>
    </div>
  );
};
