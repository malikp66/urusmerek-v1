// src/components/cookie-consent/consent-utils.ts
// ❌ remove: import { cookies } from "next/headers";

export const CONSENT_COOKIE_NAME = "um_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

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

// ------- Server utilities (safe to import from client files) -------
export const getServerConsent = async (): Promise<ConsentCategories | null> => {
  // If somehow called on the client, just bail.
  if (typeof window !== "undefined") return null;

  // ✅ Defer server-only import so the client bundle never sees it.
  const { cookies } = await import("next/headers");
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    return isValidConsent(parsed) ? ensureEssential(parsed) : null;
  } catch {
    return null;
  }
};

// ------- Client utilities -------
export const getClientConsent = (): ConsentCategories | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${CONSENT_COOKIE_NAME}=`));
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
): ConsentCategories => ensureEssential({ ...consent, ...updates });
