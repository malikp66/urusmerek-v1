"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const services = [
  {
    name: "Pendaftaran Merek",
    description: "Validasi dan pengajuan merek resmi hingga terbit sertifikat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/1kLoj8UkXEaJzqpbLhnGQK/78a22bec17ad80746b1b649cbfa7c1b6/tasks.svg",
  },
  {
    name: "Perpanjangan Merek",
    description: "Perpanjang perlindungan merek tanpa melewatkan tenggat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6o4c6qQmBkj73Aze7mxo97/d75cc705830bb23a68e82e51f111ce2b/calendar.svg",
  },
  {
    name: "Cetak Sertifikat",
    description: "Sertifikat digital maupun fisik siap kirim ke alamat Anda.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/3GU8BuwIs7zQ2gq6DODK0E/c0833c2a402a37fc4eb9588275dde294/chat.svg",
  },
  {
    name: "Perubahan Nama/Data",
    description: "Update pemilik, alamat, dan data lain dengan prosedur resmi.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/4pELfkucykUliBs955mmB1/a296804ab8fa5735641bde6cb0fd82c5/forms.svg",
  },
  {
    name: "Pengalihan Hak",
    description: "Alihkan kepemilikan merek dengan dokumen yang sah secara hukum.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6SB8kXExiVbLkbhcQH3bA1/8a613cfe129bdd78687b4ede40e697ca/dashboards.svg",
  },
  {
    name: "Usul/Tolak Merek",
    description: "Dukungan lengkap menghadapi keberatan pihak lain.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7eNAW6hFEsR5PZ11mfOb8A/a6face0cb17db3f1841772b959118320/whiteboards.svg",
  },
  {
    name: "Surat Keberatan",
    description: "Siapkan surat keberatan profesional dan bernas.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7MqGgkMNjMmHKd5bE6G8VZ/e11962f1688dba77b57f8ac00388e1f2/gantt.svg",
  },
  {
    name: "Lisensi Merek",
    description: "Atur lisensi merek dengan struktur royalti yang jelas.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/5U24qrdYQdSOJ8UbKyyeYh/297a97b00008121101dfff781f4e6742/clickup-brain-2.png",
  },
];

const heroStats = [
  { label: "Bisnis terbantu", value: "850+" },
  { label: "Mentor HKI", value: "30" },
  { label: "Rata-rata proses", value: "24 jam" },
];

const highlightSteps = [
  "Analisis kesesuaian merek otomatis",
  "Pendampingan ahli hingga selesai",
  "Monitoring status real-time",
];

const serviceDetailSteps = [
  "Briefing kebutuhan tanpa tatap muka",
  "Dokumen divalidasi dan disusun otomatis",
  "Pengajuan resmi dipantau sampai selesai",
];

