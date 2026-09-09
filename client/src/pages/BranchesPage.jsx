import { Clock, MapPin, Phone } from 'lucide-react';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../context/LanguageContext';

export function BranchesPage() {
  const { t, isAr } = useLang();
  const { data, loading, error, retry } = useFetch('/branches');
  const branches = data || [];

  return (
    <div className="page-wrap py-16">
      <Seo title={t.nav.branches} description={t.branches.subtitle} />
      <p className="text-xs uppercase tracking-[0.24em] text-gold">{t.nav.branches}</p>
      <h1 className="mt-3 font-display text-5xl">{t.branches.title}</h1>
      <p className="mt-4 max-w-2xl text-stone">{t.branches.subtitle}</p>
      <div className="mt-12">
        {loading && <Spinner label={t.branches.loading} />}
        {error && <ErrorState message={t.branches.error} onRetry={retry} />}
        {!loading && !error && branches.length === 0 && <EmptyState message={t.branches.empty} />}
        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-3">
            {branches.map((branch) => {
              const name = isAr ? branch.nameAr : branch.nameEn;
              const address = isAr ? branch.addressAr : branch.addressEn;
              const hours = isAr ? branch.openingHoursAr : branch.openingHoursEn;
              const tel = String(branch.phone || '').startsWith('[') ? null : branch.phone;
              return (
                <article key={branch._id} className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_-32px_rgba(28,25,23,0.4)]">
                  <h2 className="font-display text-2xl">{name}</h2>
                  <p className="mt-6 flex gap-3 text-sm text-stone">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="block text-ink">{t.branches.address}</strong>
                      {address}
                    </span>
                  </p>
                  <p className="mt-4 flex gap-3 text-sm text-stone">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="block text-ink">{t.branches.phone}</strong>
                      {tel ? <a href={`tel:${tel}`}>{branch.phone}</a> : branch.phone}
                    </span>
                  </p>
                  <p className="mt-4 flex gap-3 text-sm text-stone">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="block text-ink">{t.branches.hours}</strong>
                      {hours}
                    </span>
                  </p>
                  {branch.googleMapsUrl && (
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline mt-8 py-2 text-xs"
                    >
                      {t.branches.maps}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
