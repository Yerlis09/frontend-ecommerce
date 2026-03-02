import React, { useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/hooks/useCart';
import type { CustomerDto } from '../../services/customers.service';
import type { PaymentResponseDto } from '../../services/payments.service';
import { paymentsService } from '../../services/payments.service';
import { wompiService } from '../../services/wompi.service';
import { Footer } from '../../shared/components/layout/Footer/Footer';
import { Navbar } from '../../shared/components/layout/Navbar/Navbar';
import { useToast } from '../../shared/hooks/useToast';
import type { ApiError } from '../../shared/types/api.types';
import { formatCOP } from '../../shared/utils/currency';
import type { RootState } from '../../store/store';
import styles from './PaymentPage.module.css';

// ── Types ────────────────────────────────────────────────────────────────────
type PaymentTab = 'card' | 'pse' | 'nequi' | 'efecty';
type PaymentStatus = 'idle' | 'processing' | 'error';

// Amex CVV is 4 digits; all others 3
const isAmex = (number: string) => /^3[47]/.test(number.replace(/\s/g, ''));

const formatCardNumber = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// ── Route state interface ──────────────────────────────────────────────────
interface RouteState {
  customerId: string;
  customerData: CustomerDto;
  shippingCost: number;
}

// ── Card form state ────────────────────────────────────────────────────────
interface CardForm {
  cardNumber:  string;
  cardHolder:  string;
  expiry:      string;
  cvv:         string;
  installments: string;
}

const initialCard: CardForm = {
  cardNumber: '', cardHolder: '', expiry: '', cvv: '', installments: '1',
};


// ── Component ──────────────────────────────────────────────────────────────
export const PaymentPage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const toast     = useToast();

  const state = location.state as RouteState | null;

  const cartItemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const { items, subtotal, discountCode, discountAmount, isEmpty } = useCart();

  // Redirect if arrived without checkout data or cart is empty
  useEffect(() => {
    if (!state?.customerData || isEmpty) {
      navigate('/checkout', { replace: true });
    }
  }, [state, isEmpty, navigate]);

  const { customerData, shippingCost = 5000 } = state ?? {};

  const orderTotal = subtotal - discountAmount + (shippingCost ?? 0);

  // Form state
  const [activeTab, setActiveTab]       = useState<PaymentTab>('card');
  const [cardForm, setCardForm]         = useState<CardForm>(initialCard);
  const [touched, setTouched]           = useState<Partial<Record<keyof CardForm, boolean>>>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);

  const [focused, setFocused] = useState<'number' | 'name' | 'expiry' | 'cvc' | ''>('');

  // ── Input handlers ──────────────────────────────────────────────────────
  const setCard = (field: keyof CardForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let val = e.target.value;
      if (field === 'cardNumber') val = formatCardNumber(val);
      if (field === 'expiry')     val = formatExpiry(val);
      if (field === 'cvv')        val = val.replace(/\D/g, '').slice(0, isAmex(cardForm.cardNumber) ? 4 : 3);
      if (field === 'cardHolder') val = val.toUpperCase();
      setCardForm((prev) => ({ ...prev, [field]: val }));
    };

  const blur = (field: keyof CardForm) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const hasError = (field: keyof CardForm) =>
    !!touched[field] && !cardForm[field].trim();

  const isCardFormValid =
    cardForm.cardNumber.replace(/\s/g, '').length >= 15 &&
    cardForm.cardHolder.trim().length >= 3 &&
    cardForm.expiry.length === 5 &&
    cardForm.cvv.length >= 3;

  // ── Payment submission ──────────────────────────────────────────────────
  const handlePayment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setTouched({ cardNumber: true, cardHolder: true, expiry: true, cvv: true });
    if (!isCardFormValid || !customerData) return;

    setPaymentStatus('processing');
    setErrorMsg(null);

    try {
      const [exp_month, exp_year] = cardForm.expiry.split('/');
      const cardToken = await wompiService.tokenizeCard({
        number:      cardForm.cardNumber.replace(/\s/g, ''),
        cvc:         cardForm.cvv,
        exp_month:   exp_month ?? '',
        exp_year:    exp_year ?? '',
        card_holder: cardForm.cardHolder,
      });

      // Build products payload
      const products = items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      // Call backend
      const payment: PaymentResponseDto = await paymentsService.create({
        customer:     customerData,
        products,
        cardToken,
        installments: parseInt(cardForm.installments, 10),
        ...(discountCode         ? { discountCode }              : {}),
        ...(wompiService.isSandbox ? { sandboxStatus: 'APPROVED' } : {}),
      });

      // Navigate to confirmation page (cart is cleared there)
      navigate('/order-confirmed', { state: { payment }, replace: true });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const msg = apiError?.message ?? 'Error al procesar el pago. Intenta de nuevo.';
      setErrorMsg(msg);
      setPaymentStatus('error');
      toast.error(msg);
    }
  };

  // ── Payment tabs config ────────────────────────────────────────────────
  const TABS: { id: PaymentTab; label: string; icon: string }[] = [
    { id: 'card',   label: 'Crédito / Débito', icon: 'credit_card'      },
    { id: 'pse',    label: 'PSE',              icon: 'account_balance'  },
    { id: 'nequi',  label: 'Nequi',            icon: 'smartphone'       },
    { id: 'efecty', label: 'Efecty',           icon: 'payments'         },
  ];

  if (!state?.customerData) return null; // brief flash before redirect

  return (
    <>
      <Navbar
        cartItemCount={cartItemCount}
        onSearch={() => {}}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.page}>

        {/* ── Stepper: Cart → Envío → Pago (active) ── */}
        <nav className={styles.stepper}>
          {(['Carrito', 'Envío', 'Pago'] as const).map((label, i) => (
            <React.Fragment key={label}>
              <div className={`${styles.stepItem} ${i === 2 ? styles.stepActive : styles.stepDone}`}>
                <span className={styles.stepCircle}>{i === 2 ? 3 : <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>}</span>
                {label}
              </div>
              {i < 2 && <span className={styles.stepSep}>/</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* ── Main grid ── */}
        <div className={styles.layout}>

          {/* ══ Left column: payment form ══ */}
          <div className={styles.leftCol}>
            <div className={styles.card}>

              {/* Header */}
              <div className={styles.cardHeader}>
                <div>
                  <h1 className={styles.cardTitle}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#7e3ae4' }}>credit_card</span>
                    Información de pago
                  </h1>
                  <p className={styles.cardSubtitle}>
                    Transacción segura procesada por <strong style={{ color: '#101935' }}>Wompi</strong>
                  </p>
                </div>
                {/* Brand logos */}
                <div className={styles.brandLogos}>
                  <span className={`${styles.brandBadge} ${styles.brandVisa}`}>Visa</span>
                  <span className={`${styles.brandBadge} ${styles.brandMC}`}>MC</span>
                  <span className={`${styles.brandBadge} ${styles.brandAmex}`}>Amex</span>
                </div>
              </div>

              {/* Payment method tabs */}
              <div className={styles.tabs}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className={styles.errorBanner}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Credit card form */}
              {activeTab === 'card' && (
                <form onSubmit={handlePayment} noValidate>

                  {/* react-credit-cards-2 */}
                  <div className={styles.cardVisualWrapper}>
                    <Cards
                      number={cardForm.cardNumber}
                      name={cardForm.cardHolder}
                      expiry={cardForm.expiry.replace('/', '')}
                      cvc={cardForm.cvv}
                      focused={focused}
                    />
                  </div>

                  <div className={styles.formFields}>

                    {/* Card number */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor="cardNumber">
                        Número de Tarjeta <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#94a3b8', pointerEvents: 'none' }}>
                          credit_card
                        </span>
                        <input
                          id="cardNumber" type="text" inputMode="numeric"
                          className={`${styles.input} ${styles.inputPadded} ${hasError('cardNumber') ? styles.inputError : ''}`}
                          placeholder="0000 0000 0000 0000"
                          value={cardForm.cardNumber}
                          onChange={setCard('cardNumber')}
                          onFocus={() => setFocused('number')}
                          onBlur={blur('cardNumber')}
                          autoComplete="cc-number"
                        />
                      </div>
                      {hasError('cardNumber') && <span className={styles.errorMsg}>Ingresa un número de tarjeta válido</span>}
                    </div>

                    {/* Card holder */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor="cardHolder">
                        Nombre en la tarjeta <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="cardHolder" type="text"
                        className={`${styles.input} ${hasError('cardHolder') ? styles.inputError : ''}`}
                        placeholder="Como aparece en la tarjeta"
                        value={cardForm.cardHolder}
                        onChange={setCard('cardHolder')}
                        onFocus={() => setFocused('name')}
                        onBlur={blur('cardHolder')}
                        autoComplete="cc-name"
                      />
                      {hasError('cardHolder') && <span className={styles.errorMsg}>Ingresa el nombre del titular</span>}
                    </div>

                    {/* Expiry + CVV row */}
                    <div className={styles.twoCol}>

                      {/* Expiry */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="expiry">
                          Fecha de Expiración <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="expiry" type="text" inputMode="numeric"
                          className={`${styles.input} ${hasError('expiry') ? styles.inputError : ''}`}
                          placeholder="MM/AA"
                          value={cardForm.expiry}
                          onChange={setCard('expiry')}
                          onFocus={() => setFocused('expiry')}
                          onBlur={blur('expiry')}
                          autoComplete="cc-exp"
                        />
                        {hasError('expiry') && <span className={styles.errorMsg}>Fecha requerida</span>}
                      </div>

                      {/* CVV */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="cvv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          CVV <span className={styles.required}>*</span>
                          <span className="material-symbols-outlined" title="Código de 3 dígitos al reverso de tu tarjeta" style={{ fontSize: '15px', color: '#94a3b8', cursor: 'help' }}>help</span>
                        </label>
                        <div className={styles.inputWrapper}>
                          <input
                            id="cvv" type="password" inputMode="numeric"
                            className={`${styles.input} ${hasError('cvv') ? styles.inputError : ''}`}
                            placeholder={isAmex(cardForm.cardNumber) ? '0000' : '000'}
                            value={cardForm.cvv}
                            onChange={setCard('cvv')}
                            onFocus={() => setFocused('cvc')}
                            onBlur={blur('cvv')}
                            autoComplete="cc-csc"
                          />
                          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94a3b8', pointerEvents: 'none' }}>
                            lock
                          </span>
                        </div>
                        {hasError('cvv') && <span className={styles.errorMsg}>CVV requerido</span>}
                      </div>

                    </div>

                    {/* Installments */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor="installments">
                        Número de Cuotas
                      </label>
                      <div className={styles.inputWrapper}>
                        <select
                          id="installments"
                          className={`${styles.select}`}
                          value={cardForm.installments}
                          onChange={setCard('installments')}
                        >
                          <option value="1">1 Cuota</option>
                        </select>
                        <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#64748b', pointerEvents: 'none' }}>
                          expand_more
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Security notice */}
                  <div className={styles.securityNote}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#7e3ae4', flexShrink: 0 }}>verified_user</span>
                    <div>
                      <h4 className={styles.securityTitle}>Pagos seguros encriptados</h4>
                      <p className={styles.securityText}>
                        Sus datos están protegidos con encriptación SSL de 256 bits. Wompi nunca almacena su código de seguridad (CVV).
                      </p>
                    </div>
                  </div>

                </form>
              )}

              {/* Other payment method tabs → Próximamente */}
              {activeTab !== 'card' && (
                <div className={styles.comingSoon}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>construction</span>
                  <p className={styles.comingSoonTitle}>Próximamente</p>
                  <p className={styles.comingSoonSub}>Este método de pago estará disponible pronto.</p>
                </div>
              )}

            </div>
          </div>

          {/* ══ Right column: order summary ══ */}
          <div className={styles.rightCol}>
            <div className={styles.summaryCard}>

              <h3 className={styles.summaryTitle}>Resumen de compra</h3>

              {/* Items */}
              <div className={styles.itemsList}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className={styles.summaryItem}>
                    <div className={styles.summaryImgWrapper}>
                      <img src={product.imgUrl} alt={product.name} className={styles.summaryImg} />
                    </div>
                    <div className={styles.summaryItemInfo}>
                      <p className={styles.summaryItemName}>{product.name}</p>
                      <p className={styles.summaryItemMeta}>Qty: {quantity}</p>
                    </div>
                    <span className={styles.summaryItemPrice}>{formatCOP(product.price * quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className={styles.breakdown}>
                <div className={styles.breakdownLine}>
                  <span className={styles.breakdownLabel}>Subtotal</span>
                  <span className={styles.breakdownValue}>{formatCOP(subtotal)}</span>
                </div>
                {discountCode && discountAmount > 0 && (
                  <div className={`${styles.breakdownLine} ${styles.breakdownDiscount}`}>
                    <span>Descuento ({discountCode})</span>
                    <span>-{formatCOP(discountAmount)}</span>
                  </div>
                )}
                <div className={styles.breakdownLine}>
                  <span className={styles.breakdownLabel}>Envío</span>
                  <span className={styles.breakdownValue}>{formatCOP(shippingCost ?? 0)}</span>
                </div>
              </div>

              {/* Total */}
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total a pagar</span>
                  <div>
                    <span className={styles.totalValue}>{formatCOP(orderTotal)}</span>
                    <span className={styles.totalCurrency}>COP</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="payment-form"
                  className={styles.payBtn}
                  disabled={paymentStatus === 'processing' || activeTab !== 'card'}
                  onClick={activeTab === 'card' ? handlePayment : undefined}
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <span className={styles.spinnerBtn} />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                      <span>Confirmar y Pagar</span>
                    </>
                  )}
                </button>

                <p className={styles.termsNote}>
                  Al confirmar, aceptas los{' '}
                  <button type="button" className={styles.termsLink}>Términos y Condiciones</button>
                  {' '}de ShopWave y la política de privacidad de Wompi.
                </p>
              </div>

              {/* Support widget */}
              <div className={styles.supportWidget}>
                <div className={styles.supportIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#7e3ae4' }}>support_agent</span>
                </div>
                <div>
                  <p className={styles.supportTitle}>¿Necesitas ayuda?</p>
                  <p className={styles.supportSub}>Llámanos al +57 601 123 4567</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Loading overlay ── */}
      {paymentStatus === 'processing' && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <svg className={styles.loadingRing} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className={styles.loadingRingBg} />
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className={styles.loadingRingFg} />
            </svg>
          </div>
          <h3 className={styles.loadingTitle}>Procesando con Wompi...</h3>
          <p className={styles.loadingSubtitle}>Por favor no cierres esta ventana</p>
        </div>
      )}

      <Footer />
    </>
  );
};
