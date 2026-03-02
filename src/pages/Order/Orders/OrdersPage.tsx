import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { paymentsService } from '../../../services/payments.service';
import type { PaymentResponseDto } from '../../../services/payments.service';
import type { TransactionStatus } from '../../../shared/types/common.types';
import type { ApiError } from '../../../shared/types/api.types';
import { formatCOP, fromCents } from '../../../shared/utils/currency';
import { Navbar } from '../../../shared/components/layout/Navbar/Navbar';
import { Footer } from '../../../shared/components/layout/Footer/Footer';
import Icon from '../../../shared/components/ui/Icon/Icon';
import styles from './OrdersPage.module.css';

// ── Status config ──────────────────────────────────────────────────────────────
type StatusKey = TransactionStatus;

const STATUS_CFG: Record<StatusKey, {
  icon: string; color: string; bg: string; label: string; badgeClass: string;
}> = {
  APPROVED: { icon: 'check_circle',  color: '#16a34a', bg: 'rgba(34,197,94,0.10)',   label: 'Aprobado',  badgeClass: styles.badgeApproved },
  PENDING:  { icon: 'hourglass_top', color: '#d97706', bg: 'rgba(245,158,11,0.10)',  label: 'Pendiente', badgeClass: styles.badgePending  },
  DECLINED: { icon: 'cancel',        color: '#dc2626', bg: 'rgba(239,68,68,0.10)',   label: 'Rechazado', badgeClass: styles.badgeDeclined },
  VOIDED:   { icon: 'block',         color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Anulado',   badgeClass: styles.badgeVoided   },
  ERROR:    { icon: 'cancel',        color: '#dc2626', bg: 'rgba(239,68,68,0.10)',   label: 'Error',     badgeClass: styles.badgeDeclined },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

const shortRef = (ref: string) => ref.replace('PAY-', '').slice(0, 8).toUpperCase();

// ── Order card ─────────────────────────────────────────────────────────────────
const OrderCard: React.FC<{ order: PaymentResponseDto }> = ({ order }) => {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CFG[order.status as StatusKey] ?? STATUS_CFG.ERROR;

  const total      = formatCOP(fromCents(order.totalAmountInCents));
  const product    = formatCOP(fromCents(order.productPriceInCents));
  const delivery   = formatCOP(fromCents(order.deliveryFeeInCents));
  const discount   = order.discountAmountInCents > 0
    ? formatCOP(fromCents(order.discountAmountInCents))
    : null;
  const totalItems = order.products.reduce((s, p) => s + p.quantity, 0);

  return (
    <div className={styles.orderCard}>

      {/* ── Main row ── */}
      <div className={styles.orderMain}>

        {/* Status icon */}
        <div className={styles.statusIcon} style={{ background: cfg.bg }}>
          <Icon name={cfg.icon} size={22} style={{ color: cfg.color }} />
        </div>

        {/* Info */}
        <div className={styles.orderInfo}>
          <div className={styles.orderTopRow}>
            <span className={styles.orderRef}>#{shortRef(order.reference)}</span>
            <span className={`${styles.badge} ${cfg.badgeClass}`}>
              <span className={styles.badgeDot} />
              {cfg.label}
            </span>
          </div>
          <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
          <p className={styles.orderMeta}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            {order.installments > 1 && ` · ${order.installments} cuotas`}
          </p>
        </div>

        {/* Amount + toggle */}
        <div className={styles.orderRight}>
          <p className={styles.orderTotal}>{total}</p>
          <p className={styles.orderCurrency}>COP</p>
          <button
            className={styles.toggleBtn}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <Icon name="expand_more" size={20} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
        </div>

      </div>

      {/* ── Expanded details ── */}
      {open && (
        <div className={styles.orderDetails}>

          <div className={styles.detailsGrid}>

            {/* Referencia completa */}
            <div className={styles.detailCell}>
              <p className={styles.detailLabel}>Referencia</p>
              <p className={`${styles.detailValue} ${styles.mono}`}>{order.reference}</p>
            </div>

            {/* ID Wompi */}
            <div className={styles.detailCell}>
              <p className={styles.detailLabel}>ID Transacción Wompi</p>
              <p className={`${styles.detailValue} ${styles.mono}`}>{order.wompiTransactionId || '—'}</p>
            </div>

            {/* Productos */}
            <div className={styles.detailCell}>
              <p className={styles.detailLabel}>Productos</p>
              {order.products.map((p) => (
                <p key={p.productId} className={styles.detailValue}>
                  <span className={styles.mono}>{p.productId.slice(0, 8)}…</span>
                  {' '}× {p.quantity}
                </p>
              ))}
            </div>

            {/* Cuotas */}
            <div className={styles.detailCell}>
              <p className={styles.detailLabel}>Cuotas</p>
              <p className={styles.detailValue}>
                {order.installments === 1 ? '1 cuota (sin interés)' : `${order.installments} cuotas`}
              </p>
            </div>

          </div>

          {/* Price breakdown */}
          <div className={styles.breakdown}>
            <div className={styles.breakdownLine}>
              <span className={styles.breakdownLabel}>Subtotal productos</span>
              <span className={styles.breakdownValue}>{product}</span>
            </div>
            <div className={styles.breakdownLine}>
              <span className={styles.breakdownLabel}>Envío</span>
              <span className={styles.breakdownValue}>{delivery}</span>
            </div>
            {discount && (
              <div className={`${styles.breakdownLine} ${styles.breakdownDiscount}`}>
                <span>Descuento</span>
                <span>−{discount}</span>
              </div>
            )}
            <div className={`${styles.breakdownLine} ${styles.breakdownTotal}`}>
              <span>Total</span>
              <span>{total} COP</span>
            </div>
          </div>

          {order.errorMessage && (
            <p className={styles.errorNote}>
              <Icon name="error" size={16} />
              {order.errorMessage}
            </p>
          )}

        </div>
      )}

    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItemCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const [email, setEmail]     = useState('');
  const [orders, setOrders]   = useState<PaymentResponseDto[]>([]);
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');
    try {
      const data = await paymentsService.getByCustomerEmail(trimmed);
      // Sort newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setStatus('done');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setErrorMsg(
        apiError?.statusCode === 404
          ? 'No encontramos pedidos para este correo.'
          : 'Error al consultar los pedidos. Intenta de nuevo.',
      );
      setOrders([]);
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.page}>
        <div className={styles.container}>

          {/* ── Header ── */}
          <div className={styles.pageHeader}>
            <div className={styles.headerIcon}>
              <Icon name="receipt_long" size={28} style={{ color: '#7e3ae4' }} />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Mis Pedidos</h1>
              <p className={styles.pageSubtitle}>Consulta el historial de tus transacciones</p>
            </div>
          </div>

          {/* ── Search form ── */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <Icon name="search" size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="email"
                className={styles.searchInput}
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              className={styles.searchBtn}
              disabled={status === 'loading' || !email.trim()}
            >
              {status === 'loading' ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <Icon name="search" size={18} />
                  Buscar pedidos
                </>
              )}
            </button>
          </form>

          {/* ── Loading ── */}
          {status === 'loading' && (
            <div className={styles.loadingState}>
              <span className={styles.spinnerLarge} />
              <p className={styles.loadingText}>Buscando tus pedidos…</p>
            </div>
          )}

          {/* ── Error ── */}
          {status === 'error' && (
            <div className={styles.messageBox}>
              <Icon name="inbox" size={40} style={{ color: '#dc2626' }} />
              <p className={styles.messageTitle}>{errorMsg}</p>
              <p className={styles.messageSub}>Verifica que el correo sea correcto e intenta de nuevo.</p>
            </div>
          )}

          {/* ── Results ── */}
          {status === 'done' && orders.length === 0 && (
            <div className={styles.messageBox}>
              <Icon name="receipt_long" size={40} style={{ color: '#cbd5e1' }} />
              <p className={styles.messageTitle}>Sin pedidos</p>
              <p className={styles.messageSub}>No encontramos transacciones asociadas a este correo.</p>
            </div>
          )}

          {status === 'done' && orders.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  <strong>{orders.length}</strong> pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}
                </p>
                <p className={styles.resultsEmail}>{email.trim()}</p>
              </div>

              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </>
          )}

          {/* ── Back link ── */}
          <button className={styles.backLink} onClick={() => navigate('/')}>
            <Icon name="arrow_back" size={16} />
            Volver a la tienda
          </button>

        </div>
      </main>

      <Footer />
    </>
  );
};
