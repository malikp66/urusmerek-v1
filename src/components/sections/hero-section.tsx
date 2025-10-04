"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_SRC = "/videos/brand-hero.mp4"; // <- ganti
const VIDEO_POSTER = "/images/brand-hero-poster.jpg"; // <- ganti

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
  { label: "Bisnis terbantu", value: "850+" },
  { label: "Mentor HKI", value: "30" },
  { label: "Rata-rata proses", value: "24 jam" },
];

// WORDS TO CYCLE in typewriter (customize)
const typeWords = ["lebih cepat", "lebih aman", "lebih transparan", "lebih hemat biaya"];
const TYPE_SPEED = 60; // ms per char
const PAUSE_AFTER = 1100; // ms pause after a word completes

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // typewriter state
  const [typed, setTyped] = useState("");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const typingTimerRef = useRef<number | null>(null);
  const deletingRef = useRef(false);

  useEffect(() => {
    // TYPEWRITER IMPLEMENTATION (plain JS + timers)
    const run = () => {
      const current = typeWords[wordIndexRef.current % typeWords.length];
      if (!deletingRef.current) {
        // typing
        if (charIndexRef.current <= current.length) {
          setTyped(current.slice(0, charIndexRef.current));
          charIndexRef.current += 1;
          typingTimerRef.current = window.setTimeout(run, TYPE_SPEED);
        } else {
          // pause then start deleting
          typingTimerRef.current = window.setTimeout(() => {
            deletingRef.current = true;
            charIndexRef.current = current.length - 1;
            run();
          }, PAUSE_AFTER);
        }
      } else {
        // deleting
        if (charIndexRef.current >= 0) {
          setTyped(current.slice(0, charIndexRef.current));
          charIndexRef.current -= 1;
          typingTimerRef.current = window.setTimeout(run, TYPE_SPEED / 1.6);
        } else {
          // move to next word
          deletingRef.current = false;
          wordIndexRef.current = (wordIndexRef.current + 1) % typeWords.length;
          charIndexRef.current = 0;
          typingTimerRef.current = window.setTimeout(run, 200);
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
      // basic entrance
      const tl = gsap.timeline();
      tl.from(leftRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" })
        .from(rightRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.45");

      // floating subtle on right hero card (infinite)
      gsap.to(rightRef.current, {
        y: 6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2,
      });

      // micro parallax on mouse move over card
      const card = cardRef.current;
      if (card) {
        const mm = gsap.matchMedia();
        mm.add("(pointer: fine)", () => {
          const handle = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - (r.left + r.width / 2)) / r.width;
            const py = (e.clientY - (r.top + r.height / 2)) / r.height;
            gsap.to(card, { rotationY: px * 6, rotationX: -py * 4, transformPerspective: 800, transformOrigin: "center", duration: 0.5, ease: "power3.out" });
          };
          card.addEventListener("mousemove", handle);
          card.addEventListener("mouseleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power3.out" }));
          return () => {
            card.removeEventListener("mousemove", handle);
          };
        });
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const active = services[activeServiceIndex];

  return (
    <section ref={sectionRef} aria-label="Hero — UrusMerek" className="bg-background/60 py-16 sm:py-20 lg:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* LEFT */}
            <div ref={leftRef} className="prose max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary/90">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                UrusMerek.id — Profesional & Terverifikasi
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Urus merek anda{" "}
                <span aria-hidden className="inline-block w-[14ch]">
                  <span className="inline-block text-primary underline-decoration-2">{typed}</span>
                  <span className="inline-block blink ml-1" aria-hidden>▎</span>
                </span>
              </h1>

              <p className="mt-4 text-base text-muted-foreground">
                Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahli kapan saja.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Mulai Konsultasi
                </a>

                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center rounded-md border border-border/60 bg-transparent px-5 py-3 text-sm font-medium text-foreground/90 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Lihat Layanan
                </a>
              </div>

              <ul className="mt-6 grid grid-cols-3 gap-3">
                {heroStats.map((s) => (
                  <li key={s.label} className="rounded-lg border border-border/60 bg-background/60 px-4 py-3">
                    <div className="text-lg font-semibold text-foreground">{s.value}</div>
                    <div className="mt-1 text-xs font-medium uppercase text-muted-foreground">{s.label}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <div className="text-xs font-medium uppercase text-muted-foreground">Layanan populer</div>
                <div className="mt-3 flex w-full max-w-lg gap-3">
                  {services.map((srv, idx) => {
                    const activeClass = idx === activeServiceIndex ? "ring-2 ring-primary/30" : "hover:ring-1 hover:ring-primary/20";
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setActiveServiceIndex(idx)}
                        onFocus={() => setActiveServiceIndex(idx)}
                        className={`flex w-full items-center gap-3 rounded-md border border-border/60 bg-background/70 px-3 py-2 text-left transition ${activeClass} focus:outline-none`}
                        aria-pressed={idx === activeServiceIndex}
                      >
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-primary/5">
                          <Image src={srv.icon} alt={`${srv.name} icon`} fill sizes="32px" className="object-contain p-[6px]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{srv.name}</div>
                          <div className="text-xs text-muted-foreground">{srv.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div ref={rightRef} className="relative">
              <div ref={cardRef} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/70 bg-black/5 shadow-xl">
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
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent pointer-events-none" />
                {/* overlay card inside video area */}
                <div className="absolute left-6 bottom-6 max-w-xs rounded-xl border border-border/60 bg-background/95 p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-lg bg-primary/5 p-2">
                      <Image src={active.icon} alt={`${active.name} icon`} fill sizes="40px" className="object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{active.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{active.description}</div>
                      <div className="mt-3 flex gap-2 text-xs">
                        <span className="rounded-md border border-border/60 px-2 py-1">Analisis otomatis</span>
                        <span className="rounded-md border border-border/60 px-2 py-1">Pendampingan ahli</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>
      </div>

      {/* small style tweaks */}
      <style jsx>{`
        .blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          0% { opacity: 1 }
          50% { opacity: 0 }
          100% { opacity: 1 }
        }
      `}</style>
    </section>
  );
}
