import { useState } from 'react';
import { Seo } from '../../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { useFetch } from '../../hooks/useFetch';
import { useLang } from '../../context/LanguageContext';
import { api } from '../../services/api';

const blank = {
  nameEn: '',
  nameAr: '',
  addressEn: '',
  addressAr: '',
  phone: '',
  whatsapp: '',
  email: '',
  openingHoursEn: '',
  openingHoursAr: '',
  googleMapsUrl: '',
};

export function AdminBranchesPage() {
  const { t } = useLang();
  const { data, loading, error, setData, retry } = useFetch('/branches');
  const items = data || [];
  const [form, setForm] = useState(blank);
  const [id, setId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      const res = id ? await api.put(`/branches/${id}`, form) : await api.post('/branches', form);
      setData(id ? items.map((item) => (item._id === id ? res.data : item)) : [...items, res.data]);
      setForm(blank);
      setId(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save branch');
    } finally {
      setBusy(false);
    }
  }

  async function remove(itemId) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      await api.delete(`/branches/${itemId}`);
      setData(items.filter((item) => item._id !== itemId));
    } catch {
      window.alert(t.admin.deleteError);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={t.branches.error} onRetry={retry} />;

  const fields = [
    ['nameEn', 'Branch Name EN'],
    ['nameAr', 'Branch Name AR'],
    ['addressEn', 'Address EN'],
    ['addressAr', 'Address AR'],
    ['phone', 'Phone'],
    ['whatsapp', 'WhatsApp'],
    ['email', 'Email'],
    ['openingHoursEn', 'Opening Hours EN'],
    ['openingHoursAr', 'Opening Hours AR'],
    ['googleMapsUrl', 'Google Maps URL'],
  ];

  return (
    <div>
      <Seo title={t.admin.branches} />
      <h1 className="font-display text-4xl">{t.admin.branches}</h1>
      <form onSubmit={save} className="mt-8 grid gap-4 rounded-3xl bg-white p-6 md:grid-cols-2">
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        {formError && <p className="text-sm text-red-600 md:col-span-2">{formError}</p>}
        <div className="flex gap-2 md:col-span-2">
          <button className="btn-primary" disabled={busy}>{t.admin.save}</button>
          {id && (
            <button type="button" className="btn-outline" onClick={() => { setId(null); setForm(blank); }}>
              {t.admin.cancel}
            </button>
          )}
        </div>
      </form>
      <div className="mt-8 space-y-3">
        {items.length === 0 && <EmptyState message={t.branches.empty} />}
        {items.map((item) => (
          <article key={item._id} className="rounded-3xl bg-white p-5">
            <h2 className="font-medium">{item.nameEn}</h2>
            <p className="text-sm text-stone">{item.addressEn}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button type="button" className="text-gold" onClick={() => { setId(item._id); setForm({ ...blank, ...item }); }}>{t.admin.edit}</button>
              <button type="button" className="text-red-600" onClick={() => remove(item._id)}>{t.admin.delete}</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
