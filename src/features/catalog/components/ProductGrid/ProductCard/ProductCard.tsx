import React from 'react';

import styles from './ProductCard.module.css';
import { cn } from '../../../../../shared/utils/cn';
import type { ProductCardProps } from '../../../types/product.types';
import { formatCOP } from '../../../../../shared/utils/formatedCOP';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onFavorite,
  className,
}) => {
  const {
    id,
    brand,
    name,
    price,
    originalPrice,
    discount,
    rating,
    reviewCount,
    image,
  } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(id);
  };

  return (
    <div
      className={cn(styles.card, styles.group, className, onNavigate ? styles.clickable : '')}
      onClick={() => onNavigate?.(id)}
      role={onNavigate ? 'button' : undefined}
      tabIndex={onNavigate ? 0 : undefined}
      onKeyDown={onNavigate ? (e) => e.key === 'Enter' && onNavigate(id) : undefined}
    >
      <div className={styles.imageContainer}>
        {discount && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}
        <button
          className={styles.favoriteButton}
          onClick={handleFavorite}
          aria-label="Add to favorites"
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>
        <img
          src={image}
          alt={name}
          className={styles.productImage}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <span className={styles.brand}>{brand}</span>
        <h3 className={styles.title}>{name}</h3>
        
        <div className={styles.rating}>
          <span className={`material-symbols-outlined ${styles.starIcon}`}>
            star
          </span>
          <span className={styles.ratingText}>
            {rating} ({reviewCount})
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            {originalPrice && (
              <span className={styles.originalPrice}>
                {formatCOP(originalPrice)}
              </span>
            )}
            <span className={styles.currentPrice}>
              {formatCOP(price)}
            </span>
          </div>
          
          <button
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};