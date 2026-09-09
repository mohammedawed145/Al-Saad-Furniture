import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Seo } from '../components/Seo';
import { ErrorState } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../context/LanguageContext';
import { api, whatsappLink } from '../services/api';

const empty = { name: '', email: '', phone: '', message: '' };

export function ContactPage() {
  const { t, isAr } = useLang();
  const [params] = useSearchParams();
  const productId = params.get('product') || '';
  const { data: product } = useFetch(productId ? `/products/${productId}` : null);
  const { data: branches, error: branchesError, retry: retryBranches } = useFetch('/branches');
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const productName = useMemo(() => {
    if (!product) return '';
    return isAr ? product.nameAr : product.nameEn;
  }, [product, isAr]);

  useEffect(() => {
    if (!productName) return;
    setForm((prev) => {
      if (prev.message.includes(product.nameEn) || prev.message.includes(product.nameAr)) return prev;
      const prefix = `${t.product.interested}: ${productName}`;
      return { ...prev, message: prev.message ? prev.message : `${prefix}\n\n` };
    });
  }, [productName, product, t.product.interested]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = t.contact.required;
    if (!form.email.trim()) next.email = t.contact.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t.contact.invalidEmail;
    if (!form.phone.trim()) next.phone = t.contact.required;
    if (!form.message.trim()) next.message = t.contact.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/messages', {
        ...form,
        productId: product?._id || undefined,
        productName: productName || undefined,
      });
      setForm(empty);
      setStatus({ type: 'ok', text: t.contact.success });
    } catch {
      setStatus({ type: 'err', text: t.contact.error });
    } finally {
      setSending(false);
    }
  }

  const primary = branches?.[0];

  return (
    <div className="page-wrap py-16">
      <Seo title={t.nav.contact} description={t.contact.subtitle} />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">{t.contact.title}</p>
          <h1 className="mt-3 font-display text-5xl">{t.contact.title}</h1>
          <p className="mt-4 text-stone">{t.contact.subtitle}</p>
          <form onSubmit={onSubmit} className="mt-10 space-y-4" noValidate>
            {productName && (
              <div className="rounded-2xl bg-linen px-4 py-3 text-sm">
                <span className="text-xs uppercase tracking-[0.16em] text-stone">{t.contact.product}</span>
                <p className="mt-1 font-medium">{productName}</p>
              </div>
            )}
            <div>
              <label className="label" htmlFor="name">
                {t.contact.name} *
              </label>
              <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="label" htmlFor="email">
                {t.contact.email} *
              </label>
              <input id="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="label" htmlFor="phone">
                {t.contact.phone} *
              </label>
              <input id="phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label className="label" htmlFor="message">
                {t.contact.message} *
              </label>
              <textarea id="message" rows="6" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>
            {status.text && (
              <p className={status.type === 'ok' ? 'text-sm text-emerald-700' : 'text-sm text-red-600'}>{status.text}</p>
            )}
            <button type="submit" disabled={sending} className="btn-primary">
              {sending ? t.contact.sending : t.contact.send}
            </button>
          </form>
        </div>
        <aside className="rounded-[2rem] bg-ink p-8 text-cream sm:p-10">
          <h2 className="font-display text-4xl">{t.contact.infoTitle}</h2>
          <h3 className="mt-10 text-xs uppercase tracking-[0.2em] text-sand">{t.contact.ourAddress}</h3>
          <ul className="mt-4 space-y-4 text-sm text-cream/80">
            {branchesError && <ErrorState message={t.branches.error} onRetry={retryBranches} />}
            {(branches || []).map((branch) => (
              <li key={branch._id} className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  <strong className="block text-cream">{isAr ? branch.nameAr : branch.nameEn}</strong>
                  {isAr ? branch.addressAr : branch.addressEn}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xs uppercase tracking-[0.2em] text-sand">{t.contact.contactInfo}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" />
              {t.contact.phone}:{' '}
              {primary && !String(primary.phone).startsWith('[') ? (
                <a href={`tel:${primary.phone}`}>{primary.phone}</a>
              ) : (
                primary?.phone || '[Phone]'
              )}
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold">WA</span>
              {t.contact.whatsapp}:{' '}
              <a href={whatsappLink(primary?.whatsapp || '00000000000', productName ? `${t.product.interested}: ${productName}` : '')} target="_blank" rel="noreferrer">
                {primary?.whatsapp || '[WhatsApp]'}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gold" />
              {t.contact.ourAddress}: {isAr ? primary?.addressAr : primary?.addressEn}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" />
              {t.contact.email}:{' '}
              <a href={`mailto:${primary?.email || 'info@alsaad.local'}`}>{primary?.email || 'info@alsaad.local'}</a>
            </li>
          </ul>
          <h3 className="mt-10 text-xs uppercase tracking-[0.2em] text-sand">{t.contact.social}</h3>
          <div className="mt-4 flex gap-3">
            <a href="https://www.facebook.com/share/1CAqAk8cbq/" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/asaadfurniture19?stkn=M29sbWwzajY3M3Z6" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com/@saadhamza058?_r=1&_t=ZS-99afuPVJHwD" target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10">
              <span className="text-xs font-semibold">♪</span>
            </a>
            <a href={whatsappLink(primary?.whatsapp || '00000000000')} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-cream/20 p-2 hover:bg-cream/10">
              <span className="text-xs font-semibold">WA</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
