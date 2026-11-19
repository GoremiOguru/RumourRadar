'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import enDict from '../../locales/en.json';
import pcmDict from '../../locales/pcm.json';

export type AppLanguage = 'en' | 'pcm';

interface LanguageContextType {
  locale: AppLanguage;
  setLocale: (newLocale: AppLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, compact?: boolean) => string;
  formatNumber: (n: number) => string;
  isPidgin: boolean;
  announcement: string;
}

const DICTIONARIES: Record<AppLanguage, Record<string, any>> = {
  en: enDict,
  pcm: pcmDict
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function resolveNestedKey(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({
  children,
  initialLocale = 'en'
}: {
  children: React.ReactNode;
  initialLocale?: AppLanguage;
}) {
  const [locale, setLocaleState] = useState<AppLanguage>(initialLocale);
  const [announcement, setAnnouncement] = useState<string>('');

  // Hydrate from localStorage if set, but default to server-provided initialLocale
  useEffect(() => {
    try {
      const stored = localStorage.getItem('truetalk_locale');
      if (stored === 'pcm' || stored === 'en') {
        if (stored !== locale) {
          setLocaleState(stored);
          document.documentElement.lang = stored;
        }
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const setLocale = useCallback((newLocale: AppLanguage) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('truetalk_locale', newLocale);
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
      }
    } catch {
      // ignore
    }

    const message = newLocale === 'pcm' 
      ? 'Language changed to Naija Pidgin' 
      : 'Language changed to English';
    setAnnouncement(message);
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const activeDict = DICTIONARIES[locale] || DICTIONARIES.en;
    let text = resolveNestedKey(activeDict, key);

    // Fallback to English if missing in pcm
    if (!text && locale === 'pcm') {
      text = resolveNestedKey(DICTIONARIES.en, key);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[i18n] Missing translation key "${key}" in pcm.json, fell back to English`);
      }
    }

    if (!text) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[i18n] Missing translation key "${key}" in both dictionaries`);
      }
      return key;
    }

    // Interpolate variables e.g. {count}, {state}, {name}
    if (vars) {
      for (const [vKey, vVal] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(vVal));
      }
    }

    return text;
  }, [locale]);

  const formatCurrency = useCallback((amount: number, compact = false): string => {
    if (compact) {
      if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `₦${Math.round(amount / 1000)}k`;
      return `₦${amount.toLocaleString('en-NG')}`;
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const formatNumber = useCallback((n: number): string => {
    return new Intl.NumberFormat('en-NG').format(n);
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    formatCurrency,
    formatNumber,
    isPidgin: locale === 'pcm',
    announcement
  }), [locale, setLocale, t, formatCurrency, formatNumber, announcement]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {/* Polite Accessibility Announcer for Screen Readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-language-announcer"
      >
        {announcement}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useTranslations() {
  const { t, locale, isPidgin, formatCurrency, formatNumber } = useLanguage();
  return { t, locale, isPidgin, formatCurrency, formatNumber };
}
