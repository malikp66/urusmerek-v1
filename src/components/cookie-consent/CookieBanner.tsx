"use client";

import Link from "next/link";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useConsent } from "./useConsent";

const PRIVACY_POLICY_URL = "/privacy-policy";

const BannerDivider = () => (
  <Separator className="hidden h-6 sm:block" orientation="vertical" />
);

export function CookieBanner() {
  const {
    isBannerOpen,
    isReady,
    acceptAll,
    rejectNonEssential,
    openPreferences,
  } = useConsent();

  const titleId = useId();
  const descriptionId = useId();

  if (!isReady || !isBannerOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="bg-background text-foreground shadow-lg ring-1 ring-border w-full max-w-4xl rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <h2 id={titleId} className="text-lg font-semibold">
              Izin Cookie
            </h2>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              Kami menggunakan cookie untuk fungsi esensial, analitik, dan pemasaran. Atur preferensi Anda atau terima semua cookie. Baca {" "}
              <Link
                href={PRIVACY_POLICY_URL}
                className="font-medium text-primary underline underline-offset-4"
              >
                Kebijakan Privasi
              </Link>
              .
            </p>
            <p className="sr-only">
              Pengaturan ini bukan nasihat hukum. Silakan hubungi tim legal Anda untuk detail kebijakan privasi.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={rejectNonEssential}
              className="w-full sm:w-auto"
            >
              Tolak non-esensial
            </Button>
            <BannerDivider />
            <Button
              variant="secondary"
              onClick={openPreferences}
              className="w-full sm:w-auto"
            >
              Sesuaikan
            </Button>
            <BannerDivider />
            <Button onClick={acceptAll} className="w-full sm:w-auto">
              Terima semua
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
