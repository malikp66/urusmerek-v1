"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

const tips = [
  "Periksa kembali ejaan URL",
  "Gunakan menu navigasi di atas",
  "Kembali ke beranda untuk mulai lagi",
  "Cari halaman yang Anda butuhkan",
];

export default function NotFound() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef1 = useRef<HTMLDivElement | null>(null);
  const ringRef2 = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<SVGSVGElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [active, setActive] = useState(tips[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to([ringRef1.current, ringRef2.current], {
        opacity: 1,
        scale: 1.04,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          y: -6,
          duration: 1.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
      if (textRef.current) {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });
        tips.forEach((t) => {
          tl.call(() => setActive(t))
            .fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" })
            .to(textRef.current, { opacity: 0, y: -10, duration: 0.38, ease: "power3.in", delay: 1 });
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-slate-800"
    >
      {/* background geometry */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div ref={ringRef1} className="absolute -left-24 top-16 h-64 w-64 rounded-full border border-slate-200" />
        <div ref={ringRef2} className="absolute right-10 bottom-10 h-52 w-52 rounded-full border border-slate-200" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* icon */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-white/80 shadow-[0_20px_65px_-38px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <svg ref={iconRef} width="68" height="68" viewBox="0 0 68 68" aria-hidden>
            <defs>
              <linearGradient id="g404" x1="0" x2="1">
                <stop offset="0" stopColor="#ef4444" />
                <stop offset="1" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <path d="M34 10c8 0 14 6.2 14 14.2C48 35 34 50 34 50S20 35 20 24.2C20 16.2 26 10 34 10z" fill="url(#g404)" opacity="0.95" />
            <circle cx="34" cy="24" r="5.5" fill="white" />
            <circle cx="46" cy="42" r="8" fill="none" stroke="#ef4444" strokeWidth="3" />
            <rect x="52.5" y="48.5" width="10" height="3.2" rx="1.6" transform="rotate(40 52.5 48.5)" fill="#ef4444" />
          </svg>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest text-red-700">404</span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Halaman tidak ditemukan</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
            Maaf, kami tidak menemukan halaman yang Anda cari. Kembali ke beranda atau jelajahi menu layanan kami.
          </p>
        </div>

        <p ref={textRef} className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-700">
          {active}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-lg bg-red-600 px-5 py-2.5 text-white shadow hover:brightness-110">
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
