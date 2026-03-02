import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type NavbarProps } from './Navbar.types';
import styles from './Navbar.module.css';
import Icon from '../../ui/Icon/Icon';

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = 0,
  onSearch,
  onCartClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen((prev) => !prev);
    if (mobileSearchOpen) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Icon name="bolt" />
            </div>
            <h1 className={styles.logoText}>ShopWave</h1>
          </Link>

          {/* Search Bar – desktop */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Icon name="search" className={styles.searchIcon} />
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
            <button
              className={styles.mobileSearchButton}
              onClick={handleMobileSearchToggle}
              aria-label={mobileSearchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            >
              <Icon name={mobileSearchOpen ? 'close' : 'search'} />
            </button>

            <button
              className={styles.actionButton}
              onClick={onCartClick}
              aria-label="Ver carrito"
            >
              <Icon name="shopping_cart" />
              {cartItemCount > 0 && <span className={styles.cartBadge} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className={styles.mobileSearchBar}>
            <div className={styles.searchWrapper}>
              <Icon name="search" className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar productos, marcas y categorías..."
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
