import React, { useState } from 'react';
import { type NavbarProps } from './Navbar.types';
import styles from './Navbar.module.css';

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = 0,
  onSearch,
  onCartClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <h1 className={styles.logoText}>ShopWave</h1>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>
                search
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar productos, marcas y categorías..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button className={styles.mobileSearchButton}>
              <span className="material-symbols-outlined">search</span>
            </button>

            <button
              className={styles.actionButton}
              onClick={onCartClick}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && <span className={styles.cartBadge} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
