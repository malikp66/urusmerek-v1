"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const phrases = [
  "Terjadi gangguan pada server",
  "Mengembalikan sesi Anda",
  "Memulihkan koneksi",
  "Memastikan data tetap aman",
];

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef1 = useRef<HTMLDivElement | null>(null);
  const ringRef2 = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [active, setActive] = useState(phrases[0]);
  const [detail, setDetail] = useState(false);

  const tryAgain = () => {
    // Pilihan 1: soft refresh + reset (kadang cukup jika errornya bukan fatal)
    router.refresh();
    startTransition(() => reset());
  };

  // ---- Atau ----
  const hardReload = () => {
    window.location.reload(); // paling aman untuk global error
  };

  useEffect(() => {
    console.error(error);

    const ctx = gsap.context(() => {
      // subtle background pulses
      gsap.to([ringRef1.current, ringRef2.current], {
        opacity: 1,
        scale: 1.04,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });

      // progress bar loop
      if (barRef.current) {
        gsap.timeline({ repeat: -1 })
          .fromTo(barRef.current, { width: "0%" }, { width: "100%", duration: 1.8, ease: "power2.inOut" })
          .to(barRef.current, { width: "0%", duration: 0.25, ease: "none" });
      }

      // rotating phrases
      if (textRef.current) {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });
        phrases.forEach((p) => {
          tl.call(() => setActive(p))
            .fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" })
            .to(textRef.current, { opacity: 0, y: -10, duration: 0.38, ease: "power3.in", delay: 1 });
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [error]);

  return (
    <html>
      <body>
        <div
          ref={rootRef}
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-slate-800"
        >
          {/* subtle geometry */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div ref={ringRef1} className="absolute -left-24 top-16 h-64 w-64 rounded-full border border-slate-200" />
            <div ref={ringRef2} className="absolute right-10 bottom-10 h-52 w-52 rounded-full border border-slate-200" />
          </div>

          <div className="relative flex flex-col items-center gap-8">
            {/* professional error icon (shield + exclamation) */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-white/80 shadow-[0_20px_65px_-38px_rgba(15,23,42,0.35)] backdrop-blur-sm">
              <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
                <defs>
                  <linearGradient id="grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#ef4444" />
                    <stop offset="1" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
                <path
                  d="M32 6l18 6v12c0 12-8.6 20.9-18 26-9.4-5.1-18-14-18-26V12l18-6z"
                  fill="url(#grad)"
                  opacity="0.95"
                />
                <rect x="30" y="20" width="4" height="18" rx="2" fill="white" />
                <rect x="30" y="42" width="4" height="4" rx="2" fill="white" />
              </svg>
            </div>

            {/* progress */}
            <div className="w-full max-w-md rounded-full border border-slate-200 bg-white/80 p-1 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.25)] backdrop-blur">
              <div ref={barRef} className="h-2 rounded-full bg-red-600" />
            </div>

            <p ref={textRef} className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-700">
              {active}
            </p>

            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Terjadi kesalahan
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Kami sedang menstabilkan layanan. Silakan muat ulang halaman atau kembali ke beranda.
              Jika berlanjut, kirim detail error kepada tim kami.
            </p>

            {/* actions */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={hardReload} // atau onClick={tryAgain}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-white shadow hover:brightness-110"
              >
                Coba Lagi
              </Button>
              <Button
                variant="outline"
              >
                <Link
                  href="/"
                >
                  Ke Beranda
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setDetail((s) => !s)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-slate-800 hover:bg-slate-50"
              >
                {detail ? "Sembunyikan Detail" : "Lihat Detail"}
              </Button>
            </div>

            {detail && (
              <div className="mt-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-800">
                <p className="font-medium">Pesan:</p>
                <pre className="mb-2 overflow-auto rounded-lg bg-slate-50 p-3">{error.message}</pre>
                {error.digest && (
                  <>
                    <p className="font-medium">Kode (digest):</p>
                    <pre className="mb-2 overflow-auto rounded-lg bg-slate-50 p-3">{error.digest}</pre>
                  </>
                )}
                {error.stack && (
                  <>
                    <p className="font-medium">Stack trace:</p>
                    <pre className="overflow-auto rounded-lg bg-slate-50 p-3">{error.stack}</pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
