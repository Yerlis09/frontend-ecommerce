import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { Navbar } from '../shared/components/layout/Navbar/Navbar';
import { Footer } from '../shared/components/layout/Footer/Footer';
import { formatCOP, fromCents } from '../shared/utils/currency';
import type { PaymentResponseDto } from '../services/payments.service';
import styles from './OrderConfirmedPage.module.css';

interface RouteState {
  payment: PaymentResponseDto;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) added++;
  }
  return result;
};

const formatDeliveryRange = (iso: string): string => {
  const base  = new Date(iso);
  const min   = addBusinessDays(base, 3);
  const max   = addBusinessDays(base, 5);
  const month = max.toLocaleString('es-CO', { month: 'long' });
  return `${min.getDate()} - ${max.getDate()} de ${month.charAt(0).toUpperCase() + month.slice(1)}`;
};

// ── Status config ─────────────────────────────────────────────────────────────
type StatusKey = 'APPROVED' | 'PENDING' | 'DECLINED' | 'ERROR';

const STATUS: Record<StatusKey, {
  icon: string; iconColor: string;
  iconBg: string; ringBg: string;
  title: string; badge: string; badgeClass: string;
}> = {
  APPROVED: {
    icon: 'check_circle', iconColor: '#16a34a',
    iconBg: 'rgba(34,197,94,0.12)', ringBg: 'rgba(34,197,94,0.06)',
    title: '¡Pago exitoso!', badge: 'APROBADO', badgeClass: styles.badgeApproved,
  },
  PENDING: {
    icon: 'hourglass_top', iconColor: '#d97706',
    iconBg: 'rgba(245,158,11,0.12)', ringBg: 'rgba(245,158,11,0.06)',
    title: 'Pago en proceso', badge: 'PENDIENTE', badgeClass: styles.badgePending,
  },
  DECLINED: {
    icon: 'cancel', iconColor: '#dc2626',
    iconBg: 'rgba(239,68,68,0.12)', ringBg: 'rgba(239,68,68,0.06)',
    title: 'Pago no aprobado', badge: 'RECHAZADO', badgeClass: styles.badgeDeclined,
  },
  ERROR: {
    icon: 'cancel', iconColor: '#dc2626',
    iconBg: 'rgba(239,68,68,0.12)', ringBg: 'rgba(239,68,68,0.06)',
    title: 'Error en el pago', badge: 'ERROR', badgeClass: styles.badgeDeclined,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export const OrderConfirmedPage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch<AppDispatch>();
  const state     = location.state as RouteState | null;
  const payment   = state?.payment;

  const cartItemCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  useEffect(() => {
    if (payment) dispatch(clearCart());
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const REDIRECT_SECONDS = 60;
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  useEffect(() => {
    if (!payment) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [payment, navigate]);

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!payment) {
    return (
      <>
        <Navbar cartItemCount={0} onSearch={() => {}} onCartClick={() => navigate('/cart')} onWishlistClick={() => {}} onProfileClick={() => {}} />
        <main className={styles.page}>
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#cbd5e1' }}>receipt_long</span>
            <h2 className={styles.emptyTitle}>No encontramos una orden</h2>
            <button className={styles.btnPrimary} onClick={() => navigate('/')}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
              Ir a la tienda
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const cfg        = STATUS[payment.status as StatusKey] ?? STATUS.ERROR;
  const isApproved = payment.status === 'APPROVED';
  const isDeclined = payment.status === 'DECLINED' || payment.status === 'ERROR';
  const totalCOP   = formatCOP(fromCents(payment.totalAmountInCents));
  const totalItems = payment.products.reduce((s, p) => s + p.quantity, 0);

  return (
    <>
      {/* ── Toast ── */}
      {showToast && isApproved && (
        <div className={styles.toast}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#22c55e', flexShrink: 0 }}>
            check_circle
          </span>
          <div>
            <p className={styles.toastTitle}>Confirmación enviada</p>
            <p className={styles.toastSub}>Enviamos los detalles a tu correo ✉️</p>
          </div>
          <button className={styles.toastClose} onClick={() => setShowToast(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      <Navbar
        cartItemCount={cartItemCount}
        onSearch={() => {}}
        onCartClick={() => navigate('/cart')}
        onWishlistClick={() => {}}
        onProfileClick={() => {}}
      />

      <main className={styles.page}>
        <div className={styles.container}>

          {/* ── Success header ── */}
          <div className={styles.successHeader}>
            <div className={styles.iconRing} style={{ background: cfg.ringBg }}>
              <div className={styles.iconCircle} style={{ background: cfg.iconBg }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: cfg.iconColor }}>
                  {cfg.icon}
                </span>
              </div>
            </div>
            <h1 className={styles.title} style={{ color: cfg.iconColor }}>{cfg.title}</h1>
            <p className={styles.subtitle}>
              Tu pedido <strong className={styles.refBold}>{payment.reference}</strong> ha sido confirmado
            </p>
          </div>

          {/* ── Transaction details card ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Detalles de la transacción</h3>
              <span className={`${styles.statusBadge} ${cfg.badgeClass}`}>
                <span className={styles.statusDot} />
                {cfg.badge}
              </span>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailCell}>
                <p className={styles.detailLabel}>Referencia Wompi</p>
                <p className={`${styles.detailValue} ${styles.mono}`}>
                  {payment.wompiTransactionId || payment.reference}
                </p>
              </div>
              <div className={styles.detailCell}>
                <p className={styles.detailLabel}>Monto Total</p>
                <p className={`${styles.detailValue} ${styles.amount}`}>{totalCOP} COP</p>
              </div>
              <div className={styles.detailCell}>
                <p className={styles.detailLabel}>Cuotas</p>
                <p className={styles.detailValue}>
                  {payment.installments === 1
                    ? '1 cuota (sin interés)'
                    : `${payment.installments} cuotas`}
                </p>
              </div>
              <div className={styles.detailCell}>
                <p className={styles.detailLabel}>Fecha y Hora</p>
                <p className={styles.detailValue}>{formatDate(payment.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* ── Delivery info row (solo si aprobado) ── */}
          {isApproved && (
            <div className={styles.infoRow}>

              {/* Delivery estimate */}
              <div className={styles.deliveryCard}>
                <div className={styles.deliveryIconBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#7e3ae4' }}>
                    local_shipping
                  </span>
                </div>
                <div>
                  <p className={styles.infoLabel}>Entrega Estimada</p>
                  <p className={styles.deliveryDate}>{formatDeliveryRange(payment.createdAt)}</p>
                  <p className={styles.infoSub}>Envío estándar (3–5 días hábiles)</p>
                </div>
              </div>

              {/* Order summary */}
              <div className={styles.summaryCard}>
                <div>
                  <p className={styles.infoLabel}>Resumen del pedido</p>
                  <p className={styles.summaryItems}>
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu pedido
                  </p>
                  <p className={styles.summaryTotal}>{totalCOP}</p>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#7e3ae4', opacity: 0.2, flexShrink: 0 }}>
                  shopping_bag
                </span>
              </div>

            </div>
          )}

          {/* ── Actions ── */}
          <div className={styles.actions}>
            <button className={styles.btnSecondary} onClick={() => navigate('/orders')}>
              Ver mis pedidos
            </button>
            {!isDeclined ? (
              <button className={styles.btnPrimary} onClick={() => navigate('/')}>
                Seguir comprando
              </button>
            ) : (
              <button className={styles.btnPrimary} onClick={() => navigate(-1 as never)}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                Intentar de nuevo
              </button>
            )}
          </div>

          {/* ── Countdown redirect ── */}
          <div className={styles.countdown}>
            <p className={styles.countdownText}>
              Redirigiendo a la tienda en <strong>{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}…
            </p>
            <div className={styles.countdownTrack}>
              <div
                className={styles.countdownFill}
                style={{ width: `${(countdown / REDIRECT_SECONDS) * 100}%` }}
              />
            </div>
          </div>

          {/* ── Help link ── */}
          <a href="#" className={styles.helpLink}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>help</span>
            ¿Necesitas ayuda con tu pedido?
          </a>

        </div>
      </main>

      <Footer />
    </>
  );
};
