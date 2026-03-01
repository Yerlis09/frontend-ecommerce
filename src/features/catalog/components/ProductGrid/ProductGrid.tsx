import React from 'react';
import { type Product } from '../../types/product.types';
import styles from './ProductGrid.module.css';
import { ProductCard } from './ProductCard/ProductCard';

interface ProductGridProps {
  products: Product[];
  title: string;
  onViewAll?: () => void;
  onNavigate?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onFavorite?: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  onViewAll,
  onNavigate,
  onAddToCart,
  onFavorite,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleAccent} />
          {title}
        </h2>
        {onViewAll && (
          <a
            href="#"
            className={styles.viewAllLink}
            onClick={(e) => {
              e.preventDefault();
              onViewAll();
            }}
          >
            View All
            <span className="material-symbols-outlined text-sm">
              arrow_forward_ios
            </span>
          </a>
        )}
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    </section>
  );
};