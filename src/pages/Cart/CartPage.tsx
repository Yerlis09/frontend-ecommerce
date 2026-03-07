import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/hooks/useCart';
import { discountCodesService } from '../../services/discount-codes.service';
import { Footer } from '../../shared/components/layout/Footer/Footer';
import { Navbar } from '../../shared/components/layout/Navbar/Navbar';
import Icon from '../../shared/components/ui/Icon/Icon';
import { formatCOP } from '../../shared/utils/currency';
import styles from './CartPage.module.css';


// ── Payment chip component ─────────────────────────────────────────────────
const PaymentChip: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={[styles.chip, className].filter(Boolean).join(' ')}>{label}</span>
);

// ── Component ──────────────────────────────────────────────────────────────
export const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    items,
    discountCode,
    discountAmount,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearDiscount,
    subtotal,
    total,
    totalItems,
    isEmpty,
  } = useCart();

  const [couponInput, setCouponInput] = useState(discountCode ?? '');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const result = await discountCodesService.validate(couponInput.trim());
      if (result.valid && result.discountCode) {
        applyDiscount(couponInput.trim().toUpperCase(), result.discountCode.discountPercentage);
      } else {
        setCouponError(result.message || 'Código inválido o expirado');
      }
    } catch {
      setCouponError('No se pudo validar el código. Intenta de nuevo.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    clearDiscount();
    setCouponInput('');
    setCouponError(null);
  };

  // ── Empty state ────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <>
        <Navbar
          cartItemCount={0}
          onCartClick={() => navigate('/cart')}
        />
        <main className={styles.page}>
          <div className={styles.emptyState}>
            <Icon name="shopping_cart" size={72} style={{ color: '#cbd5e1' }} />
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptyText}>Aún no has agregado ningún producto.</p>
            <button className={styles.btnPrimary} onClick={() => navigate('/')}>
              <Icon name="arrow_back" size={20} />
              <span>Ir a la tienda</span>
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar
        cartItemCount={totalItems}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Volver al inicio">
            <Icon name="arrow_back" size={20} />
            <span>Seguir comprando</span>
          </button>
          <h1 className={styles.heading}>
            Tu carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </h1>
        </div>

        <div className={styles.layout}>

          {/* ── Left Column ── */}
          <div className={styles.leftCol}>

            {/* Items table */}
            <div className={styles.tableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Producto</th>
                      <th className={`${styles.th} ${styles.hiddenMobile}`}>Precio</th>
                      <th className={styles.th}>Cantidad</th>
                      <th className={styles.th}>Total</th>
                      <th className={styles.thEmpty} />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, quantity }) => (
                      <tr key={product.id} className={styles.row}>

                        {/* Product info */}
                        <td className={`${styles.td} ${styles.productTd}`}>
                          <div className={styles.productCell}>
                            <div
                              className={styles.imgWrapper}
                              onClick={() => navigate(`/product/${product.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <img
                                src={product.imgUrl}
                                alt={product.name}
                                className={styles.productImg}
                              />
                            </div>
                            <div>
                              <h3
                                className={styles.productName}
                                onClick={() => navigate(`/product/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                              >
                                {product.name}
                              </h3>
                              <p className={styles.productCategory}>{product.category}</p>
                              <p className={styles.mobilePriceLabel}>{formatCOP(product.price)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Price – desktop only */}
                        <td className={`${styles.td} ${styles.hiddenMobile} ${styles.priceCell}`}>
                          {formatCOP(product.price)}
                        </td>

                        {/* Quantity stepper */}
                        <td className={`${styles.td} ${styles.stepperTd}`}>
                          <div className={styles.stepper}>
                            <button
                              className={styles.stepperBtn}
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                              aria-label="Reducir cantidad"
                            >
                              <Icon name="remove" size={16} />
                            </button>
                            <span className={styles.stepperValue}>{quantity}</span>
                            <button
                              className={styles.stepperBtn}
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= Math.min(product.stock, 50)}
                              aria-label="Aumentar cantidad"
                            >
                              <Icon name="add" size={16} />
                            </button>
                          </div>
                        </td>

                        {/* Row total */}
                        <td className={`${styles.td} ${styles.rowTotal}`}>
                          {formatCOP(product.price * quantity)}
                        </td>

                        {/* Delete */}
                        <td className={`${styles.td} ${styles.deleteCell}`}>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => removeItem(product.id)}
                            aria-label="Eliminar del carrito"
                          >
                            <Icon name="delete" size={20} />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discount code */}
            <div className={styles.couponCard}>
              <div className={styles.couponTop}>
                <div className={styles.couponInputGroup}>
                  <label className={styles.couponLabel}>Código de descuento</label>
                  <div className={styles.couponInputRow}>
                    <div className={styles.couponInputWrapper}>
                      <Icon
                        name="sell"
                        size={20}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#726487',
                          pointerEvents: 'none',
                        }}
                      />
                      <input
                        className={`${styles.couponInput} ${couponError ? styles.couponInputError : ''}`}
                        placeholder="Ingresa tu cupón"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && !discountCode && handleApplyCoupon()}
                        disabled={!!discountCode || couponLoading}
                      />
                    </div>

                    {discountCode ? (
                      <button className={styles.couponBtnRemove} onClick={handleRemoveCoupon}>
                        Quitar
                      </button>
                    ) : (
                      <button
                        className={styles.couponBtn}
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                      >
                        {couponLoading ? '...' : 'Aplicar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {discountCode && (
                <div className={styles.couponSuccess}>
                  <Icon name="check_circle" size={16} />
                  Código {discountCode} aplicado — -{formatCOP(discountAmount)}
                </div>
              )}

              {couponError && (
                <div className={styles.couponErrorMsg}>
                  <Icon name="error" size={16} />
                  {couponError}
                </div>
              )}
            </div>

            {/* Mobile: continue shopping */}
            <div className={styles.continueShoppingMobile}>
              <Link to="/" className={styles.continueLink}>
                <Icon name="arrow_back" size={18} />
                Continuar comprando
              </Link>
            </div>

          </div>

          {/* ── Right Column: Order Summary ── */}
          <div className={styles.rightCol}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>{formatCOP(subtotal)}</span>
                </div>

                {discountCode && discountAmount > 0 && (
                  <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                    <span>Descuento</span>
                    <span>-{formatCOP(discountAmount)}</span>
                  </div>
                )}

                <div className={styles.summaryLine}>
                  <span className={styles.summaryLabel}>Envío</span>
                  <span className={styles.shippingFree}>Gratis</span>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatCOP(total)}</span>
              </div>

              <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                <span>Proceder al pago</span>
                <Icon name="arrow_forward" size={20} />
              </button>

              <div className={styles.paymentSection}>
                <p className={styles.paymentLabel}>Aceptamos</p>
                <div className={styles.paymentChips}>
                  <PaymentChip label="VISA" />
                  <PaymentChip label="MC" className={styles.chipMC} />
                  <PaymentChip label="PSE" />
                  <PaymentChip label="NEQUI" className={styles.chipNequi} />
                </div>
                <div className={styles.wompiNote}>
                  <Icon name="lock" size={14} />
                  Pagos procesados de forma segura por Wompi
                </div>
              </div>
            </div>

            {/* Desktop: continue shopping */}
            <div className={styles.continueShoppingDesktop}>
              <Link to="/" className={styles.continueLink}>
                <Icon name="arrow_back" size={16} />
                Continuar comprando
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};
