"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const loadingPhrases = [
  "Menganalisis kebutuhan merek",
  "Menyinkronkan berkas dengan DJKI",
  "Menghubungkan konsultan HKI",
  "Mengamankan sertifikat digital",
];

export default function Loading() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [activePhrase, setActivePhrase] = useState(loadingPhrases[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const progressEl = progressRef.current;
      const textEl = textRef.current;
      const dots = gsap.utils.toArray<HTMLElement>(".loading-dot");

      if (dots.length) {
        gsap.to(dots, {
          y: -8,
          opacity: 1,
          duration: 0.65,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.12,
        });
      }

      gsap.fromTo(
        ".loading-ring",
        { opacity: 0.55, scale: 0.92 },
        {
          opacity: 1,
          scale: 1.05,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      if (progressEl) {
        gsap
          .timeline({ repeat: -1 })
          .fromTo(
            progressEl,
            { width: "0%" },
            { width: "100%", duration: 1.8, ease: "power2.inOut" }
          )
          .to(progressEl, { width: "0%", duration: 0.25, ease: "none" });
      }

      if (textEl) {
        const phraseTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });
        loadingPhrases.forEach((phrase) => {
          phraseTimeline.call(() => setActivePhrase(phrase));
          phraseTimeline.fromTo(
            textEl,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
          );
          phraseTimeline.to(textEl, {
            opacity: 0,
            y: -16,
            duration: 0.45,
            ease: "power3.in",
            delay: 1,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fef2f2] via-white to-[#fee2e2] px-6 py-16 text-center text-[#7f1d1d]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="loading-ring absolute -left-24 top-12 h-64 w-64 rounded-full border border-[#fecaca]/60" />
        <div className="loading-ring absolute right-10 bottom-6 h-52 w-52 rounded-full border border-[#fca5a5]/50" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/80 shadow-[0_20px_65px_-38px_rgba(220,38,38,0.65)] backdrop-blur-sm">
          <div className="loading-ring absolute inset-1 rounded-full border border-[#fecaca]/70" />
          <div className="loading-ring absolute inset-0 rounded-full border-t-2 border-[#dc2626]" />
          <div className="relative flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className="loading-dot h-3 w-3 rounded-full bg-[#dc2626]/80 opacity-70"
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-md rounded-full border border-[#fecaca]/70 bg-white/80 p-1 shadow-[0_12px_40px_-28px_rgba(248,113,113,0.6)] backdrop-blur">
          <div ref={progressRef} className="h-2 rounded-full bg-[#dc2626]" />
        </div>

        <p
          ref={textRef}
          className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#dc2626]"
        >
          {activePhrase}
        </p>

        <h1 className="text-3xl font-bold text-[#7f1d1d] sm:text-4xl">
          Sedang menyiapkan pengalaman terbaik
        </h1>
        <p className="max-w-xl text-sm text-[#9f1239] sm:text-base">
          Mohon tunggu sebentar. Kami sedang mengatur dashboard, menyinkronkan data,
          dan memastikan semua layanan urusmerek.id siap dipakai.
        </p>
      </div>
    </div>
  );
}
