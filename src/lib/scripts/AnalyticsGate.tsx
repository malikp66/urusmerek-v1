"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { useConsent } from "@/components/cookie-consent/useConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsGateProps = {
  gaId: string;
};

export function AnalyticsGate({ gaId }: AnalyticsGateProps) {
  const { consent, isReady } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isReady || !consent.analytics || typeof window === "undefined") {
      return;
    }

    if (typeof window.gtag === "function") {
      const search = searchParams?.toString();
      const pagePath = search ? `${pathname}?${search}` : pathname;
      window.gtag("config", gaId, {
        page_path: pagePath,
      });
    }
  }, [consent.analytics, gaId, isReady, pathname, searchParams]);

  if (!gaId || !isReady || !consent.analytics) {
    return null;
  }

  return (
    <>
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

export default AnalyticsGate;
