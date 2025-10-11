import id from "./locales/id.json";
import en from "./locales/en.json";

export type Locale = "id" | "en";
export type Messages = typeof id;

export const DEFAULT_LOCALE: Locale = "id";

export const dictionaries: Record<Locale, Messages> = {
  id,
  en,
};
