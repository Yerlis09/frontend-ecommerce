import React from 'react';
import styles from './QuantityStepper.module.css';
import Icon from '../../../../shared/components/ui/Icon/Icon';

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
      <Icon name="remove" size={18} />
    </button>
    <span className={styles.value}>{value}</span>
    <button
      className={styles.btn}
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      aria-label="Aumentar cantidad"
    >
      <Icon name="add" size={18} />
    </button>
  </div>
);
