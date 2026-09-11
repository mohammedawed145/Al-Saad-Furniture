import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!id || document.querySelector(`script[data-ga-id="${id}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.dataset.gaId = id;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
  }, []);

  return null;
}
