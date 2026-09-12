import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Seo } from '../components/Seo';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Motion';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../context/LanguageContext';

const HERO =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80';

export function HomePage() {
  const { t } = useLang();
  const { data, loading, error, retry } = useFetch('/products', { featured: 'true' });
  const featured = data || [];

  return (
    <>
      <Seo title={t.nav.home} description={t.hero.subtitle} />
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={HERO} alt={t.brand} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />
        <div className="page-wrap relative flex min-h-[88vh] items-center py-24">
          <div className="max-w-2xl text-cream">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs uppercase tracking-[0.28em] text-sand"
            >
              {t.hero.kicker}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-5xl leading-tight sm:text-7xl"
            >
              {t.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-lg text-lg text-cream/80"
            >
              {t.hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn-gold">
                {t.hero.explore}
              </Link>
              <Link to="/contact" className="btn-outline border-cream bg-cream text-ink shadow-lg hover:border-gold hover:bg-gold hover:text-ink">
                {t.hero.contact}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-wrap py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">{t.featured.title}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t.featured.title}</h2>
          <p className="mt-3 max-w-xl text-stone">{t.featured.subtitle}</p>
        </Reveal>
        <div className="mt-12">
          {loading && <Spinner label={t.productsPage.loading} />}
          {error && <ErrorState message={t.productsPage.error} onRetry={retry} />}
          {!loading && !error && featured.length === 0 && <EmptyState message={t.productsPage.empty} />}
          {!loading && !error && featured.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
