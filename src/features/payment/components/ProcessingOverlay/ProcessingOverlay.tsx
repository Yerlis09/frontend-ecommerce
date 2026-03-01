import React from 'react';

export const ProcessingOverlay: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgb(0 0 0 / 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: '16px',
      color: '#fff',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgb(255 255 255 / 30%)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Procesando tu pago…</p>
    <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>No cierres esta ventana</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
