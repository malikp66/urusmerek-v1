"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_SRC = "/videos/brand-hero.mp4"; // <-- ganti dengan path/video productionmu
const VIDEO_POSTER = "/images/brand-hero-poster.jpg"; // <-- fallback poster

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

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, { y: 18, opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.from(rightRef.current, { y: 18, opacity: 0, duration: 0.6, delay: 0.08, ease: "power2.out" });
      gsap.from(".stat-item", { y: 8, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const active = services[activeServiceIndex];

  return (
    <section
      ref={sectionRef}
      aria-label="Hero — UrusMerek"
      className="bg-background/60 py-20 sm:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* LEFT: COPY */}
            <div ref={leftRef} className="prose max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary/90">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                UrusMerek.id — Profesional & Terverifikasi
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Daftarkan merek—lebih cepat, aman, dan dapat dipantau.
              </h1>

              <p className="mt-4 text-base text-muted-foreground">
                Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahlinya kapan saja.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="Mulai konsultasi lewat WhatsApp"
                >
                  Mulai Konsultasi
                </a>

                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center rounded-md border border-border/60 bg-transparent px-5 py-3 text-sm font-medium text-foreground/90 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Lihat paket dan layanan"
                >
                  Lihat Layanan
                </a>
              </div>

              <ul className="mt-6 grid grid-cols-3 gap-3">
                {heroStats.map((s) => (
                  <li key={s.label} className="stat-item rounded-lg border border-border/60 bg-background/60 px-4 py-3">
                    <div className="text-lg font-semibold text-foreground">{s.value}</div>
                    <div className="mt-1 text-xs font-medium uppercase text-muted-foreground">{s.label}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-start gap-3">
                <div className="text-xs font-medium uppercase text-muted-foreground">Layanan populer</div>
                <div className="flex w-full max-w-md gap-3">
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

            {/* RIGHT: VIDEO + OVERLAY */}
            <div ref={rightRef} className="relative order-first sm:order-last">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/70 bg-black/5 shadow-lg">
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
                {/* gradient overlay for readability */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* overlay card */}
              <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 transform rounded-xl border border-border/60 bg-background/95 p-5 shadow-xl backdrop-blur md:w-3/4 lg:w-[60%]">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-primary/5 p-2">
                    <Image src={active.icon} alt={`${active.name} icon`} fill sizes="48px" className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{active.name}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{active.description}</p>

                    <ul className="mt-3 flex gap-3 text-xs">
                      <li className="rounded-md border border-border/60 px-3 py-1 text-muted-foreground">Analisis otomatis</li>
                      <li className="rounded-md border border-border/60 px-3 py-1 text-muted-foreground">Pendampingan ahli</li>
                      <li className="rounded-md border border-border/60 px-3 py-1 text-muted-foreground">Notifikasi real-time</li>
                    </ul>
                  </div>

                  <div className="ml-3 flex flex-col items-end gap-2">
                    <a
                      href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                      className="inline-flex items-center gap-2 rounded-md bg-primary/100 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-95 focus:outline-none"
                      aria-label={`Pelajari alur ${active.name}`}
                    >
                      Pelajari
                    </a>
                    <a
                      href="#harga"
                      className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-primary/5 focus:outline-none"
                    >
                      Paket & Harga
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>
      </div>
    </section>
  );
}