const serviceStatus = [
  { label: "Respons tim", value: "< 5 menit" },
  { label: "Keberhasilan", value: "98%" },
  { label: "Monitoring", value: "Real-time" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const interactivePanelRef = useRef<HTMLDivElement | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".hero-badge", { y: 16, opacity: 0, duration: 0.4 })
        .from(".hero-title", { y: 32, opacity: 0, duration: 0.6 })
        .from(".hero-subtitle", { y: 24, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".hero-highlight-item", { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.3")
        .from(".hero-ctas > a", { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 }, "-=0.25")
        .from(".hero-stats-item", { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.2")
        .from(interactivePanelRef.current, { x: 40, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-service-option", { y: 12, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.25")
        .from(".hero-preview-card", { y: 20, opacity: 0, duration: 0.5 }, "-=0.25")
        .from(".hero-status-chip", { y: 12, opacity: 0, duration: 0.35, stagger: 0.08 }, "-=0.25");

      if (prefersReducedMotion) return;

      gsap.to(".hero-orbit-pulse", {
        scale: 1.08,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-orbit-ring", {
        rotate: 8,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const selectedService = services[activeServiceIndex] ?? services[0];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-20 md:py-24 lg:py-32">
      <div className="absolute inset-x-0 -top-24 flex justify-center" aria-hidden="true">
        <div className="hero-glow h-64 w-[720px] rounded-full bg-primary/40 blur-3xl" />
      </div>
      <div className="container relative px-4 md:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-lg backdrop-blur lg:p-12">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="hero-content-column flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                UrusMerek.id ▸ Kecepatan Resmi
              </div>
              <h1 className="hero-title mt-6 text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Daftar merek Anda jadi lebih cepat, aman, dan transparan.
              </h1>
              <p className="hero-subtitle mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                Dari analisis awal, penyusunan dokumen, sampai pantau status di Kemenkumham—semua terhubung dalam satu alur interaktif dengan notifikasi real-time dan dukungan ahli berpengalaman.
              </p>
              <ul className="mt-6 grid w-full gap-3 text-left text-sm text-muted-foreground sm:grid-cols-3">
                {highlightSteps.map((item) => (
                  <li
                    key={item}
                    className="hero-highlight-item flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="hero-ctas mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2CSaya+ingin+mengajukan+pendaftaran+merek.+Apa+yang+harus+saya+persiapkan%3F&type=phone_number&app_absent=0"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-transform hover:scale-[1.02] hover:bg-primary/90"
                >
                  Mulai Konsultasi
                </a>
                <a
                  href="#harga"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-primary/70 bg-background px-8 text-base font-semibold text-primary transition-all hover:bg-primary/10"
                >
                  Lihat Semua Paket
                </a>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Konsultasi gratis • Tanpa biaya tersembunyi • Resmi tercatat
              </p>
              <div className="hero-stats mt-8 grid w-full gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="hero-stats-item rounded-2xl border border-border/70 bg-background/80 px-5 py-4 text-left shadow-sm backdrop-blur"
                  >
                    <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div ref={interactivePanelRef} className="hero-interactive-panel flex w-full flex-col gap-6">
              <div className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-md backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Pilih layanan utama</span>
                  <span className="text-xs text-muted-foreground">Hover atau ketuk untuk melihat ringkasan</span>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)]">
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service, index) => {
                      const isActive = index === activeServiceIndex;
                      return (
                        <button
                          key={service.name}
                          type="button"
                          onMouseEnter={() => setActiveServiceIndex(index)}
                          onFocus={() => setActiveServiceIndex(index)}
                          onClick={() => setActiveServiceIndex(index)}
                          className={`hero-service-option group flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                            isActive
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border/60 bg-background/70 hover:border-primary/60 hover:bg-primary/5"
                          }`}
                          aria-pressed={isActive}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary/10">
                              <Image
                                src={service.icon}
                                alt={`${service.name} icon`}
                                fill
                                sizes="36px"
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm font-semibold">{service.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground/80">
                            {service.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="hero-preview-card relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-6">
                    <div className="absolute inset-x-10 -top-24 h-48 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
                    <div className="relative flex flex-col items-center gap-5 text-center">
                      <div className="relative flex h-32 w-32 items-center justify-center">
                        <div className="hero-orbit-blur absolute h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
                        <div className="hero-orbit-ring relative flex h-32 w-32 items-center justify-center rounded-full border border-primary/30 bg-background/60">
                          <div className="hero-orbit-pulse h-20 w-20 rounded-full bg-primary/15" />
                          <span className="text-sm font-semibold text-primary">#{activeServiceIndex + 1}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-primary">{selectedService.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                      </div>
                      <ul className="w-full space-y-2 text-left text-xs text-muted-foreground">
                        {serviceDetailSteps.map((step) => (
                          <li key={step} className="flex items-start gap-2">
                            <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Pelajari alur lengkap →
                      </a>
                    </div>
                  </div>
                </div>
                <div className="hero-status-row mt-6 grid gap-3 sm:grid-cols-3">
                  {serviceStatus.map((item) => (
                    <div
                      key={item.label}
                      className="hero-status-chip rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-left"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
