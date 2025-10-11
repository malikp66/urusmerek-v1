import { cookies } from "next/headers";

import { DEFAULT_LOCALE, dictionaries, type Locale, type Messages } from "./dictionaries";
import { createTranslator } from "./utils";

export function getLocaleFromRequest(): Locale {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("lang")?.value;

  if (cookieLocale === "en" || cookieLocale === "id") {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}

export function getMessages(locale?: Locale): Messages {
  const safeLocale = locale ?? getLocaleFromRequest();
  return dictionaries[safeLocale] ?? dictionaries[DEFAULT_LOCALE];
}

export function getTranslations(namespace?: string, locale?: Locale) {
  const messages = getMessages(locale);
  return createTranslator(messages, namespace);
}
