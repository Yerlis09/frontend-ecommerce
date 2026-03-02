import React from 'react';
import Icon from '../../../../shared/components/ui/Icon/Icon';

export const PendingState: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <Icon name="hourglass_top" size={80} style={{ color: '#f59e0b' }} />
    <h1 style={{ marginTop: '16px', color: '#92400e' }}>Pago en proceso</h1>
    <p style={{ color: '#64748b' }}>
      Tu pago está siendo procesado. Esta página se actualizará automáticamente.
    </p>
    <div
      style={{
        margin: '24px auto',
        width: '40px',
        height: '40px',
        border: '4px solid #fde68a',
        borderTopColor: '#f59e0b',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
