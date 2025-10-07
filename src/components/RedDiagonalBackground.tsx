"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * RedDiagonalBackground
 * - Multi-layer diagonal red gradients + soft-glass ribbons
 * - Ultra subtle motion for web hero (no banding, no harsh edges)
 *
 * Props:
 *  className?: extra classes for the wrapper
 *  intensity?: 0..1 (default 1) to scale motion distance
 */
export default function RedDiagonalBackground({
  className = "",
  intensity = 1,
}: { className?: string; intensity?: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Respect reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      // very subtle continuous drifts on each layer
      layersRef.current.forEach((el, i) => {
        const depth = (i + 1) / layersRef.current.length; // 0..1
        const amp = gsap.utils.mapRange(0, 1, 4, 16, depth) * intensity; // px
        const dur = gsap.utils.mapRange(0, 1, 10, 22, depth); // s

        gsap.to(el, {
          x: `+=${amp}`,
          y: `-=${amp * 0.6}`,
          rotate: `${i % 2 === 0 ? -0.2 : 0.2}`,
          duration: dur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // slow global parallax on the whole group
      gsap.to(wrap, {
        backgroundPosition: "2% 0%",
        duration: 30,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, wrap);

    return () => ctx.revert();
  }, [intensity]);

  // util untuk reference tiap layer
  const bind = (i: number) => (el: HTMLDivElement | null) => {
    if (el) layersRef.current[i] = el;
  };

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none z-0 absolute inset-0 overflow-hidden ${className}`}
      // base diagonal sweep (top-left lighter -> bottom-right darker)
      style={{
        background:
          "linear-gradient(32deg, #DC2626 0%, #B91C1C 55%, #7F1D1D 100%)",
      }}
    >
      {/* soft vignette to avoid banding */}
      <div className="absolute inset-0"
           style={{
             WebkitMaskImage:
               "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0) 100%)",
             maskImage:
               "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0) 100%)",
           }}
      />

      {/* LAYER 1 — wide soft ribbon */}
      <div
        ref={bind(0)}
        className="absolute -right-[10%] -top-[25%] h-[60%] w-[70%] rotate-[-18deg] rounded-[48px] blur-[30px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
          mixBlendMode: "overlay",
          opacity: 0.35,
        }}
      />

      {/* LAYER 2 — darker diagonal plane */}
      <div
        ref={bind(1)}
        className="absolute right-[-20%] top-[10%] h-[85%] w-[90%] rotate-[-24deg] rounded-[56px] blur-[26px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.12), rgba(0,0,0,0.28))",
          opacity: 0.25,
        }}
      />

      {/* LAYER 3 — light sweep highlight */}
      <div
        ref={bind(2)}
        className="absolute left-[-15%] bottom-[-10%] h-[55%] w-[70%] rotate-[16deg] rounded-[42px] blur-[36px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02))",
          opacity: 0.25,
        }}
      />

      {/* LAYER 4 — soft shadow at BR */}
      <div
        ref={bind(3)}
        className="absolute right-[-10%] bottom-[-20%] h-[70%] w-[60%] rotate-[-12deg] rounded-[48px] blur-[40px]"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.0))",
          opacity: 0.35,
        }}
      />

      {/* LEFT clean negative space guide (optional, very subtle) */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[55%]"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.04), transparent)" }}
      />
    </div>
  );
}
