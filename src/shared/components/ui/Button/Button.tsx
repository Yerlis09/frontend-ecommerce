import React from 'react';
import { type ButtonProps } from './Button.types';
import { cn } from '../../../utils/cn';
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className={styles.loader} />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
};