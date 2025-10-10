"use client";

import React from "react";

import { DEFAULT_LOCALE, dictionaries, type Locale, type Messages } from "./dictionaries";
import { createTranslator } from "./utils";

const STORAGE_KEY = "lang";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
}

const I18nContext = React.createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  messages: dictionaries[DEFAULT_LOCALE],
  setLocale: () => {},
});

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);
  const [messages, setMessages] = React.useState<Messages>(dictionaries[initialLocale]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (localStorage.getItem(STORAGE_KEY) || readCookie(STORAGE_KEY)) as Locale | null;
    if (stored === "id" || stored === "en") {
      setLocaleState(stored);
      setMessages(dictionaries[stored]);
    }
  }, []);

  const persistLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    setMessages(dictionaries[next]);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // ignore persistence errors
    }
  }, []);

  const value = React.useMemo(
    () => ({
      locale,
      messages,
      setLocale: persistLocale,
    }),
    [locale, messages, persistLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}

export function useTranslations(namespace?: string) {
  const { messages } = useI18n();
  return React.useCallback(createTranslator(messages, namespace), [messages, namespace]);
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
