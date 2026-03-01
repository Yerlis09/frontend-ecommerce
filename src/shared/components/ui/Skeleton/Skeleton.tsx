import React from 'react';
import type { SkeletonProps } from './Skeleton.types';
import styles from './Skeleton.module.css';

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  className,
}) => (
  <div
    className={[styles.skeleton, className ?? ''].join(' ')}
    style={{ width, height, borderRadius }}
  />
);
