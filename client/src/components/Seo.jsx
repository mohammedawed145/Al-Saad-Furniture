import { Helmet } from 'react-helmet-async';
import { useLang } from '../context/LanguageContext';

export function Seo({ title, description }) {
  const { t, lang } = useLang();
  const full = title ? `${title} | ${t.brand}` : `${t.brand} | Furniture Showroom`;
  const desc = description || (lang === 'ar'
    ? 'موبليات السعد للأثاث: تصفح غرف النوم والانتريهات والسفر والأثاث المنزلي وتواصل مع المعرض.'
    : 'Al-Saad Furniture showroom catalog. Browse furniture and contact the showroom about any product.');
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://al-saad-furniture-three.vercel.app';
  const pageUrl = `${siteUrl}${window.location.pathname}`;
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'موبليات السعد',
    brand: {
      '@type': 'Brand',
      name: 'موبليات السعد',
    },
    alternateName: 'Al-Saad Furniture',
    url: siteUrl,
    logo: `${siteUrl}/al-saad-logo.jpeg`,
    description: desc,
    areaServed: 'Egypt',
  };
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={desc} />
      <meta name="application-name" content="موبليات السعد" />
      <meta property="og:site_name" content="موبليات السعد" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${siteUrl}/al-saad-logo.jpeg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={pageUrl} />
      <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
    </Helmet>
  );
}
