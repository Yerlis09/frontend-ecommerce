import React, { useEffect } from 'react';
import type { ToastProps } from './Toast.types';
import styles from './Toast.module.css';

const ICONS: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export const Toast: React.FC<ToastProps> = ({ message, variant = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={[styles.toast, styles[variant]].join(' ')}>
      <span className="material-symbols-outlined">{ICONS[variant]}</span>
      <p className={styles.message}>{message}</p>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};
