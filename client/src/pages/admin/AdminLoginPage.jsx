import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { Seo } from '../../components/Seo';

export function AdminLoginPage() {
  const { admin, ready, login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (ready && admin) return <Navigate to="/admin" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <Seo title={t.admin.login} />
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{t.brand}</p>
        <h1 className="mt-3 font-display text-4xl">{t.admin.login}</h1>
        <label className="label mt-8" htmlFor="email">
          {t.admin.email}
        </label>
        <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label mt-4" htmlFor="password">
          {t.admin.password}
        </label>
        <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary mt-6 w-full" disabled={busy}>
          {t.admin.signIn}
        </button>
      </form>
    </div>
  );
}
