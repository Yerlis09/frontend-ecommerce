import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CategoryChips, HeroBanner, ProductGrid } from '../../features/catalog';
import { useFilters } from '../../features/catalog/hooks/useFilters';
import { useProducts } from '../../features/catalog/hooks/useProducts';
import { mapProductDto } from '../../features/catalog/utils/mapProduct';
import { Footer } from '../../shared/components/layout/Footer/Footer';
import { Navbar } from '../../shared/components/layout/Navbar/Navbar';
import { Skeleton } from '../../shared/components/ui/Skeleton/Skeleton';
import Icon from '../../shared/components/ui/Icon/Icon';
import { useToast } from '../../shared/hooks/useToast';
import { addItem as addItemAction } from '../../store/cartSlice';
import type { AppDispatch, RootState } from '../../store/store';
import styles from './HomePage.module.css';

/** Mapeo de palabras clave (sin tildes, minúsculas) → icono de Material Symbols */
const ICON_MAP: [string, string][] = [
  ['electronic', 'devices'],   ['electronica', 'devices'],  ['tech', 'devices'],
  ['tecnologia', 'devices'],   ['computador', 'computer'],  ['computer', 'computer'],
  ['phone', 'smartphone'],     ['celular', 'smartphone'],   ['movil', 'smartphone'],
  ['audio', 'headphones'],     ['gaming', 'sports_esports'],
  ['fashion', 'checkroom'],    ['moda', 'checkroom'],       ['ropa', 'checkroom'],
  ['clothing', 'checkroom'],   ['zapatos', 'steps'],        ['shoes', 'steps'],
  ['calzado', 'steps'],        ['accessories', 'watch'],    ['accesorios', 'watch'],
  ['home', 'chair'],           ['hogar', 'chair'],          ['furniture', 'chair'],
  ['muebles', 'chair'],        ['kitchen', 'kitchen'],      ['cocina', 'kitchen'],
  ['garden', 'yard'],          ['jardin', 'yard'],
  ['beauty', 'face'],          ['belleza', 'face'],         ['cosmetic', 'face'],
  ['cosmetica', 'face'],       ['perfume', 'local_florist'],['skincare', 'face_3'],
  ['hair', 'content_cut'],
  ['sport', 'sports_soccer'],  ['deporte', 'sports_soccer'],['fitness', 'fitness_center'],
  ['gym', 'fitness_center'],   ['outdoor', 'hiking'],
  ['kids', 'toys'],            ['ninos', 'toys'],           ['baby', 'toys'],
  ['bebe', 'toys'],            ['juguete', 'toys'],         ['toy', 'toys'],
  ['food', 'restaurant'],      ['comida', 'restaurant'],    ['alimento', 'restaurant'],
  ['grocery', 'shopping_basket'],['supermercado', 'shopping_basket'],
  ['book', 'menu_book'],       ['libro', 'menu_book'],      ['education', 'school'],
  ['educacion', 'school'],     ['pet', 'pets'],             ['mascota', 'pets'],
  ['health', 'health_and_safety'],['salud', 'health_and_safety'],['pharmacy', 'medication'],
];

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const getIconForCategory = (category: string): string => {
  const n = normalize(category);
  const match = ICON_MAP.find(([key]) => n.includes(key));
  return match ? match[1] : 'sell';
};

