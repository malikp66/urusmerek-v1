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

  // typewriter state
  const [typed, setTyped] = useState("");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const typingTimerRef = useRef<number | null>(null);
  const deletingRef = useRef(false);

  useEffect(() => {
    const run = () => {
      const current = typeWords[wordIndexRef.current % typeWords.length];
      if (!deletingRef.current) {
        if (charIndexRef.current <= current.length) {
          setTyped(current.slice(0, charIndexRef.current));
          charIndexRef.current += 1;
          typingTimerRef.current = window.setTimeout(run, TYPE_SPEED);
        } else {
          typingTimerRef.current = window.setTimeout(() => {
            deletingRef.current = true;
            charIndexRef.current = current.length - 1;
            run();
          }, PAUSE_AFTER);
        }
      } else {
        if (charIndexRef.current >= 0) {
          setTyped(current.slice(0, charIndexRef.current));
          charIndexRef.current -= 1;
          typingTimerRef.current = window.setTimeout(run, TYPE_SPEED / 1.8);
        } else {
          deletingRef.current = false;
          wordIndexRef.current = (wordIndexRef.current + 1) % typeWords.length;
          charIndexRef.current = 0;
          typingTimerRef.current = window.setTimeout(run, 300);
        }
      }
    };

    run();
    return () => {
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Staggered entrance animations
      tl.from(badgeRef.current, { 
        y: -10, 
        opacity: 0, 
        duration: 0.5, 
        ease: "back.out(1.7)" 
      })
      .from(titleRef.current, { 
        y: 30, 
        opacity: 0, 
        duration: 0.7, 
        ease: "power3.out" 
      }, "-=0.3")
      .from(leftRef.current?.querySelectorAll("p, .btn-group") || [], { 
        y: 20, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.4")
      .from(statsRef.current?.children || [], { 
        y: 20, 
        opacity: 0, 
        scale: 0.95,
        stagger: 0.08, 
        duration: 0.5, 
        ease: "back.out(1.5)" 
      }, "-=0.4")
      .from(rightRef.current, { 
        x: 40, 
        opacity: 0, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.6");

      // Floating animation for video card
      gsap.to(rightRef.current, {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Pulse animation for badge dot
      gsap.to(badgeRef.current?.querySelector(".pulse-dot"), {
        scale: 1.3,
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3D tilt effect on video card
      const card = cardRef.current;
      if (card) {
        const mm = gsap.matchMedia();
        mm.add("(pointer: fine)", () => {
          const handle = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - (r.left + r.width / 2)) / r.width;
            const py = (e.clientY - (r.top + r.height / 2)) / r.height;
            gsap.to(card, { 
              rotationY: px * 8, 
              rotationX: -py * 6, 
              transformPerspective: 1000, 
              transformOrigin: "center", 
              duration: 0.4, 
              ease: "power2.out" 
            });
          };
          const reset = () => {
            gsap.to(card, { 
              rotationX: 0, 
              rotationY: 0, 
              duration: 0.6, 
              ease: "power2.out" 
            });
          };
          card.addEventListener("mousemove", handle);
          card.addEventListener("mouseleave", reset);
          return () => {
            card.removeEventListener("mousemove", handle);
            card.removeEventListener("mouseleave", reset);
          };
        });
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const active = services[activeServiceIndex];

  return (
    <section 
      ref={sectionRef} 
      aria-label="Hero — UrusMerek" 
      className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background py-20 sm:py-24 lg:py-32"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* LEFT */}
            <div ref={leftRef} className="prose max-w-xl space-y-6">
              <div 
                ref={badgeRef}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm border border-primary/20"
              >
                <span className="pulse-dot relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                UrusMerek.id — Profesional & Terverifikasi
              </div>

              <h1 
                ref={titleRef}
                className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Urus merek anda{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {typed}
                  </span>
                  <span className="blink ml-1 text-primary">▎</span>
                  <span className="absolute bottom-1 left-0 h-3 w-full bg-primary/20 -z-10 blur-sm" />
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahli kapan saja.
              </p>

              <div className="btn-group flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
                <a
                  href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
                >
                  <span>Mulai Konsultasi</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-transparent px-6 py-3.5 text-base font-semibold text-foreground hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                >
                  Lihat Layanan
                </a>
              </div>

              <ul ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
                {heroStats.map((s) => (
                  <li 
                    key={s.label} 
                    className="group rounded-xl border border-border/60 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm p-4 hover:border-primary/30 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{s.value}</div>
                    <div className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Layanan Populer</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                
                <div className="grid gap-3">
                  {services.map((srv, idx) => {
                    const isActive = idx === activeServiceIndex;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setActiveServiceIndex(idx)}
                        onFocus={() => setActiveServiceIndex(idx)}
                        className={`group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                          isActive
                            ? "border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg scale-[1.02]"
                            : "border-border/60 bg-background/70 hover:border-primary/30 hover:bg-primary/5"
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                          isActive ? "bg-primary/20 scale-110" : "bg-primary/5 group-hover:bg-primary/10"
                        }`}>
                          <Image 
                            src={srv.icon} 
                            alt={`${srv.name} icon`} 
                            fill 
                            sizes="48px" 
                            className="object-contain p-2" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-base font-semibold transition-colors ${
                            isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                          }`}>
                            {srv.name}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground leading-snug">
                            {srv.description}
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                            isActive ? "text-primary rotate-90" : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div ref={rightRef} className="relative lg:pl-8">
              <div 
                ref={cardRef} 
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-border/70 bg-black/5 shadow-2xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-50" />
                
                <div className="relative z-10 h-full w-full rounded-2xl overflow-hidden">
                  <video
                    src={VIDEO_SRC}
                    poster={VIDEO_POSTER}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                    aria-label="Video ilustrasi layanan pendaftaran merek"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating info card */}
                  <div className="absolute left-4 bottom-4 right-4 sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-sm rounded-xl border border-white/20 bg-white/95 backdrop-blur-md p-5 shadow-2xl animate-float">
                    <div className="flex items-start gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-xl bg-primary/10 p-2.5 ring-2 ring-primary/20">
                        <Image 
                          src={active.icon} 
                          alt={`${active.name} icon`} 
                          fill 
                          sizes="48px" 
                          className="object-contain" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-bold text-gray-900">{active.name}</div>
                        <div className="mt-1 text-sm text-gray-600 leading-snug">{active.description}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Analisis otomatis
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Pendampingan ahli
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-pulse-slow" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}