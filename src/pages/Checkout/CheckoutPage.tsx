import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/hooks/useCart';
import { customersService } from '../../services/customers.service';
import { Footer } from '../../shared/components/layout/Footer/Footer';
import { Navbar } from '../../shared/components/layout/Navbar/Navbar';
import Icon from '../../shared/components/ui/Icon/Icon';
import { useToast } from '../../shared/hooks/useToast';
import type { ApiError } from '../../shared/types/api.types';
import { formatCOP } from '../../shared/utils/currency';
import type { RootState } from '../../store/store';
import styles from './CheckoutPage.module.css';

// ── Colombian departments + cities ───────────────────────────────────────────
const DEPARTMENTS: Record<string, string[]> = {
  Antioquia:            ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'Rionegro'],
  Atlántico:            ['Barranquilla', 'Soledad', 'Malambo'],
  'Bogotá D.C.':        ['Bogotá D.C.'],
  Bolívar:              ['Cartagena', 'Magangué', 'El Carmen de Bolívar'],
  Cundinamarca:         ['Soacha', 'Facatativá', 'Zipaquirá', 'Fusagasugá', 'Chía', 'Mosquera'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona'],
  Santander:            ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  'Valle del Cauca':    ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'],
};

/** Dado un nombre de ciudad, devuelve su departamento (o '' si no existe) */
const findDepartment = (city: string): string => {
  for (const [dept, cities] of Object.entries(DEPARTMENTS)) {
    if (cities.includes(city)) return dept;
  }
  return '';
};

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Estándar', description: '3-5 días hábiles', price: 5000  },
  { id: 'express',  label: 'Express',  description: '1-2 días hábiles', price: 15000 },
] as const;


// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  email:      string;
  firstName:  string;
  lastName:   string;
  phone:      string;
  docType:    string;
  docNumber:  string;
  department: string;
  city:       string;
  address:    string;
  postalCode: string;
  notes:      string;
}

type LookupStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error';

const initialForm: FormData = {
  email: '', firstName: '', lastName: '', phone: '',
  docType: 'CC', docNumber: '',
  department: '', city: '', address: '', postalCode: '', notes: '',
};

const requiredFields: (keyof FormData)[] = [
  'email', 'firstName', 'lastName', 'phone', 'docNumber', 'department', 'city', 'address', 'postalCode',
];

