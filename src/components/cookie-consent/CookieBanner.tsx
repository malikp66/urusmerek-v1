"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useConsent } from "./useConsent";
import { Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";

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

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  // Motion — slide up on mount, gentle pulse on primary CTA
  useEffect(() => {
    if (!isReady || !isBannerOpen || !wrapRef.current || !cardRef.current) return;

    // Respect prefers-reduced-motion
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      gsap.fromTo(
        cardRef.current,
        { y: 32, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.5,
        }
      );

      // CTA micro attention after a short delay
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 0 },
          {
            keyframes: [
              { y: -3, duration: 0.08 },
              { y: 0, duration: 0.12 },
              { y: -2, duration: 0.06 },
              { y: 0, duration: 0.12 },
            ],
            delay: 0.9,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isReady, isBannerOpen]);

  if (!isReady || !isBannerOpen) return null;

  return (
    <div
      ref={wrapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
      data-testid="cookie-banner"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/20 via-background/0 to-transparent blur-2xl" />

      <div
        ref={cardRef}
        className="relative w-full max-w-4xl rounded-b-2xl border border-border/60 bg-background/80 text-foreground shadow-[0_8px_40px_-12px_rgba(0,0,0,.25)] backdrop-blur-xl"
      >
        {/* Gradient top-edge accent */}
        <div className="absolute inset-x-0 -top-px h-0.5 rounded-2xl bg-gradient-to-r from-primary via-rose-500/60 to-primary/80" />

        <div className="p-4 pt-6 pr-9 sm:p-6 sm:pt-8 sm:pr-11">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: Icon + Copy */}
            <div className="flex flex-1 items-start gap-3">
              {/* Icon stack */}
              <div className="relative mt-0.5">
                <div className="grid place-items-center size-10 rounded-xl bg-primary/10 ring-1 ring-primary/30">
                  <Cookie className="size-5 text-primary" aria-hidden="true" />
                </div>
                <ShieldCheck
                  className="absolute -right-1 -bottom-1 size-4 text-emerald-500"
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h2 id={titleId} className="text-base sm:text-lg font-semibold tracking-tight">
                  Izin Cookie
                </h2>
                <p id={descriptionId} className="text-sm text-muted-foreground">
                  Kami menggunakan cookie untuk fungsi esensial, analitik, dan pemasaran. Anda dapat
                  menyesuaikan pilihan, menolak yang non-esensial, atau menerima semua cookie. Baca{" "}
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
            </div>

            {/* Right: Actions */}
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
                <SlidersHorizontal className="mr-2 size-4" aria-hidden="true" />
                Sesuaikan
              </Button>

              <BannerDivider />

              <Button
                ref={ctaRef}
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Terima semua
              </Button>
            </div>
          </div>

          {/* Bottom add-on: “Why we use cookies” quick list */}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              • Esensial untuk login & keamanan.
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              • Analitik untuk meningkatkan pengalaman.
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              • Pemasaran agar konten lebih relevan.
            </div>
          </div>
        </div>

        {/* Subtle close affordance (optional) */}
        <button
          onClick={rejectNonEssential}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Tutup banner cookies"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
