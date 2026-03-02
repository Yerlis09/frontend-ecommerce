import React from 'react';
import { type CategoryChipsProps } from '../../types/product.types';
import { cn } from '../../../../shared/utils/cn';
import styles from './CategoryChips.module.css';
import Icon from '../../../../shared/components/ui/Icon/Icon';

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              styles.chip,
              selectedCategory === category.id && styles.chipActive
            )}
            onClick={() => onSelectCategory?.(category.id)}
          >
            <Icon name={category.icon} className={styles.chipIcon} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
