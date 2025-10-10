"use client";

import React from "react";

import { GlobalAlertProvider } from "@/components/global-alert/GlobalAlertProvider";
import { I18nProvider } from "@/lib/i18n/context";

export default function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: "id" | "en";
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <GlobalAlertProvider>{children}</GlobalAlertProvider>
    </I18nProvider>
  );
}
