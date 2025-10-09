"use client";

import React from "react";
import id from "./locales/id.json";
import en from "./locales/en.json";

export type Locale = "id" | "en";
export type Messages = typeof id;

const dictionaries: Record<Locale, Messages> = {
  id,
  en,
};

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
  locale: "id",
  messages: dictionaries.id,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("id");
  const [messages, setMessages] = React.useState<Messages>(dictionaries.id);

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

function getPath(messages: Messages, path: string | undefined) {
  if (!path) return messages;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      // @ts-expect-error -- dynamic access
      return acc[key];
    }
    return undefined;
  }, messages);
}

export function useTranslations(namespace?: string) {
  const { messages } = useI18n();
  return React.useCallback(
    <T = string>(key?: string) => {
      const fullPath = [namespace, key].filter(Boolean).join(".");
      const value = getPath(messages, key ? fullPath : namespace);
      return (value ?? key ?? namespace) as T;
    },
    [messages, namespace]
  );
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
