import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Sofa, Tags, MapPin, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export function AdminLayout() {
  const { admin, ready, logout } = useAuth();
  const { t } = useLang();

  if (!ready) return <div className="p-10">{t.common.loading}</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: t.admin.dashboard, end: true },
    { to: '/admin/products', icon: Sofa, label: t.admin.products },
    { to: '/admin/categories', icon: Tags, label: t.admin.categories },
    { to: '/admin/branches', icon: MapPin, label: t.admin.branches },
    { to: '/admin/messages', icon: Mail, label: t.admin.messages },
  ];

  return (
    <div className="min-h-screen bg-linen lg:flex">
      <aside className="border-b border-ink/10 bg-ink p-6 text-cream lg:w-64 lg:border-b-0 lg:border-e">
        <p className="font-display text-2xl">{t.brand}</p>
        <p className="mt-1 text-xs text-cream/50">{admin.email}</p>
        <nav className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-cream/10 text-cream' : 'text-cream/70 hover:text-cream'}`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={logout} className="mt-8 flex items-center gap-2 text-sm text-cream/60 hover:text-cream">
          <LogOut className="h-4 w-4" />
          {t.admin.logout}
        </button>
      </aside>
      <div className="flex-1 p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
