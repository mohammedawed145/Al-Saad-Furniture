import { Seo } from '../../components/Seo';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { useFetch } from '../../hooks/useFetch';
import { useLang } from '../../context/LanguageContext';
import { api } from '../../services/api';

const statuses = ['new', 'read', 'contacted', 'closed'];

export function AdminMessagesPage() {
  const { t } = useLang();
  const { data, loading, error, setData, retry } = useFetch('/messages');
  const items = data || [];

  async function updateStatus(id, status) {
    const res = await api.put(`/messages/${id}`, { status });
    setData(items.map((item) => (item._id === id ? res.data : item)));
  }

  async function remove(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      await api.delete(`/messages/${id}`);
      setData(items.filter((item) => item._id !== id));
    } catch {
      window.alert(t.admin.deleteError);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={t.productsPage.error} onRetry={retry} />;

  return (
    <div>
      <Seo title={t.admin.messages} />
      <h1 className="font-display text-4xl">{t.admin.messages}</h1>
      <div className="mt-8 overflow-x-auto rounded-3xl bg-white">
        {items.length === 0 ? (
          <div className="p-8"><EmptyState message={t.admin.noMessages} /></div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-stone">
              <tr>
                <th className="p-4">{t.admin.name}</th>
                <th className="p-4">{t.contact.email}</th>
                <th className="p-4">{t.admin.phone}</th>
                <th className="p-4">{t.admin.message}</th>
                <th className="p-4">{t.admin.product}</th>
                <th className="p-4">{t.admin.date}</th>
                <th className="p-4">{t.admin.status}</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-ink/5 align-top">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4"><a href={`mailto:${item.email}`}>{item.email}</a></td>
                  <td className="p-4"><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                  <td className="max-w-xs p-4 whitespace-pre-wrap">{item.message}</td>
                  <td className="p-4">{item.productName || '—'}</td>
                  <td className="p-4">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <select className="input py-2" value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)}>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button type="button" className="text-red-600" onClick={() => remove(item._id)}>{t.admin.delete}</button>
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
