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
import { useToast } from '../../shared/hooks/useToast';
import { addItem as addItemAction } from '../../store/cartSlice';
import type { AppDispatch, RootState } from '../../store/store';
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
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '24px',
    }}
  >
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

  // useFilters trabaja con ProductResponseDto (tiene `description` para búsqueda)
  const { filters, filtered: filteredDtos, setCategory, setSearch } = useFilters(productDtos);

  // Mapear a Product (tipo del frontend) solo los registros ya filtrados
  const filtered = React.useMemo(
    () => filteredDtos.map(mapProductDto),
    [filteredDtos]
  );

  // Categorías 100% dinámicas del backend + chip "Todas" fijo al inicio
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

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#fee2e2',
              borderRadius: '16px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '48px', color: '#ef4444' }}
            >
              wifi_off
            </span>
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
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { icon: 'local_shipping', title: 'Envío rápido',       desc: 'Entrega en 24–48 h a todo el país' },
            { icon: 'autorenew',      title: 'Devoluciones fáciles', desc: '30 días para cambios sin costo'    },
            { icon: 'verified_user',  title: 'Pago seguro',         desc: 'Encriptación SSL 256 bits con Wompi' },
            { icon: 'support_agent',  title: 'Soporte 24/7',        desc: 'Equipo listo para ayudarte siempre' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              background: '#fff', borderRadius: '16px',
              padding: '20px', border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(108,60,225,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#6C3CE1' }}>{icon}</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── CTA Banner ── */}
        <section style={{
          background: 'linear-gradient(135deg, #6C3CE1 0%, #a855f7 100%)',
          borderRadius: '24px',
          padding: '48px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '120px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Oferta de temporada
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
              ¡Hasta 50% de descuento<br />en productos seleccionados!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '12px', fontSize: '0.95rem' }}>
              Aprovecha los mejores precios solo por tiempo limitado.
            </p>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'relative', zIndex: 1,
              background: '#fff', color: '#6C3CE1',
              border: 'none', borderRadius: '14px',
              padding: '14px 28px', fontWeight: 800,
              fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: '8px',
              flexShrink: 0,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
            Comprar ahora
          </button>
        </section>

        {/* ── Newsletter ── */}
        <section style={{
          background: '#f8faff',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid #e8eaf6',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#6C3CE1' }}>mail</span>
          <h3 style={{ margin: '12px 0 6px', fontWeight: 800, fontSize: '1.4rem', color: '#0f172a' }}>
            Suscríbete y ahorra
          </h3>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>
            Recibe ofertas exclusivas, novedades y descuentos directamente en tu correo.
          </p>
          <div style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '12px',
                border: '1.5px solid #e2e8f0', fontSize: '0.9rem',
                outline: 'none', background: '#fff', color: '#0f172a',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#6C3CE1'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
            />
            <button style={{
              background: '#6C3CE1', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '12px 20px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              Suscribirme
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};
