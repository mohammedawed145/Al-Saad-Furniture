import { Seo } from '../../components/Seo';
import { Spinner, ErrorState } from '../../components/States';
import { useFetch } from '../../hooks/useFetch';
import { useLang } from '../../context/LanguageContext';

export function AdminDashboardPage() {
  const { t } = useLang();
  const { data, loading, error, retry } = useFetch('/stats');

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={t.productsPage.error} onRetry={retry} />;

  const cards = [
    [t.admin.statsProducts, data.products],
    [t.admin.statsCategories, data.categories],
    [t.admin.statsBranches, data.branches],
    [t.admin.statsMessages, data.messages],
  ];

  return (
    <div>
      <Seo title={t.admin.dashboard} />
      <h1 className="font-display text-4xl">{t.admin.dashboard}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-3xl bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-stone">{label}</p>
            <p className="mt-3 font-display text-5xl">{value}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-stone">
        {t.admin.newMessages}: {data.unread}
      </p>
    </div>
  );
}
