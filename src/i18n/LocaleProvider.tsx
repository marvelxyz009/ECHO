'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultLocale, dictionaries, supportedLocales, type LocaleCode } from '@/locales';

type TranslationValues = Record<string, string | number> | undefined;

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, values?: TranslationValues) => string;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = 'project-echo-locale';

const resolveLocale = (candidate?: string | null): LocaleCode => {
  if (!candidate) return defaultLocale;
  const normalized = candidate.toLowerCase();
  const matched = supportedLocales.find((locale) => normalized.startsWith(locale));
  return matched ?? defaultLocale;
};

const getNestedValue = (dictionary: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dictionary);
};

const interpolate = (text: string, values?: TranslationValues) => {
  if (!values) return text;
  return Object.entries(values).reduce((acc, [token, value]) => {
    return acc.replace(new RegExp(`{${token}}`, 'g'), String(value));
  }, text);
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<LocaleCode>(defaultLocale);
  const [ready, setReady] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const browserLocale = typeof navigator !== 'undefined' ? navigator.language : undefined;
    const resolved = resolveLocale(stored ?? browserLocale ?? defaultLocale);
    setLocale(resolved);
    setReady(true);
  }, []);

  const updateLocale = useCallback((next: LocaleCode) => {
    setLocale(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const translate = useCallback(
    (key: string, values?: TranslationValues) => {
      const dictionary = dictionaries[locale] ?? dictionaries[defaultLocale];
      const result = getNestedValue(dictionary as Record<string, unknown>, key);
      if (typeof result === 'string') {
        return interpolate(result, values);
      }
      return key;
    },
    [locale],
  );

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: updateLocale,
    t: translate,
    ready,
  }), [locale, ready, translate, updateLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};

