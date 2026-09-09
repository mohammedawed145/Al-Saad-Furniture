import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = dict.lang;
    document.documentElement.dir = dict.dir;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const value = useMemo(() => {
    const t = translations[lang] || translations.en;
    return {
      lang,
      setLang,
      t,
      dir: t.dir,
      isAr: lang === 'ar',
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
