"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_SRC = "/videos/brand-hero.mp4";
const VIDEO_POSTER = "/images/brand-hero-poster.jpg";

const services = [
  {
    id: "pendaftaran",
    name: "Pendaftaran Merek",
    description: "Validasi & pengajuan resmi sampai terbit sertifikat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/1kLoj8UkXEaJzqpbLhnGQK/78a22bec17ad80746b1b649cbfa7c1b6/tasks.svg",
  },
  {
    id: "perpanjangan",
    name: "Perpanjangan Merek",
    description: "Perpanjang perlindungan merk tanpa melewatkan tenggat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6o4c6qQmBkj73Aze7mxo97/d75cc705830bb23a68e82e51f111ce2b/calendar.svg",
  },
  {
    id: "sertifikat",
    name: "Cetak Sertifikat",
    description: "Sertifikat digital & fisik, siap dikirim.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/3GU8BuwIs7zQ2gq6DODK0E/c0833c2a402a37fc4eb9588275dde294/chat.svg",
  },
];

const heroStats = [
  { label: "Bisnis terbantu", value: "850+", icon: "🏢" },
  { label: "Mentor HKI", value: "30", icon: "👨‍💼" },
  { label: "Rata-rata proses", value: "24 jam", icon: "⚡" },
];

const typeWords = ["lebih cepat", "lebih aman", "lebih transparan", "lebih hemat biaya"];
const TYPE_SPEED = 70;
const PAUSE_AFTER = 1400;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const statsRef = useRef<HTMLUListElement | null>(null);

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 🌀 Auto carousel (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    const interval = window.setInterval(() => {
      setActiveServiceIndex((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isHydrated]);

  // ⌨️ Typewriter effect (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number | undefined;

    const type = () => {
      const word = typeWords[wordIndex];
      setTyped(word.slice(0, charIndex));

      if (!deleting && charIndex < word.length) charIndex++;
      else if (deleting && charIndex > 0) charIndex--;
      else if (!deleting && charIndex === word.length) {
        deleting = true;
        timer = window.setTimeout(type, PAUSE_AFTER);
        return;
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % typeWords.length;
      }

      timer = window.setTimeout(type, deleting ? TYPE_SPEED / 1.8 : TYPE_SPEED);
    };

    timer = window.setTimeout(type, TYPE_SPEED);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isHydrated]);

  // 🎬 GSAP Animations (entrance + floating)
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    const section = sectionRef.current;
    if (!section) return;

    let floatingTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(badgeRef.current, { y: -10, opacity: 0, duration: 0.5, ease: "back.out(1.7)" })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .from(leftRef.current?.querySelectorAll("p, .btn-group") || [], {
          y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out"
        }, "-=0.4")
        .from(statsRef.current?.children || [], {
          y: 20, opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.5, ease: "back.out(1.5)"
        }, "-=0.4")
        .from(rightRef.current, { x: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

      const floatingTarget = rightRef.current;
      if (floatingTarget) {
        floatingTween = gsap.to(floatingTarget, {
          y: -8,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, section);

    return () => {
      ctx.revert();
      floatingTween?.kill();
    };
  }, [isHydrated]);

  // Use this index to render safely both SSR and after hydration
  const currentServiceIndex = isHydrated ? activeServiceIndex : 0;
  const activeService = services[currentServiceIndex];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-background to-background/90">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#DC2626]/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#DC2626]/5 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div ref={leftRef} className="max-w-xl space-y-6">
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626] border border-[#DC2626]/30">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626] animate-pulse" />
              UrusMerek.id — Profesional & Terverifikasi
            </div>

            <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Urus merek anda
            </h1>

            <div className="relative mt-1">
              <span className="text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl font-bold">{typed}</span>
              <span className="ml-1 text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl animate-pulse">▎</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahli kapan saja.
            </p>

            <div className="btn-group flex gap-4 pt-2">
              <a
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek."
                className="rounded-lg bg-[#DC2626] text-white px-6 py-3.5 font-semibold hover:scale-[1.02] shadow-md shadow-[#DC2626]/30 transition-transform"
              >
                Mulai Konsultasi →
              </a>
              <a
                href="#layanan"
                className="rounded-lg border-2 border-[#DC2626]/30 px-6 py-3.5 font-semibold hover:bg-[#DC2626]/5 transition-all"
              >
                Lihat Layanan
              </a>
            </div>

            <ul ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
              {heroStats.map((s) => (
                <li key={s.label} className="rounded-xl border border-border/60 bg-white/60 backdrop-blur-sm p-4 hover:border-[#DC2626]/40 transition-all">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="relative">
            <div ref={cardRef} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/70 shadow-xl bg-black/5">
              <video src={VIDEO_SRC} poster={VIDEO_POSTER} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Overlay Info — USE activeService (fixed) */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 relative flex-shrink-0">
                    <Image src={activeService.icon} alt={activeService.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{activeService.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activeService.description}</p>
                  </div>
                </div>

                {/* Pagination dots -> use currentServiceIndex (safe for SSR/hydration) */}
                <div className="flex justify-center gap-2 mt-4">
                  {services.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === currentServiceIndex ? "bg-[#DC2626]" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles (blinking, float, pulse) */}
      <style jsx>{`
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse-slow { 0%,100%{opacity:.3} 50%{opacity:.6} }
      `}</style>
    </section>
  );
}