// ── Component ────────────────────────────────────────────────────────────────
export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast    = useToast();

  const cartItemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const { items, subtotal, discountCode, discountAmount, isEmpty, totalItems } = useCart();

  // Form state
  const [form, setForm]       = useState<FormData>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  // Customer lookup state
  const [lookupStatus, setLookupStatus]         = useState<LookupStatus>('idle');
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]         = useState(false);

  // Calculations

  const orderTotal   = subtotal - discountAmount;

  // ── Empty cart redirect ───────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <>
        <Navbar cartItemCount={0} onCartClick={() => navigate('/cart')} />
        <main className={styles.page}>
          <div className={styles.emptyState}>
            <Icon name="shopping_cart" size={72} style={{ color: '#cbd5e1' }} />
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptyText}>Agrega productos antes de continuar.</p>
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

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
        ...(field === 'department' ? { city: '' } : {}),
      }));
    };

  const blur = (field: keyof FormData) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const hasError = (field: keyof FormData) =>
    !!touched[field] && !form[field].trim();

  const cities     = form.department ? (DEPARTMENTS[form.department] ?? []) : [];
  const isFormValid = requiredFields.every((f) => form[f].trim() !== '');

  // ── Email change: reset lookup when user edits the email ──────────────────
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
    if (lookupStatus !== 'idle') {
      setLookupStatus('idle');
      setExistingCustomerId(null);
    }
  };

  // ── Email blur: lookup customer in the API ────────────────────────────────
  const handleEmailBlur = async () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const email = form.email.trim();
    // Basic email format check before hitting the API
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    setLookupStatus('searching');
    try {
      const customer = await customersService.getByEmail(email);

      // Split fullName into firstName + lastName
      const parts     = customer.fullName.trim().split(' ');
      const firstName = parts[0] ?? '';
      const lastName  = parts.slice(1).join(' ');

      // Try to match the API city to a known department
      const dept = findDepartment(customer.city);

      setExistingCustomerId(customer.id);
      setForm((prev) => ({
        ...prev,
        firstName,
        lastName,
        phone:      customer.phone,
        address:    customer.address,
        postalCode: customer.postalCode ?? '',
        department: dept,
        city:       dept ? customer.city : '',
      }));
      // Mark auto-filled fields as touched so ValidIcons show
      setTouched((prev) => ({
        ...prev,
        firstName: true, lastName: true, phone: true, address: true,
        ...(customer.postalCode ? { postalCode: true } : {}),
        ...(dept ? { department: true, city: true } : {}),
      }));
      setLookupStatus('found');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError?.statusCode === 404) {
        setExistingCustomerId(null);
        setLookupStatus('not-found');
      } else {
        setExistingCustomerId(null);
        setLookupStatus('error');
      }
    }
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Show all validation errors
    const touchAll: Partial<Record<keyof FormData, boolean>> = {};
    requiredFields.forEach((f) => { touchAll[f] = true; });
    setTouched(touchAll);
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      let customerId = existingCustomerId;

      const phone = form.phone.trim().startsWith('+')
        ? form.phone.trim()
        : `+57${form.phone.trim()}`;

      if (!customerId) {
        // New customer → create in the API
        const created = await customersService.create({
          email:      form.email.trim(),
          fullName:   `${form.firstName.trim()} ${form.lastName.trim()}`,
          phone,
          address:    form.address.trim(),
          city:       form.city,
          country:    'CO',
          postalCode: form.postalCode.trim(),
        });
        customerId = created.id;
        toast.success('Datos guardados correctamente');
      }

      // Navigate to payment, passing customer data + shipping cost as route state
      navigate('/payment', {
        state: {
          customerId,
          customerData: {
            email:      form.email.trim(),
            fullName:   `${form.firstName.trim()} ${form.lastName.trim()}`,
            phone,
            address:    form.address.trim(),
            city:       form.city,
            country:    'CO',
            postalCode: form.postalCode.trim(),
          },
        },
      });
    } catch {
      toast.error('No se pudo guardar tu información. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Email field right icon based on lookup status ─────────────────────────
  const iconStyle = { position: 'absolute' as const, right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' as const };

  const EmailIcon = () => {
    if (lookupStatus === 'searching') return <span className={styles.spinner} />;
    if (lookupStatus === 'found')     return <Icon name="check_circle" size={20} style={{ ...iconStyle, color: '#22c55e' }} />;
    if (lookupStatus === 'not-found') return <Icon name="person_add"   size={20} style={{ ...iconStyle, color: '#3b82f6' }} />;
    if (lookupStatus === 'error')     return <Icon name="warning"      size={20} style={{ ...iconStyle, color: '#f59e0b' }} />;
    if (form.email.trim() && !hasError('email'))
      return <Icon name="check_circle" size={20} style={{ ...iconStyle, color: '#22c55e' }} />;
    return null;
  };

  const ValidIcon = ({ show }: { show: boolean }) =>
    show ? <Icon name="check_circle" size={20} style={{ ...iconStyle, color: '#22c55e' }} /> : null;

  return (
    <>
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.page}>

        {/* ── Progress stepper ── */}
        <div className={styles.stepper}>
          {(['Datos', 'Envío', 'Pago', 'Confirmación'] as const).map((label, i) => (
            <React.Fragment key={label}>
              <div className={`${styles.stepItem} ${i === 0 ? styles.stepActive : styles.stepInactive}`}>
                <span className={styles.stepCircle}>{i + 1}</span>
                <span className={styles.stepLabel}>{label}</span>
              </div>
              {i < 3 && (
                <Icon name="chevron_right" size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Page title ── */}
        <h1 className={styles.heading}>Checkout</h1>

        {/* ── Lookup status banners ── */}
        {lookupStatus === 'found' && (
          <div className={`${styles.lookupBanner} ${styles.lookupBannerFound}`}>
            <Icon name="check_circle" size={20} />
            <div>
              <p className={styles.lookupBannerTitle}>Cliente encontrado</p>
              <p className={styles.lookupBannerSub}>Tus datos han sido cargados automáticamente. Puedes editarlos si lo necesitas.</p>
            </div>
          </div>
        )}

        {lookupStatus === 'not-found' && (
          <div className={`${styles.lookupBanner} ${styles.lookupBannerNew}`}>
            <Icon name="person_add" size={20} />
            <div>
              <p className={styles.lookupBannerTitle}>Nuevo cliente</p>
              <p className={styles.lookupBannerSub}>Completa tus datos para continuar. Los guardaremos para futuras compras.</p>
            </div>
          </div>
        )}

        {lookupStatus === 'error' && (
          <div className={`${styles.lookupBanner} ${styles.lookupBannerWarn}`}>
            <Icon name="warning" size={20} />
            <div>
              <p className={styles.lookupBannerTitle}>No pudimos verificar tu correo</p>
              <p className={styles.lookupBannerSub}>Completa tus datos manualmente para continuar.</p>
            </div>
          </div>
        )}

        {/* ── Main form grid ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.layout}>

            {/* ══ Left column ══ */}
            <div className={styles.leftCol}>

              {/* Section 1 – Personal info */}
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <Icon name="person" size={22} style={{ color: '#7e3ae4' }} />
                  Información Personal
                </h2>

                <div className={styles.fieldGrid}>

                  {/* Email – full width + lookup trigger */}
                  <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="email">
                      Correo electrónico <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="email" type="email"
                        className={`${styles.input} ${hasError('email') ? styles.inputError : ''} ${lookupStatus === 'found' ? styles.inputFound : ''}`}
                        placeholder="correo@ejemplo.com"
                        value={form.email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        autoComplete="email"
                        disabled={isSubmitting}
                      />
                      <EmailIcon />
                    </div>
                    {hasError('email') && <span className={styles.errorMsg}>El correo es requerido</span>}
                  </div>

                  {/* First name */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="firstName">
                      Nombre <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="firstName" type="text"
                        className={`${styles.input} ${hasError('firstName') ? styles.inputError : ''}`}
                        placeholder="Ana"
                        value={form.firstName} onChange={set('firstName')} onBlur={blur('firstName')}
                        autoComplete="given-name" disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.firstName.trim() && !hasError('firstName')} />
                    </div>
                    {hasError('firstName') && <span className={styles.errorMsg}>El nombre es requerido</span>}
                  </div>

                  {/* Last name */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="lastName">
                      Apellido <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="lastName" type="text"
                        className={`${styles.input} ${hasError('lastName') ? styles.inputError : ''}`}
                        placeholder="García"
                        value={form.lastName} onChange={set('lastName')} onBlur={blur('lastName')}
                        autoComplete="family-name" disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.lastName.trim() && !hasError('lastName')} />
                    </div>
                    {hasError('lastName') && <span className={styles.errorMsg}>El apellido es requerido</span>}
                  </div>

                  {/* Phone */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="phone">
                      Teléfono / Celular <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="phone" type="tel"
                        className={`${styles.input} ${hasError('phone') ? styles.inputError : ''}`}
                        placeholder="3001234567"
                        value={form.phone} onChange={set('phone')} onBlur={blur('phone')}
                        autoComplete="tel" maxLength={10} disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.phone.trim() && !hasError('phone')} />
                    </div>
                    {hasError('phone') && <span className={styles.errorMsg}>El teléfono es requerido</span>}
                  </div>

                  {/* Doc type */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="docType">Tipo de documento</label>
                    <select id="docType" className={styles.select} value={form.docType} onChange={set('docType')} disabled={isSubmitting}>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="NIT">NIT</option>
                      <option value="PA">Pasaporte</option>
                    </select>
                  </div>

                  {/* Doc number */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="docNumber">
                      Número de documento <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="docNumber" type="text"
                        className={`${styles.input} ${hasError('docNumber') ? styles.inputError : ''}`}
                        placeholder="1234567890"
                        value={form.docNumber} onChange={set('docNumber')} onBlur={blur('docNumber')}
                        maxLength={15} disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.docNumber.trim() && !hasError('docNumber')} />
                    </div>
                    {hasError('docNumber') && <span className={styles.errorMsg}>El número de documento es requerido</span>}
                  </div>

                </div>
              </section>

              {/* Section 2 – Address + Shipping method */}
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <Icon name="local_shipping" size={22} style={{ color: '#7e3ae4' }} />
                  Dirección de Envío
                </h2>

                <div className={styles.fieldGrid}>

                  {/* Department */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="department">
                      Departamento <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="department"
                      className={`${styles.select} ${hasError('department') ? styles.inputError : ''}`}
                      value={form.department} onChange={set('department')} onBlur={blur('department')}
                      disabled={isSubmitting}
                    >
                      <option value="">Selecciona un departamento</option>
                      {Object.keys(DEPARTMENTS).map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    {hasError('department') && <span className={styles.errorMsg}>Selecciona un departamento</span>}
                  </div>

                  {/* City */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="city">
                      Ciudad <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="city"
                      className={`${styles.select} ${hasError('city') ? styles.inputError : ''}`}
                      value={form.city} onChange={set('city')} onBlur={blur('city')}
                      disabled={!form.department || isSubmitting}
                    >
                      <option value="">
                        {form.department ? 'Selecciona una ciudad' : 'Elige primero un departamento'}
                      </option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {hasError('city') && <span className={styles.errorMsg}>Selecciona una ciudad</span>}
                  </div>

                  {/* Address */}
                  <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="address">
                      Dirección / Address <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="address" type="text"
                        className={`${styles.input} ${hasError('address') ? styles.inputError : ''}`}
                        placeholder="Calle 123 # 45 - 67"
                        value={form.address} onChange={set('address')} onBlur={blur('address')}
                        autoComplete="street-address" disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.address.trim() && !hasError('address')} />
                    </div>
                    {hasError('address') && <span className={styles.errorMsg}>La dirección es requerida</span>}
                  </div>

                  {/* Postal code */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="postalCode">
                      Código Postal <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="postalCode" type="text" inputMode="numeric"
                        className={`${styles.input} ${hasError('postalCode') ? styles.inputError : ''}`}
                        placeholder="110111"
                        value={form.postalCode} onChange={set('postalCode')} onBlur={blur('postalCode')}
                        maxLength={6} disabled={isSubmitting}
                      />
                      <ValidIcon show={!!form.postalCode.trim() && !hasError('postalCode')} />
                    </div>
                    {hasError('postalCode') && <span className={styles.errorMsg}>El código postal es requerido</span>}
                  </div>

                  {/* Notes */}
                  <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="notes">
                      Notas de entrega <span className={styles.optional}>(Opcional)</span>
                    </label>
                    <textarea
                      id="notes" className={styles.textarea}
                      placeholder="Apartamento, piso, portería, referencias, etc."
                      value={form.notes} onChange={set('notes')}
                      rows={3} disabled={isSubmitting}
                    />
                  </div>

                </div>
              </section>

            </div>

            {/* ══ Right column – Order summary ══ */}
            <div className={styles.rightCol}>
              <div className={styles.summaryCard}>

                <div className={styles.summaryHeader}>
                  <h2 className={styles.summaryTitle}>Resumen de Compra</h2>
                  <p className={styles.summarySubtitle}>
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                  </p>
                </div>

                {/* Scrollable items */}
                <div className={styles.itemsList}>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className={styles.summaryItem}>
                      <div className={styles.summaryImgWrapper}>
                        <img src={product.imgUrl} alt={product.name} className={styles.summaryImg} />
                      </div>
                      <div className={styles.summaryItemInfo}>
                        <div className={styles.summaryItemRow}>
                          <h3 className={styles.summaryItemName}>{product.name}</h3>
                          <p className={styles.summaryItemPrice}>{formatCOP(product.price * quantity)}</p>
                        </div>
                        <p className={styles.summaryItemCategory}>{product.category}</p>
                        <p className={styles.summaryItemQty}>Qty {quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceLine}>
                    <span className={styles.priceLineLabel}>Subtotal</span>
                    <span className={styles.priceLineValue}>{formatCOP(subtotal)}</span>
                  </div>

                  {discountCode && discountAmount > 0 && (
                    <div className={`${styles.priceLine} ${styles.priceLineDiscount}`}>
                      <span>Descuento ({discountCode})</span>
                      <span>-{formatCOP(discountAmount)}</span>
                    </div>
                  )}

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>{formatCOP(orderTotal)}</span>
                  </div>

                  <button type="submit" className={styles.ctaBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinnerBtn} />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <span>Continuar al Pago</span>
                        <Icon name="arrow_forward" size={20} />
                      </>
                    )}
                  </button>

                  <div className={styles.wompiNote}>
                    <span style={{ fontWeight: 600, color: '#94a3b8' }}>Powered by Wompi</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </>
  );
};
