import { useMemo, useState } from 'react';
import { Seo } from '../../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { useFetch } from '../../hooks/useFetch';
import { useLang } from '../../context/LanguageContext';
import { api, mediaUrl } from '../../services/api';

const blank = {
  nameEn: '',
  nameAr: '',
  category: '',
  descriptionEn: '',
  descriptionAr: '',
  featuresEn: '',
  featuresAr: '',
  featured: false,
};

export function AdminProductsPage() {
  const { t, isAr } = useLang();
  const { data, loading, error, setData, retry } = useFetch('/products');
  const { data: categories } = useFetch('/categories');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const products = data || [];
  const cats = categories || [];

  const title = useMemo(() => (editing ? t.admin.edit : t.admin.add), [editing, t.admin]);

  function openCreate() {
    setEditing('new');
    setForm({ ...blank, category: cats[0]?._id || '' });
    setExistingImages([]);
    setFiles([]);
    setPreviews([]);
    setFormError('');
  }

  function openEdit(product) {
    setEditing(product._id);
    setForm({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      category: product.category?._id || product.category,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      featuresEn: (product.featuresEn || []).join('\n'),
      featuresAr: (product.featuresAr || []).join('\n'),
      featured: Boolean(product.featured),
    });
    setExistingImages(product.images || []);
    setFiles([]);
    setPreviews([]);
    setFormError('');
  }

  function onFiles(e) {
    const next = Array.from(e.target.files || []);
    const tooBig = next.find((file) => file.size > 5 * 1024 * 1024);
    if (tooBig) {
      setFormError('Each image must be 5MB or smaller.');
      return;
    }
    setFiles(next);
    setPreviews(next.map((file) => URL.createObjectURL(file)));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append('existingImages', JSON.stringify(existingImages));
      files.forEach((file) => body.append('images', file));
      const res = editing === 'new'
        ? await api.post('/products', body)
        : await api.put(`/products/${editing}`, body);
      if (editing === 'new') setData([res.data, ...products]);
      else setData(products.map((item) => (item._id === editing ? res.data : item)));
      setEditing(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save product');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      await api.delete(`/products/${id}`);
      setData(products.filter((item) => item._id !== id));
    } catch {
      window.alert(t.admin.deleteError);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={t.productsPage.error} onRetry={retry} />;

  return (
    <div>
      <Seo title={t.admin.products} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">{t.admin.products}</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>
          {t.admin.add}
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-8 space-y-4 rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl">{title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name EN" value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} />
            <Field label="Name AR" value={form.nameAr} onChange={(v) => setForm({ ...form, nameAr: v })} />
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {cats.map((item) => (
                  <option key={item._id} value={item._id}>
                    {isAr ? item.nameAr : item.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              {t.admin.featured}
            </label>
            <Area label="Description EN" value={form.descriptionEn} onChange={(v) => setForm({ ...form, descriptionEn: v })} />
            <Area label="Description AR" value={form.descriptionAr} onChange={(v) => setForm({ ...form, descriptionAr: v })} />
            <Area label="Features EN (one per line)" value={form.featuresEn} onChange={(v) => setForm({ ...form, featuresEn: v })} />
            <Area label="Features AR (one per line)" value={form.featuresAr} onChange={(v) => setForm({ ...form, featuresAr: v })} />
          </div>
          <div>
            <label className="label">{t.admin.images}</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {existingImages.map((image) => (
                <div key={image} className="relative">
                  <img src={mediaUrl(image)} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <button type="button" className="absolute -end-1 -top-1 rounded-full bg-ink px-1 text-xs text-cream" onClick={() => setExistingImages(existingImages.filter((item) => item !== image))}>
                    ×
                  </button>
                </div>
              ))}
              {previews.map((image) => (
                <img key={image} src={image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              ))}
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onFiles} />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" disabled={busy}>{t.admin.save}</button>
            <button type="button" className="btn-outline" onClick={() => setEditing(null)}>{t.admin.cancel}</button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-x-auto rounded-3xl bg-white">
        {products.length === 0 ? (
          <div className="p-8"><EmptyState message={t.productsPage.empty} /></div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-stone">
              <tr>
                <th className="p-4">EN</th>
                <th className="p-4">AR</th>
                <th className="p-4">Category</th>
                <th className="p-4">{t.admin.featured}</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-ink/5">
                  <td className="p-4">{product.nameEn}</td>
                  <td className="p-4">{product.nameAr}</td>
                  <td className="p-4">{isAr ? product.category?.nameAr : product.category?.nameEn}</td>
                  <td className="p-4">{product.featured ? t.admin.yes : t.admin.no}</td>
                  <td className="p-4">
                    <button type="button" className="me-3 text-gold" onClick={() => openEdit(product)}>{t.admin.edit}</button>
                    <button type="button" className="text-red-600" onClick={() => remove(product._id)}>{t.admin.delete}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="input" rows="4" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
