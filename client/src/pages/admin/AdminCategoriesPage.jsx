import { useState } from 'react';
import { Seo } from '../../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { useFetch } from '../../hooks/useFetch';
import { useLang } from '../../context/LanguageContext';
import { api, mediaUrl } from '../../services/api';

export function AdminCategoriesPage() {
  const { t } = useLang();
  const { data, loading, error, setData, retry } = useFetch('/categories');
  const items = data || [];
  const [form, setForm] = useState({ nameEn: '', nameAr: '', id: null });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      const body = new FormData();
      body.append('nameEn', form.nameEn);
      body.append('nameAr', form.nameAr);
      if (file) body.append('image', file);
      const res = form.id
        ? await api.put(`/categories/${form.id}`, body)
        : await api.post('/categories', body);
      setData(form.id ? items.map((item) => (item._id === form.id ? res.data : item)) : [...items, res.data]);
      setForm({ nameEn: '', nameAr: '', id: null });
      setFile(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save category');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      await api.delete(`/categories/${id}`);
      setData(items.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || t.admin.deleteError);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={t.productsPage.error} onRetry={retry} />;

  return (
    <div>
      <Seo title={t.admin.categories} />
      <h1 className="font-display text-4xl">{t.admin.categories}</h1>
      <form onSubmit={save} className="mt-8 grid gap-4 rounded-3xl bg-white p-6 md:grid-cols-2">
        <div>
          <label className="label">Name EN</label>
          <input className="input" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </div>
        <div>
          <label className="label">Name AR</label>
          <input className="input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Image</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        {formError && <p className="text-sm text-red-600 md:col-span-2">{formError}</p>}
        <div className="flex gap-2 md:col-span-2">
          <button className="btn-primary" disabled={busy}>{t.admin.save}</button>
          {form.id && (
            <button type="button" className="btn-outline" onClick={() => setForm({ nameEn: '', nameAr: '', id: null })}>
              {t.admin.cancel}
            </button>
          )}
        </div>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.length === 0 && <EmptyState message={t.admin.noCategories} />}
        {items.map((item) => (
          <article key={item._id} className="flex gap-4 rounded-3xl bg-white p-4">
            {item.image && <img src={mediaUrl(item.image)} alt="" className="h-20 w-20 rounded-2xl object-cover" />}
            <div className="flex-1">
              <p>{item.nameEn}</p>
              <p className="text-stone">{item.nameAr}</p>
              <div className="mt-2 flex gap-3 text-sm">
                <button type="button" className="text-gold" onClick={() => setForm({ nameEn: item.nameEn, nameAr: item.nameAr, id: item._id })}>{t.admin.edit}</button>
                <button type="button" className="text-red-600" onClick={() => remove(item._id)}>{t.admin.delete}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
