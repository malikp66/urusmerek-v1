import { cookies } from "next/headers";

import { DEFAULT_LOCALE, dictionaries, type Locale, type Messages } from "./dictionaries";
import { createTranslator } from "./utils";

export async function getLocaleFromRequest(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("lang")?.value;

  if (cookieLocale === "en" || cookieLocale === "id") {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}

export async function getMessages(locale?: Locale): Promise<Messages> {
  const safeLocale = locale ?? (await getLocaleFromRequest());
  return dictionaries[safeLocale] ?? dictionaries[DEFAULT_LOCALE];
}

export async function getTranslations(namespace?: string, locale?: Locale) {
  const messages = await getMessages(locale);
  return createTranslator(messages, namespace);
}
