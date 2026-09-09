import { Helmet } from 'react-helmet-async';
import { useLang } from '../context/LanguageContext';

export function Seo({ title, description }) {
  const { t } = useLang();
  const full = title ? `${title} | ${t.brand}` : `${t.brand} | Furniture Showroom`;
  const desc =
    description ||
    'Al-Saad Furniture showroom catalog. Browse furniture and contact the showroom about any product.';
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
