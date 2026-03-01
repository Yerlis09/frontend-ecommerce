import React, { useState } from 'react';
import { type NavbarProps } from './Navbar.types';
import styles from './Navbar.module.css';

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartItemCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onProfileClick,
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
                placeholder="Search products, brands, and categories..."
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
              onClick={onWishlistClick}
            >
              <span className="material-symbols-outlined">favorite</span>
            </button>

            <button 
              className={styles.actionButton}
              onClick={onCartClick}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && <span className={styles.cartBadge} />}
            </button>

            <div className={styles.divider} />

            <button 
              className={styles.profileButton}
              onClick={onProfileClick}
            >
              <div 
                className={styles.avatar}
                style={{ backgroundImage: `url("${user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOoPD_C5r-LW3JNQt2QrpA1CLxUdXlViwoAoIV8rnBhPOBewapOdRWxgY14kcT-Kya7lNQw6_tGKACldFRubFPFCyFuVGdZZEG6jJtVt3JJ2uhVIbw4RCBpveGwxCHtTuy6idghvZgdVeFbSlHr6XMYySt4NE5zM_bcGtnHodJY5whRXcePVHMU6obqni0zxCM_4o_104vgmnhJTna0QYmugtS2bHa6PK3DSy03kvWEcBn8NzZ_6WKi2U8TtEhjTJ9gLMesTIunbC2'}")` }}
              />
              {user && <span className={styles.profileName}>Hola, {user.name}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};