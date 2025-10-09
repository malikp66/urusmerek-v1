"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "@/lib/i18n/context";

type Locale = "id" | "en";

export function LangSwitcher({
  initialLocale = "id",
  className,
  onChange,
}: {
  initialLocale?: Locale;
  className?: string;
  onChange?: (locale: Locale) => void;
}) {
  const { locale: contextLocale, setLocale } = useLocale();
  const label = useTranslations("navigation")<string>("langSwitcherLabel");
  const [locale, setInternalLocale] = React.useState<Locale>(contextLocale ?? initialLocale);

  React.useEffect(() => {
    setInternalLocale(contextLocale ?? initialLocale);
  }, [contextLocale, initialLocale]);

  function select(next: Locale) {
    setInternalLocale(next);
    setLocale(next);
    onChange?.(next);
  }

  const segBase =
    "h-8 px-2.5 rounded-full inline-flex items-center gap-2 text-xs font-medium transition";
  const segActive =
    "text-white bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)] border border-white/20 " +
    "shadow-[inset_0_-1px_0_rgba(0,0,0,.06),0_6px_14px_-6px_rgba(220,38,38,.45)]";
  const segGhost =
    "text-foreground/80 hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white p-1",
        "border border-black/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
        className
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-pressed={locale === "id"}
        onClick={() => select("id")}
        className={cn(segBase, locale === "id" ? segActive : segGhost)}
      >
        <FlagID className="h-4 w-4 rounded-full" />
        <span>ID</span>
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => select("en")}
        className={cn(segBase, locale === "en" ? segActive : segGhost)}
      >
        <FlagUS className="h-4 w-4 rounded-full" />
        <span>EN</span>
      </button>
    </div>
  );
}

/* === Simple SVG Flags (clean) === */
// Indonesia: merah (atas) – putih (bawah) / bulat
function FlagID({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <clipPath id="r">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#r)">
        <rect width="32" height="16" y="0" fill="#E11D48" />
        <rect width="32" height="16" y="16" fill="#ffffff" />
      </g>
    </svg>
  );
}

// USA: sederhana, bersih, cukup representatif
function FlagUS({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <clipPath id="c">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#c)">
        <rect width="32" height="32" fill="#B91C1C" />
        {/* stripes */}
        {[...Array(6)].map((_, i) => (
          <rect key={i} y={i * 6 + 3} width="32" height="3" fill="#ffffff" />
        ))}
        {/* canton */}
        <rect width="14" height="10" x="0" y="0" fill="#1F2A44" />
        {/* dots as stars */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={2 + (i % 4) * 3.5}
            cy={2 + Math.floor(i / 4) * 3
            }
            r="0.4"
            fill="#ffffff"
          />
        ))}
      </g>
    </svg>
  );
}
