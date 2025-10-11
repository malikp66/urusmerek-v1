"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { SafeImage } from "@/components/ui/safe-image";

export default function MaintenanceGate() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current!;
    const glow = glowRef.current!;

    // baseline (no tilt)
    gsap.set(card, {
      y: 0,
      scale: 1,
      willChange: "filter",
      boxShadow: "0 20px 45px -28px rgba(15,23,42,0.30)",
      filter: "drop-shadow(0 0 0 rgba(239,68,68,0))",
    });
    gsap.set(glow, { opacity: 0, scale: 1, filter: "blur(36px)" });

    const onEnter = () => {
      gsap.to(glow, { opacity: 0.9, duration: 0.35, ease: "power2.out" });
      gsap.to(card, {
        filter: "drop-shadow(0 0 24px rgba(239,68,68,0.45))",
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(glow, { opacity: 0, duration: 0.45, ease: "power2.inOut" });
      gsap.to(card, {
        filter: "drop-shadow(0 0 0 rgba(239,68,68,0))",
        duration: 0.45,
        ease: "power2.inOut",
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-white to-[#fff5f5] px-2 py-6">
      <div className="relative w-full max-w-6xl">
        {/* DESKTOP */}
        <div className="relative hidden w-full md:block">
          <div
            ref={cardRef}
            className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-slate-200/70 bg-white/0 backdrop-blur-xl transition-all"
          >
            <SafeImage
              src="/banner.png"
              alt="UrusMerek.id — Mitra Terpercaya Pengurusan Merek Anda"
              width={1280}
              height={720}
              priority
              sizes="(min-width: 1280px) 1120px, (min-width: 1024px) 88vw, (min-width: 768px) 90vw, 100vw"
              className="h-auto w-full rounded-3xl select-none"
              skeletonClassName="rounded-3xl"
              draggable={false}
            />

            {/* red glow background (aktif saat hover) */}
            <span
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
              style={{
                background:
                  // dua radial merah untuk kedalaman
                  "radial-gradient(60% 50% at 50% 50%, rgba(239,68,68,0.35), transparent 60%), radial-gradient(40% 35% at 80% 20%, rgba(248,113,113,0.28), transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* MOBILE (tanpa animasi) */}
        <div className="relative w-full md:hidden">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/0 backdrop-blur-xl">
            <SafeImage
              src="/banner-mobile.png"
              alt="UrusMerek.id — Mitra Terpercaya Pengurusan Merek Anda"
              width={1024}
              height={1280}
              priority
              sizes="(max-width: 767px) 92vw, 100vw"
              className="h-auto w-full rounded-[32px]"
              skeletonClassName="rounded-[32px]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 50%, rgba(239,68,68,0.22), transparent 60%), radial-gradient(40% 35% at 80% 20%, rgba(248,113,113,0.18), transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* optional shine strip */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_3s_linear_infinite]" />
        </div>
      </div>
    </div>
  );
}
