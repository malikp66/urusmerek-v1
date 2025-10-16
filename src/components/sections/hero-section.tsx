"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ClipboardCheck,   // Pendaftaran
  CalendarClock,    // Perpanjangan
  Award,            // Cetak Sertifikat
  UserCog,          // Perubahan Nama/Alamat
  Shuffle,          // Pengalihan Hak
  FileWarning,      // Tanggapan Usul/Tolak
  ShieldCheck,      // Surat Keberatan
  FileSignature     // Perjanjian Lisensi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaSkeleton } from "@/components/ui/media-skeleton";
import { useTranslations } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import Link from "next/link";

const VIDEO_SRC = "/gone-banner.mp4";

type ServiceCopy = {
  id: string;
  name: string;
  description: string;
};

type ServiceWithIcon = ServiceCopy & {
  Icon: React.ElementType;
};

const serviceIcons: Record<string, React.ElementType> = {
  pendaftaran: ClipboardCheck,
  perpanjangan: CalendarClock,
  sertifikat: Award,
  perubahan: UserCog,
  pengalihan: Shuffle,
  usulTolak: FileWarning,
  keberatan: ShieldCheck,
  lisensi: FileSignature,
};

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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const tHero = useTranslations("hero");
  const badgeText = tHero<string>("badge");
  const titleText = tHero<string>("title");
  const descriptionText = tHero<string>("description");
  const typeWords = tHero<string[]>("typewriter");
  const heroStats = tHero<{ label: string; value: string }[]>("stats");
  const servicesCopy = tHero<ServiceCopy[]>("services");
  const cta = tHero<{ primary: string; primaryLabel: string; secondary: string }>("cta");
  const serviceItems = useMemo<ServiceWithIcon[]>(
    () =>
      servicesCopy.map((service) => ({
        ...service,
        Icon: serviceIcons[service.id] ?? ClipboardCheck,
      })),
    [servicesCopy]
  );
  const totalServices = serviceItems.length;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 🌀 Auto carousel (only after hydration)
  useEffect(() => {
    if (!isHydrated || totalServices === 0) return;

    const interval = window.setInterval(() => {
      setActiveServiceIndex((prev) => (prev + 1) % totalServices);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isHydrated, totalServices]);

  // ⌨️ Typewriter effect (only after hydration)
  useEffect(() => {
    if (!isHydrated || typeWords.length === 0) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number | undefined;

    const type = () => {
      const word = typeWords[wordIndex];
      setTyped(word.slice(0, charIndex));
      gsap.fromTo("#typedWord", { scale: 0.98 }, { scale: 1, duration: 0.2, ease: "power2.out" });

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
  }, [isHydrated, typeWords]);

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
  const currentServiceIndex = totalServices > 0 ? (isHydrated ? activeServiceIndex % totalServices : 0) : 0;
  const activeService = serviceItems[currentServiceIndex];

  const ActiveIcon = activeService?.Icon ?? ClipboardCheck;

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-10 sm:py-14 lg:py-20">
      {/* 🔧 Glow background: tidak intercept klik */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-12 left-1/4 h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      {/* 🔧 Konten ditaruh di atas */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="mx-auto grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-stretch">
          {/* LEFT */}
          <div ref={leftRef} className="max-w-[44rem] lg:max-w-[40rem] space-y-6">            
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626] border border-[#DC2626]/30">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626] animate-pulse" />
              {badgeText}
            </div>

            <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              {titleText}
            </h1>

            <div className="relative">
              <span id="typedWord" className="text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl font-bold">{typed}</span>
              <span className="ml-1 text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl animate-pulse">▎</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{descriptionText}</p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              {/* Primary */}
              <Button asChild size="lg" className="btn-brand hover:-translate-y-px w-full justify-center sm:w-auto">
                <Link
                  className="group inline-flex items-center justify-center gap-2"
                  href="/konsultasi"
                  aria-label={cta.primaryLabel}
                >
                  {cta.primary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
                </Link>
              </Button>

              {/* Secondary */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="btn-outline-brand hover:-translate-y-px w-full justify-center sm:w-auto"
              >
                <Link className="group inline-flex items-center justify-center gap-2" href="/layanan">
                  {cta.secondary}
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="relative min-w-0 h-full flex items-stretch">
            <div ref={cardRef} className="relative w-full h-full overflow-hidden rounded-2xl border border-border/70 shadow-xl bg-black/5">
              <MediaSkeleton isVisible={!isVideoLoaded} className="rounded-2xl" />
              <video
                src={VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setIsVideoLoaded(true)}
                onCanPlay={() => setIsVideoLoaded(true)}
                onLoadedMetadata={() => setIsVideoLoaded(true)}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-500 ease-out",
                  isVideoLoaded ? "opacity-100" : "opacity-0"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Overlay Info */}
              <div className="absolute inset-x-4 bottom-6 w-auto max-w-full bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl sm:inset-auto sm:left-6 sm:bottom-8 sm:max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex-shrink-0">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{activeService?.name}</h5>
                    <p className="text-sm text-gray-600">{activeService?.description}</p>
                  </div>
                </div>

                {/* Pagination dots tetap */}
                <div className="flex justify-center gap-2 mt-4">
                  {serviceItems.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === currentServiceIndex ? "bg-[#DC2626]" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl h-1 bg-[#DC2626] sm:inset-x-6">
              <div
                key={currentServiceIndex}
                className="h-full bg-white/20"
                style={{ animation: "progress 4s linear forwards" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/80 to-white/60 dark:from-black dark:via-black/80 dark:to-black/60" />

      {/* Inline styles */}
      <style jsx>{`
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse-slow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  );
}