const ProductGridSkeleton: React.FC = () => (
  <div className={styles.skeletonGrid}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton height="240px" borderRadius="16px" />
        <Skeleton height="12px" width="50%" />
        <Skeleton height="18px" width="85%" />
        <Skeleton height="14px" width="40%" />
      </div>
    ))}
  </div>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const cartItemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const { data: productDtos = [], isLoading, isError } = useProducts();

  const { filters, filtered: filteredDtos, setCategory, setSearch } = useFilters(productDtos);

  const filtered = React.useMemo(
    () => filteredDtos.map(mapProductDto),
    [filteredDtos]
  );

  const categories = React.useMemo(() => {
    const fromBackend = [...new Set(productDtos.map((p) => p.category))].map((cat) => ({
      id: cat,
      name: cat,
      icon: getIconForCategory(cat),
    }));
    return [{ id: 'all', name: 'Todas', icon: 'grid_view' }, ...fromBackend];
  }, [productDtos]);

  const flashSaleEndTime = React.useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  }, []);

  const handleAddToCart = (productId: string) => {
    const product = productDtos.find((p) => p.id === productId);
    if (product) {
      dispatch(addItemAction({ product, quantity: 1 }));
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const handleFavorite = (productId: string) => console.log('Favorite:', productId);

  return (
    <>
      <Navbar
        cartItemCount={cartItemCount}
        onSearch={setSearch}
        onCartClick={() => navigate('/cart')}
      />

      <main className={styles.main}>
        <HeroBanner
          title="Next Gen Audio"
          subtitle="Immerse yourself in crystal clear sound. Get up to 50% off on selected electronics this weekend."
          highlight="Has Arrived."
          ctaText="Shop Now"
          onCtaClick={() => console.log('CTA clicked')}
          endTime={flashSaleEndTime}
        />

        <CategoryChips
          categories={categories}
          selectedCategory={filters.category}
          onSelectCategory={setCategory}
        />

        {isLoading && <ProductGridSkeleton />}

        {isError && (
          <div className={styles.errorBox}>
            <Icon name="wifi_off" size={48} style={{ color: '#ef4444' }} />
            <p style={{ marginTop: '12px', fontWeight: 600, color: '#991b1b' }}>
              No se pudo conectar con el servidor
            </p>
            <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>
              Verifica que el backend esté corriendo en{' '}
              <code>http://localhost:3000</code>
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <ProductGrid
            products={filtered}
            title={`Productos${filtered.length > 0 ? ` (${filtered.length})` : ''}`}
            onViewAll={() => {}}
            onNavigate={(id) => navigate(`/product/${id}`)}
            onAddToCart={handleAddToCart}
            onFavorite={handleFavorite}
          />
        )}

        {/* ── Benefits bar ── */}
        <section className={styles.benefitsGrid}>
          {[
            { icon: 'local_shipping', title: 'Envío rápido',        desc: 'Entrega en 24–48 h a todo el país' },
            { icon: 'autorenew',      title: 'Devoluciones fáciles', desc: '30 días para cambios sin costo' },
            { icon: 'verified_user',  title: 'Pago seguro',          desc: 'Encriptación SSL 256 bits con Wompi' },
            { icon: 'support_agent',  title: 'Soporte 24/7',         desc: 'Equipo listo para ayudarte siempre' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className={styles.benefitCard}>
              <div className={styles.benefitIconBox}>
                <Icon name={icon} size={22} style={{ color: '#6C3CE1' }} />
              </div>
              <div>
                <p className={styles.benefitTitle}>{title}</p>
                <p className={styles.benefitDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaDecor1} />
          <div className={styles.ctaDecor2} />

          <div className={styles.ctaText}>
            <p className={styles.ctaOverline}>Oferta de temporada</p>
            <h2 className={styles.ctaHeading}>
              ¡Hasta 50% de descuento<br />en productos seleccionados!
            </h2>
            <p className={styles.ctaSub}>
              Aprovecha los mejores precios solo por tiempo limitado.
            </p>
          </div>

          <button
            className={styles.ctaBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Icon name="shopping_bag" size={20} />
            Comprar ahora
          </button>
        </section>

        {/* ── Newsletter ── */}
        <section className={styles.newsletter}>
          <Icon name="mail" size={36} style={{ color: '#6C3CE1' }} />
          <h3 className={styles.newsletterTitle}>Suscríbete y ahorra</h3>
          <p className={styles.newsletterSub}>
            Recibe ofertas exclusivas, novedades y descuentos directamente en tu correo.
          </p>
          <div className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterBtn}>
              Suscribirme
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};
