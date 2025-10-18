import { cookies } from "next/headers";

// Cookie name used across the application.
export const CONSENT_COOKIE_NAME = "um_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Types ----------------------------------------------------------------------
export type ConsentCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional?: boolean;
};

export const DEFAULT_CONSENT: ConsentCategories = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const ensureEssential = (
  consent: Omit<ConsentCategories, "essential"> & { essential?: boolean }
): ConsentCategories => ({
  ...DEFAULT_CONSENT,
  ...consent,
  essential: true,
});

const isValidConsent = (value: unknown): value is ConsentCategories => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.essential !== true) return false;
  const analytics = typeof candidate.analytics === "boolean";
  const marketing = typeof candidate.marketing === "boolean";
  const functional =
    typeof candidate.functional === "boolean" ||
    typeof candidate.functional === "undefined";
  return analytics && marketing && functional;
};

// Server utilities -----------------------------------------------------------
export const getServerConsent = (): ConsentCategories | null => {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    return isValidConsent(parsed) ? ensureEssential(parsed) : null;
  } catch {
    return null;
  }
};

// Client utilities -----------------------------------------------------------
export const getClientConsent = (): ConsentCategories | null => {
  if (typeof document === "undefined") return null;
  const cookieString = document.cookie || "";
  const match = cookieString
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!match) return null;
  const raw = match.split("=")[1];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return isValidConsent(parsed) ? ensureEssential(parsed) : null;
  } catch {
    return null;
  }
};

export const setClientConsent = (consent: ConsentCategories): void => {
  if (typeof document === "undefined") return;
  const normalized = ensureEssential(consent);
  const encoded = encodeURIComponent(JSON.stringify(normalized));
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
};

export const hasConsent = (): boolean => getClientConsent() !== null;

export const mergeConsent = (
  consent: ConsentCategories,
  updates: Partial<ConsentCategories>
): ConsentCategories =>
  ensureEssential({
    ...consent,
    ...updates,
  });
