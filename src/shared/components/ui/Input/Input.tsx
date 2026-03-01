import React from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export const Input: React.FC<InputProps> = ({ label, error, hint, id, className, ...rest }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[styles.input, error ? styles.inputError : '', className ?? ''].join(' ')}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
};
