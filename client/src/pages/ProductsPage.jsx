import { useMemo, useState } from 'react';
import { Seo } from '../components/Seo';
import { ProductCard } from '../components/ProductCard';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../context/LanguageContext';

export function ProductsPage() {
  const { t, isAr } = useLang();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data: categories } = useFetch('/categories');
  const params = useMemo(() => ({ search, category }), [search, category]);
  const { data, loading, error, retry } = useFetch('/products', params);
  const products = data || [];

  return (
    <div className="page-wrap py-16">
      <Seo title={t.nav.products} description={t.productsPage.subtitle} />
      <p className="text-xs uppercase tracking-[0.24em] text-gold">{t.nav.products}</p>
      <h1 className="mt-3 font-display text-5xl">{t.productsPage.title}</h1>
      <p className="mt-4 max-w-2xl text-stone">{t.productsPage.subtitle}</p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.productsPage.search}
          className="input lg:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-2 text-sm ${!category ? 'bg-ink text-cream' : 'bg-white text-stone'}`}
          >
            {t.productsPage.all}
          </button>
          {(categories || []).map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setCategory(item._id)}
              className={`rounded-full px-4 py-2 text-sm ${category === item._id ? 'bg-ink text-cream' : 'bg-white text-stone'}`}
            >
              {isAr ? item.nameAr : item.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        {loading && <Spinner label={t.productsPage.loading} />}
        {error && <ErrorState message={t.productsPage.error} onRetry={retry} />}
        {!loading && !error && products.length === 0 && <EmptyState message={t.productsPage.empty} />}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
