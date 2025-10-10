"use client";

import React from "react";
import { I18nProvider } from "@/lib/i18n/context";
import { GlobalAlertProvider } from "@/components/global-alert/GlobalAlertProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <GlobalAlertProvider>{children}</GlobalAlertProvider>
    </I18nProvider>
  );
}
