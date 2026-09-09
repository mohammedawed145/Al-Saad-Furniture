import axios from 'axios';

const TOKEN_KEY = 'alsaad_admin_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return apiUrl ? `${apiUrl.replace(/\/api\/?$/, '')}${path}` : path;
}

export function whatsappLink(number, text = '') {
  const clean = String(number || '').replace(/[^\d]/g, '');
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${clean}${q}`;
}
