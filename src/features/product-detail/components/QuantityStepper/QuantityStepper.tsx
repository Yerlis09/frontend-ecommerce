import React from 'react';
import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 50,
  onChange,
}) => (
  <div className={styles.stepper}>
    <button
      className={styles.btn}
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      aria-label="Reducir cantidad"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
    </button>
    <span className={styles.value}>{value}</span>
    <button
      className={styles.btn}
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      aria-label="Aumentar cantidad"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
    </button>
  </div>
);
