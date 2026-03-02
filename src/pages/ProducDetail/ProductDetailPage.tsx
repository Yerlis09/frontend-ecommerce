import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../features/catalog/hooks/useProducts';
import { QuantityStepper } from '../../features/product-detail/components/QuantityStepper/QuantityStepper';
import { useProductDetail } from '../../features/product-detail/hooks/useProductDetail';
import { Footer } from '../../shared/components/layout/Footer/Footer';
import { Navbar } from '../../shared/components/layout/Navbar/Navbar';
import { Skeleton } from '../../shared/components/ui/Skeleton/Skeleton';
import { useToast } from '../../shared/hooks/useToast';
import { formatCOP } from '../../shared/utils/currency';
import { addItem as addItemAction } from '../../store/cartSlice';
import type { AppDispatch, RootState } from '../../store/store';
import styles from './ProductDetailPage.module.css';

// ── Star Rating ──────────────────────────────────────────────────────────────
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isHalf = i === full && hasHalf;
        const isFull = i < full;
        return (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{
              fontSize: '20px',
              color: isFull || isHalf ? '#fbbf24' : '#cbd5e1',
              fontVariationSettings: isFull ? '"FILL" 1' : '"FILL" 0',
            }}
          >
            {isHalf ? 'star_half' : 'star'}
          </span>
        );
      })}
    </div>
  );
};

// ── Stock helper ─────────────────────────────────────────────────────────────
const getStockInfo = (stock: number) => {
  if (stock === 0) return { text: 'Sin stock', icon: 'remove_shopping_cart', isOut: true };
  if (stock <= 5)  return { text: `Solo ${stock} disponibles`, icon: 'inventory_2', isOut: false };
  if (stock <= 10) return { text: `${stock} disponibles`, icon: 'inventory_2', isOut: false };
  return { text: 'En stock', icon: 'inventory_2', isOut: false };
};

