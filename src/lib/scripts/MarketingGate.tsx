"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { useConsent } from "@/components/cookie-consent/useConsent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MarketingGateProps = {
  pixelId?: string;
};

export function MarketingGate({ pixelId }: MarketingGateProps) {
  const { consent, isReady } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isReady || !consent.marketing || typeof window === "undefined") {
      return;
    }

    if (typeof window.fbq === "function") {
      const search = searchParams?.toString();
      const pagePath = search ? `${pathname}?${search}` : pathname;
      window.fbq("track", "PageView", { page_path: pagePath });
    }
  }, [consent.marketing, isReady, pathname, searchParams]);

  if (!isReady || !consent.marketing || !pixelId) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export default MarketingGate;
