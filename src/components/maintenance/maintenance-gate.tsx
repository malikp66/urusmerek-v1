"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function MaintenanceGate() {
  const wrapRef = useRef<HTMLDivElement | null>(null); // parent for perspective
  const cardRef = useRef<HTMLDivElement | null>(null); // the tilting card
  const glowRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const card = cardRef.current!;
    const glow = glowRef.current!;
    const spot = spotRef.current!;

    // baseline
    gsap.set(card, {
      transformStyle: "preserve-3d",
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      willChange: "transform, filter",
      boxShadow: "0 20px 45px -28px rgba(15,23,42,0.35)",
      filter: "drop-shadow(0 0 0 rgba(239,68,68,0))",
    });
    gsap.set(glow, { opacity: 0.4, scale: 1, filter: "blur(32px)" });
    gsap.set(spot, { opacity: 0, xPercent: -50, yPercent: -50 });

    // hover in/out di CARD (bukan wrapper)
    const onEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.015,
        boxShadow: "0 30px 65px -30px rgba(59,130,246,0.45)",
        filter: "drop-shadow(0 0 26px rgba(239,68,68,0.35))",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(glow, { opacity: 0.85, scale: 1.06, duration: 0.45, ease: "power3.out" });
      gsap.to(spot, { opacity: 0.85, duration: 0.3, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        boxShadow: "0 20px 45px -28px rgba(15,23,42,0.35)",
        filter: "drop-shadow(0 0 0 rgba(239,68,68,0))",
        duration: 0.5,
        ease: "power3.inOut",
      });
      gsap.to(glow, { opacity: 0.4, scale: 1, duration: 0.5, ease: "power3.inOut" });
      gsap.to(spot, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
    };

    // tilt + spotlight follow
    const qx = gsap.quickTo(card, "rotateX", { duration: 0.2, ease: "power2.out" });
    const qy = gsap.quickTo(card, "rotateY", { duration: 0.2, ease: "power2.out" });
    const qxSpot = gsap.quickTo(spot, "x", { duration: 0.12, ease: "power2.out" });
    const qySpot = gsap.quickTo(spot, "y", { duration: 0.12, ease: "power2.out" });
    const max = 8; // derajat

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      qy(gsap.utils.clamp(-max, max, nx * max));     // kiri/kanan
      qx(gsap.utils.clamp(-max, max, -ny * max));    // atas/bawah
      qxSpot(e.clientX - rect.left);
      qySpot(e.clientY - rect.top);
    };

    // attach ke CARD (bukan wrapper)
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-white to-[#fff5f5] px-2 py-6">
      <div className="relative w-full max-w-6xl">
        {/* DESKTOP */}
        <div ref={wrapRef} className="relative hidden w-full md:block" style={{ perspective: "1200px" }}>
          <div
            ref={cardRef}
            className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-slate-200/70 bg-white/0 backdrop-blur-xl transition-all"
          >
            <Image
              src="/banner.png"
              alt="UrusMerek.id — Mitra Terpercaya Pengurusan Merek Anda"
              width={1280}
              height={720}
              priority
              sizes="(min-width: 1280px) 1120px, (min-width: 1024px) 88vw, (min-width: 768px) 90vw, 100vw"
              className="h-auto w-full rounded-3xl select-none"
              draggable={false}
            />

            {/* radial background glows */}
            <span
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 25% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.22), transparent 48%)",
              }}
            />

            {/* spotlight follower */}
            <div
              ref={spotRef}
              className="pointer-events-none absolute h-[38%] w-[32%] rounded-[40%] bg-white/12 blur-2xl mix-blend-overlay"
            />
          </div>
        </div>

        {/* MOBILE (tanpa tilt) */}
        <div className="relative w-full md:hidden">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/0 backdrop-blur-xl">
            <Image
              src="/banner-mobile.png"
              alt="UrusMerek.id — Mitra Terpercaya Pengurusan Merek Anda"
              width={1024}
              height={1280}
              priority
              sizes="(max-width: 767px) 92vw, 100vw"
              className="h-auto w-full rounded-[32px]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 25% 20%, rgba(239,68,68,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.22), transparent 48%)",
              }}
            />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_3s_linear_infinite]" />
        </div>
      </div>

    </div>
  );
}
