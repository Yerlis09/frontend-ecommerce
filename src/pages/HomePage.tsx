import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../shared/components/layout/Navbar/Navbar';
import { Footer } from '../shared/components/layout/Footer/Footer';
import { HeroBanner, CategoryChips, ProductGrid } from '../features/catalog';
import { useProducts } from '../features/catalog/hooks/useProducts';
import { useFilters } from '../features/catalog/hooks/useFilters';
import { mapProductDto } from '../features/catalog/utils/mapProduct';
import { Skeleton } from '../shared/components/ui/Skeleton/Skeleton';
import type { Category } from '../features/catalog/types/product.types';

const STATIC_CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: 'grid_view' },
  { id: 'electronics', name: 'Electronics', icon: 'devices' },
  { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
  { id: 'home', name: 'Home', icon: 'chair' },
  { id: 'beauty', name: 'Beauty', icon: 'face' },
  { id: 'sports', name: 'Sports', icon: 'sports_soccer' },
  { id: 'kids', name: 'Kids', icon: 'toys' },
];

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
  const { data: productDtos = [], isLoading, isError } = useProducts();

  // useFilters trabaja con ProductResponseDto (tiene `description` para búsqueda)
  const { filters, filtered: filteredDtos, setCategory } = useFilters(productDtos);

  // Mapear a Product (tipo del frontend) solo los registros ya filtrados
  const filtered = React.useMemo(
    () => filteredDtos.map(mapProductDto),
    [filteredDtos]
  );

  // Añade dinámicamente categorías que vengan del backend y no estén en la lista estática
  const categories = React.useMemo(() => {
    const staticIds = new Set(STATIC_CATEGORIES.map((c) => c.id));
    const extra = [...new Set(productDtos.map((p) => p.category))]
      .filter((cat) => !staticIds.has(cat))
      .map((cat) => ({ id: cat, name: cat, icon: 'label' as const }));
    return [...STATIC_CATEGORIES, ...extra];
  }, [productDtos]);

  const flashSaleEndTime = React.useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  }, []);

  const handleSearch = (query: string) => console.log('Search:', query);
  const handleAddToCart = (productId: string) => console.log('Add to cart:', productId);
  const handleFavorite = (productId: string) => console.log('Favorite:', productId);

  return (
    <>
      <Navbar
        user={{ name: 'Ana' }}
        cartItemCount={1}
        onSearch={handleSearch}
        onCartClick={() => console.log('Cart clicked')}
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
