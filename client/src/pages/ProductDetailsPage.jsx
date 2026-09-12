import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../context/LanguageContext';
import { mediaUrl } from '../services/api';

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { t, isAr } = useLang();
  const { data: product, loading, error } = useFetch(`/products/${id}`);
  const [active, setActive] = useState(0);

  if (loading) return <Spinner label={t.productsPage.loading} />;
  if (error) return <div className="page-wrap py-16"><ErrorState message={t.productsPage.error} /></div>;
  if (!product) return <div className="page-wrap py-16"><EmptyState message={t.productsPage.empty} /></div>;

  const name = (isAr ? product.nameAr : product.nameEn) || product.name || 'Furniture piece';
  const desc = (isAr ? product.descriptionAr : product.descriptionEn) || product.description || '';
  const features = isAr ? product.featuresAr : product.featuresEn;
  const category = isAr ? product.category?.nameAr : product.category?.nameEn;
  const images = product.images?.length ? product.images : [''];
  const current = mediaUrl(images[active] || images[0]);

  return (
    <div className="page-wrap py-16">
      <Seo title={name} description={desc} />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[2rem] bg-white">
            <img
              src={current}
              alt={name}
              className="h-[520px] w-full object-cover transition duration-500"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`overflow-hidden rounded-2xl border ${active === index ? 'border-ink' : 'border-transparent'}`}
                >
                  <img
                    src={mediaUrl(image)}
                    alt=""
                    className="h-24 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {t.product.category}: {category}
          </p>
          <h1 className="mt-4 font-display text-5xl">{name}</h1>
          <h2 className="mt-10 text-sm uppercase tracking-[0.18em] text-stone">{t.product.description}</h2>
          <p className="mt-3 leading-relaxed text-stone">{desc}</p>
          {features?.length > 0 && (
            <>
              <h2 className="mt-10 text-sm uppercase tracking-[0.18em] text-stone">{t.product.features}</h2>
              <ul className="mt-4 space-y-2 text-ink">
                {features.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link to={`/contact?product=${product._id}`} className="btn-primary mt-10">
            {t.product.enquire}
          </Link>
        </div>
      </div>
    </div>
  );
}
