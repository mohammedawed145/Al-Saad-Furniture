import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { mediaUrl } from '../services/api';

export function ProductCard({ product }) {
  const { t, isAr } = useLang();
  const name = isAr ? product.nameAr : product.nameEn;
  const desc = isAr ? product.descriptionAr : product.descriptionEn;
  const category = isAr ? product.category?.nameAr : product.category?.nameEn;
  const image = mediaUrl(product.images?.[0]);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-30px_rgba(28,25,23,0.35)]"
    >
      <Link to={`/products/${product._id}`} className="block overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-gold">{category}</p>
        <h3 className="font-display text-2xl">{name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone">{desc}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to={`/products/${product._id}`} className="btn-outline py-2 text-xs">
            {t.product.view}
          </Link>
          <Link to={`/contact?product=${product._id}`} className="btn-primary py-2 text-xs">
            {t.product.contact}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
