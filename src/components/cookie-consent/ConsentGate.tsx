"use client";

import type { ReactNode } from "react";

import { useConsent } from "./useConsent";

type ConsentGateProps = {
  needed: "analytics" | "marketing" | "functional";
  children: ReactNode;
  fallback?: ReactNode;
};

export function ConsentGate({ needed, children, fallback = null }: ConsentGateProps) {
  const { consent, isReady } = useConsent();

  if (!isReady) {
    return fallback ?? null;
  }

  const granted = needed === "functional"
    ? Boolean(consent.functional)
    : consent[needed];

  if (!granted) {
    return fallback ?? null;
  }

  return <>{children}</>;
}

export default ConsentGate;
