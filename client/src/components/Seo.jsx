import { Helmet } from 'react-helmet-async';
import { useLang } from '../context/LanguageContext';

export function Seo({ title, description }) {
  const { t } = useLang();
  const full = title ? `${title} | ${t.brand}` : `${t.brand} | Furniture Showroom`;
  const desc =
    description ||
    'Al-Saad Furniture showroom catalog. Browse furniture and contact the showroom about any product.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://al-saad-furniture.app';
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${siteUrl}/al-saad-logo.jpeg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
}