// ── Component ─────────────────────────────────────────────────────────────────
export const ProductDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const addItem = (product: Parameters<typeof addItemAction>[0]['product'], qty = 1) =>
    dispatch(addItemAction({ product, quantity: qty }));

  const toast = useToast();

  const { product, isLoading, error } = useProductDetail(id);
  const { data: allProducts = [] } = useProducts();

  const similarProducts = product
    ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  // Combina imgUrl + images[] sin duplicados
  const allImages = product
    ? [product.imgUrl, ...product.images.filter((img) => img !== product.imgUrl)]
    : [];

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      navigate('/cart');
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <Navbar
        cartItemCount={totalItems}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.page}>

        {/* ── Loading ── */}
        {isLoading && (
          <div className={styles.skeletonGrid}>
            <div className={styles.imageSection}>
              <Skeleton height="420px" borderRadius="16px" />
              <div className={styles.skeletonThumbs}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height="88px" borderRadius="12px" />
                ))}
              </div>
            </div>
            <div className={styles.skeletonPanel}>
              <Skeleton height="14px" width="35%" />
              <Skeleton height="40px" width="85%" />
              <Skeleton height="20px" width="28%" />
              <Skeleton height="180px" borderRadius="16px" />
              <Skeleton height="48px" borderRadius="12px" />
              <Skeleton height="48px" borderRadius="12px" />
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && !isLoading && (
          <div className={styles.errorState}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#ef4444' }}>
              search_off
            </span>
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o no está disponible.</p>
            <button className={styles.btnPrimary} onClick={() => navigate('/')}>
              Volver a la tienda
            </button>
          </div>
        )}

        {/* ── Product ── */}
        {product && !isLoading && (
          <>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
              <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link to="/" className={styles.breadcrumbLink}>{capitalize(product.category)}</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{product.name}</span>
            </nav>

            <div className={styles.productGrid}>

              {/* ── Left: Image Gallery ── */}
              <div className={styles.imageSection}>
                <div className={styles.mainImageWrapper}>
                  <img
                    src={allImages[selectedImg] ?? product.imgUrl}
                    alt={product.name}
                    className={styles.mainImage}
                  />
                </div>

                {allImages.length > 1 && (
                  <div className={styles.thumbnailGrid}>
                    {allImages.map((src, i) => (
                      <button
                        key={i}
                        className={[styles.thumb, i === selectedImg ? styles.thumbActive : ''].join(' ')}
                        onClick={() => setSelectedImg(i)}
                        aria-label={`Imagen ${i + 1}`}
                      >
                        <img src={src} alt={`${product.name} ${i + 1}`} className={styles.thumbImg} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: Product Info ── */}
              <div className={styles.infoSection}>

                {/* Header */}
                <div className={styles.infoHeader}>
                  <span className={styles.categoryTag}>{product.category}</span>
                  <h1 className={styles.productName}>{product.name}</h1>
                  <div className={styles.ratingRow}>
                    <StarRating rating={product.rating} />
                    <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Price + Actions Panel */}
                <div className={styles.pricePanel}>

                  {/* Price */}
                  <div className={styles.priceValue}>{formatCOP(product.price)}</div>

                  {/* Stock Badge */}
                  {(() => {
                    const stock = getStockInfo(product.stock);
                    return (
                      <div className={[styles.stockBadge, stock.isOut ? styles.stockOut : ''].join(' ')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          {stock.icon}
                        </span>
                        <span>{stock.isOut ? 'Sin stock' : `En stock — ${stock.text}`}</span>
                      </div>
                    );
                  })()}

                  {/* Quantity + Buy Now */}
                  <div className={styles.actionsRow}>
                    <QuantityStepper
                      value={quantity}
                      min={1}
                      max={Math.max(1, Math.min(product.stock, 50))}
                      onChange={setQuantity}
                    />
                    <button
                      className={styles.btnPrimary}
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                    >
                      <span>Comprar ahora</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        arrow_forward
                      </span>
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    className={styles.btnOutline}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      shopping_bag
                    </span>
                    <span>Agregar al carrito</span>
                  </button>

                  {/* Trust Signal */}
                  <div className={styles.trustSignal}>
                    <span className={styles.trustLabel}>Pagos seguros con</span>
                    <div className={styles.wompiChip}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                      WOMPI
                    </div>
                  </div>
                </div>

                {/* Accordions */}
                <div className={styles.accordions}>

                  {/* Description */}
                  <details className={styles.accordion} open>
                    <summary className={styles.accordionSummary}>
                      <span>Descripción</span>
                      <span className={`material-symbols-outlined ${styles.accordionChevron}`}>
                        keyboard_arrow_down
                      </span>
                    </summary>
                    <div className={styles.accordionBody}>{product.description}</div>
                  </details>

                  {/* Shipping */}
                  <details className={styles.accordion}>
                    <summary className={styles.accordionSummary}>
                      <span>Envío y Devoluciones</span>
                      <span className={`material-symbols-outlined ${styles.accordionChevron}`}>
                        keyboard_arrow_down
                      </span>
                    </summary>
                    <div className={styles.accordionBody}>
                      <p style={{ marginBottom: '8px' }}>
                        <strong>Envío:</strong> Tarifa fija de $50 COP. Entrega en 3–5 días hábiles.
                      </p>
                      <p>
                        <strong>Devoluciones:</strong> Tienes 30 días para devolver tu producto si no
                        estás satisfecho. El producto debe estar en su estado original.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* ── Similar Products ── */}
            {similarProducts.length > 0 && (
              <div className={styles.similarSection}>
                <h3 className={styles.similarTitle}>También te podría interesar</h3>
                <div className={styles.similarGrid}>
                  {similarProducts.map((p) => (
                    <div
                      key={p.id}
                      className={styles.similarCard}
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        setSelectedImg(0);
                        setQuantity(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className={styles.similarImgWrapper}>
                        <img src={p.imgUrl} alt={p.name} className={styles.similarImg} />
                      </div>
                      <div className={styles.similarBody}>
                        <h4 className={styles.similarName}>{p.name}</h4>
                        <p className={styles.similarCategory}>{p.category}</p>
                        <div className={styles.similarFooter}>
                          <span className={styles.similarPrice}>{formatCOP(p.price)}</span>
                          <button className={styles.similarBtn}>Ver más</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};
