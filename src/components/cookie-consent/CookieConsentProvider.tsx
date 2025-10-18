"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ConsentCategories } from "./consent-utils";
import {
  DEFAULT_CONSENT,
  getClientConsent,
  mergeConsent,
  setClientConsent,
} from "./consent-utils";

// Catatan: Pengaturan consent ini bukan nasihat hukum. Pastikan kebijakan privasi
// dan teksnya telah disetujui oleh tim legal internal Anda.

// Konteks untuk menyimpan status persetujuan cookie di sisi klien.
type CookieConsentContextValue = {
  consent: ConsentCategories;
  draftConsent: ConsentCategories;
  isReady: boolean;
  isBannerOpen: boolean;
  isPreferencesOpen: boolean;
  openBanner: () => void;
  closeBanner: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  setDraftConsent: (
    value:
      | ConsentCategories
      | ((prev: ConsentCategories) => ConsentCategories)
  ) => void;
  saveConsent: (value?: ConsentCategories) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export const CookieConsentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CONSENT);
  const [draftConsent, setDraftConsent] = useState<ConsentCategories>(
    DEFAULT_CONSENT
  );
  const [isReady, setIsReady] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const existing = getClientConsent();
    if (existing) {
      setConsent(existing);
      setDraftConsent(existing);
      setIsBannerOpen(false);
      setIsReady(true);
      return;
    }

    const dntEnabled =
      typeof navigator !== "undefined" &&
      (navigator.doNotTrack === "1" ||
        // @ts-expect-error - beberapa browser menggunakan properti berbeda
        window.doNotTrack === "1");

    const initial = mergeConsent(DEFAULT_CONSENT, {
      analytics: false,
      marketing: false,
      functional:
        typeof DEFAULT_CONSENT.functional === "boolean"
          ? false
          : undefined,
    });

    setConsent(initial);
    setDraftConsent(initial);

    // DNT akan membuat kategori non-esensial default ke false.
    if (dntEnabled) {
      setDraftConsent(initial);
    }

    setIsBannerOpen(true);
    setIsReady(true);
  }, []);

  const closeBanner = useCallback(() => {
    setIsBannerOpen(false);
  }, []);

  const openBanner = useCallback(() => {
    setIsBannerOpen(true);
  }, []);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
    setIsBannerOpen(false);
    setDraftConsent(consent);
  }, [consent]);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
    setDraftConsent(consent);
  }, [consent]);

  const persistConsent = useCallback(
    (next: ConsentCategories) => {
      const normalized = mergeConsent(DEFAULT_CONSENT, next);
      setConsent(normalized);
      setDraftConsent(normalized);
      setClientConsent(normalized);
      setIsPreferencesOpen(false);
      setIsBannerOpen(false);
    },
    []
  );

  const saveConsent = useCallback(
    (value?: ConsentCategories) => {
      persistConsent(value ?? draftConsent);
    },
    [draftConsent, persistConsent]
  );

  const acceptAll = useCallback(() => {
    const next = mergeConsent(draftConsent, {
      analytics: true,
      marketing: true,
      functional:
        typeof draftConsent.functional === "boolean"
          ? true
          : draftConsent.functional,
    });
    persistConsent(next);
  }, [draftConsent, persistConsent]);

  const rejectNonEssential = useCallback(() => {
    const next = mergeConsent(draftConsent, {
      analytics: false,
      marketing: false,
      functional:
        typeof draftConsent.functional === "boolean"
          ? false
          : draftConsent.functional,
    });
    persistConsent(next);
  }, [draftConsent, persistConsent]);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      draftConsent,
      isReady,
      isBannerOpen,
      isPreferencesOpen,
      openBanner,
      closeBanner,
      openPreferences,
      closePreferences,
      setDraftConsent: (value) => {
        setDraftConsent((prev) => {
          const nextValue =
            typeof value === "function"
              ? (value as (prev: ConsentCategories) => ConsentCategories)(prev)
              : value;
          return mergeConsent(DEFAULT_CONSENT, nextValue);
        });
      },
      saveConsent,
      acceptAll,
      rejectNonEssential,
    }),
    [
      consent,
      draftConsent,
      isReady,
      isBannerOpen,
      isPreferencesOpen,
      openBanner,
      closeBanner,
      openPreferences,
      closePreferences,
      saveConsent,
      acceptAll,
      rejectNonEssential,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsentContext = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsentContext must be used within a CookieConsentProvider"
    );
  }

  return context;
};

export default CookieConsentProvider;
