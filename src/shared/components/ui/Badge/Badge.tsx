import React from 'react';
import { type BadgeProps } from './Badge.types';
import { cn } from '../../../utils/cn';
import styles from './Badge.module.css';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
}) => {
  return (
    <span className={cn(styles.badge, styles[variant], styles[size], className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};