import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import logo from '../assets/al-saad-logo.jpeg';

function LangSwitch({ dark = false }) {
  const { lang, setLang } = useLang();
  const activeClass = dark ? 'font-semibold text-cream' : 'font-semibold text-ink';
  const idleClass = dark ? 'text-cream/65 hover:text-cream' : 'text-stone hover:text-ink';

  return (
    <div className="flex items-center gap-2 text-xs tracking-wide">
      <button type="button" onClick={() => setLang('ar')} className={lang === 'ar' ? activeClass : idleClass}>
        العربية
      </button>
      <span className={dark ? 'text-cream/30' : 'text-ink/30'}>|</span>
      <button type="button" onClick={() => setLang('en')} className={lang === 'en' ? activeClass : idleClass}>
        English
      </button>
    </div>
  );
}

export function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
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
          className="rounded-full border border-ink bg-ink p-2 text-cream shadow-md lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={t.common.menu}
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-20 z-[60] border-b border-gold/25 bg-ink px-5 py-6 text-cream shadow-2xl lg:hidden">
          <nav className="mx-auto flex max-w-md flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-base transition ${
                    isActive ? 'bg-cream/10 text-gold' : 'text-cream/90 hover:bg-cream/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-cream/15 pt-5">
              <LangSwitch dark />
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary px-5 py-2.5 text-xs">
                {t.nav.contact}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
