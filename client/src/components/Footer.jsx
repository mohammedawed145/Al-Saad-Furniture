import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useFetch } from '../hooks/useFetch';
import { whatsappLink } from '../services/api';
import logo from '../assets/al-saad-logo.jpeg';

export function Footer() {
  const { t, isAr } = useLang();
  const { data: branches } = useFetch('/branches');
  const branch = branches?.[0];
  const phone = branch?.phone || '[Phone]';
  const email = branch?.email || 'info@alsaad.local';
  const address = isAr ? branch?.addressAr : branch?.addressEn;

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/products', label: t.nav.products },
    { to: '/about', label: t.nav.about },
    { to: '/branches', label: t.nav.branches },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-cream">
      <div className="page-wrap grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt={t.brand} className="h-14 w-14 rounded-full object-cover" />
            <p className="font-display text-3xl">{t.brand}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">{t.footer.tagline}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-sand">{t.footer.quick}</h2>
          <ul className="mt-5 space-y-2 text-sm text-cream/80">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-sand">{t.footer.contact}</h2>
          <ul className="mt-5 space-y-2 text-sm text-cream/80">
            <li>
              {t.contact.phone}:{' '}
              {String(phone).startsWith('[') ? (
                phone
              ) : (
                <a href={`tel:${phone}`} className="hover:text-cream">
                  {phone}
                </a>
              )}
            </li>
            <li>
              {t.contact.email}:{' '}
              <a href={`mailto:${email}`} className="hover:text-cream">
                {email}
              </a>
            </li>
            <li>
              {t.contact.ourAddress}: {address || '[Address]'}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-sand">{t.footer.social}</h2>
          <div className="mt-5 flex gap-3">
            <a href="https://www.facebook.com/share/1CAqAk8cbq/" target="_blank" rel="noreferrer" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/asaadfurniture19?stkn=M29sbWwzajY3M3Z6" target="_blank" rel="noreferrer" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@saadhamza058?_r=1&_t=ZS-99afuPVJHwD"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cream/20 p-2 hover:bg-cream/10"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
                <path d="M15.5 3c.3 1.8 1.3 3.1 3.2 3.7v2.5c-1.2-.1-2.3-.5-3.2-1.1v6.1a5.3 5.3 0 1 1-4.6-5.2v2.7a2.6 2.6 0 1 0 1.9 2.5V3h2.7Z" />
              </svg>
            </a>
            <a
              href={whatsappLink(branch?.whatsapp || '00000000000')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cream/20 p-2 hover:bg-cream/10"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
                <path d="M12 3a8.7 8.7 0 0 0-7.5 13.1L3 21l5-1.4A8.7 8.7 0 1 0 12 3Zm0 15.7a7 7 0 0 1-3.6-1l-.3-.2-3 .8.8-2.9-.2-.3A7 7 0 1 1 12 18.7Zm3.9-5.2c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.4.1-.1.2-.5.7-.6.8-.1.1-.2.1-.4 0a5.7 5.7 0 0 1-1.7-1.1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.4-.4h-.4c-.1 0-.4.1-.5.2-.2.2-.7.7-.7 1.7s.7 2 1 2.2c.1.2 1.4 2.2 3.4 3 .5.2.9.3 1.2.4.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">{t.footer.rights}</div>
    </footer>
  );
}
