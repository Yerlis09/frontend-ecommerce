import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem as addItemAction } from '../store/cartSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Navbar } from '../shared/components/layout/Navbar/Navbar';
import { Footer } from '../shared/components/layout/Footer/Footer';
import { HeroBanner, CategoryChips, ProductGrid } from '../features/catalog';
import { useProducts } from '../features/catalog/hooks/useProducts';
import { useFilters } from '../features/catalog/hooks/useFilters';
import { mapProductDto } from '../features/catalog/utils/mapProduct';
import { Skeleton } from '../shared/components/ui/Skeleton/Skeleton';
import { useToast } from '../shared/hooks/useToast';
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
  const { filters, filtered: filteredDtos, setCategory } = useFilters(productDtos);

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

  const handleSearch = (query: string) => console.log('Search:', query);

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
        user={{ name: 'Ana' }}
        cartItemCount={cartItemCount}
        onSearch={handleSearch}
        onCartClick={() => navigate('/cart')}
        onWishlistClick={() => console.log('Wishlist clicked')}
        onProfileClick={() => console.log('Profile clicked')}
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
            title={`Featured Products${filtered.length > 0 ? ` (${filtered.length})` : ''}`}
            onViewAll={() => console.log('View all')}
            onNavigate={(id) => navigate(`/product/${id}`)}
            onAddToCart={handleAddToCart}
            onFavorite={handleFavorite}
          />
        )}
      </main>

      <Footer />
    </>
  );
};
