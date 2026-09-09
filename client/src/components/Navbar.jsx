import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import logo from '../assets/al-saad-logo.jpeg';

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-2 text-xs tracking-wide">
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={lang === 'ar' ? 'font-semibold text-ink' : 'text-stone hover:text-ink'}
      >
        العربية
      </button>
      <span className="text-ink/30">|</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={lang === 'en' ? 'font-semibold text-ink' : 'text-stone hover:text-ink'}
      >
        English
      </button>
    </div>
  );
}

export function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/products', label: t.nav.products },
    { to: '/about', label: t.nav.about },
    { to: '/branches', label: t.nav.branches },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
      <div className="page-wrap flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 font-display text-2xl tracking-wide text-ink">
          <img src={logo} alt={t.brand} className="h-12 w-12 rounded-full object-cover" />
          <span>{t.brand}</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm tracking-wide transition ${isActive ? 'text-ink' : 'text-stone hover:text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <LangSwitch />
          <Link to="/contact" className="btn-primary py-2.5 text-xs uppercase tracking-[0.14em]">
            {t.nav.contact}
          </Link>
        </div>
        <button
          type="button"
          className="rounded-full border border-ink/10 p-2 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label={t.common.menu}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: location.pathname.startsWith('/') ? 40 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="absolute inset-y-0 end-0 w-[86%] max-w-sm bg-cream p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="flex items-center gap-3 font-display text-2xl">
                  <img src={logo} alt={t.brand} className="h-12 w-12 rounded-full object-cover" />
                  {t.brand}
                </span>
                <button type="button" onClick={() => setOpen(false)} aria-label={t.common.close}>
                  <X />
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-lg text-ink">
                    {link.label}
                  </NavLink>
                ))}
                <LangSwitch />
                <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-4">
                  {t.nav.contact}
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
