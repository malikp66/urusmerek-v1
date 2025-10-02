"use client";
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const interactivePanelRef = useRef<HTMLDivElement | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".hero-badge", { y: 16, opacity: 0, duration: 0.4 })
        .from(".hero-title", { y: 32, opacity: 0, duration: 0.6 })
        .from(".hero-subtitle", { y: 24, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".hero-highlight", { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.3")
        .from(".hero-ctas > a", { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 }, "-=0.25")
        .from(".hero-stats-item", { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.2")
        .from(interactivePanelRef.current, { x: 40, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".service-option", { y: 14, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.25")
        .from(".service-description", { y: 18, opacity: 0, duration: 0.45 }, "-=0.2")
        .from(".hero-floating-card", { y: 22, opacity: 0, duration: 0.45, stagger: 0.1 }, "-=0.25");

      gsap.utils
        .toArray<HTMLDivElement>(".hero-floating-card")
        .forEach((card, index) => {
          gsap.to(card, {
            y: index % 2 === 0 ? 14 : -14,
            duration: 3.2 + index * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
    }, sectionRef);

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
            <div
              ref={leftColumnRef}
              className="hero-content-column flex flex-col items-center text-center lg:items-start lg:text-left"
            >
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
              <ul className="hero-highlight mt-6 grid w-full gap-3 text-left text-sm text-muted-foreground sm:grid-cols-3">
                {highlightSteps.map((item) => (
                  <li
                    key={item}
                    className="hero-highlight flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur"
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
                  <span className="text-sm font-semibold text-primary">Pilih layanan</span>
                  <span className="text-xs text-muted-foreground">Geser atau arahkan kursor</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {services.map((service, index) => {
                    const isActive = index === activeServiceIndex;
                    return (
                      <button
                        key={service.name}
                        type="button"
                        onMouseEnter={() => setActiveServiceIndex(index)}
                        onFocus={() => setActiveServiceIndex(index)}
                        className={`service-option group flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          isActive
                            ? "border-primary bg-primary/10 text-foreground shadow-sm"
                            : "border-border/70 bg-background/70 hover:border-primary/70 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 rounded-xl bg-primary/10 p-1.5">
                            <Image
                              src={service.icon}
                              alt={`${service.name} icon`}
                              fill
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
                <div className="service-description mt-5 rounded-2xl border border-primary/40 bg-primary/5 p-5">
                  <p className="text-sm font-semibold text-primary">Alur singkat layanan</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedService.description}
                  </p>
                  <a
                    href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Konsultasi dengan ahli →
                  </a>
                </div>
              </div>

              <div className="relative grid gap-4 sm:grid-cols-2">
                <div className="hero-floating-card rounded-3xl border border-border/60 bg-gradient-to-br from-primary/20 via-primary/5 to-background px-5 py-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-foreground/90">
                      Status Dashboard
                    </span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      Live
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm text-primary-foreground/90">
                      <span>Pengajuan aktif</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-primary-foreground/90">
                      <span>Butuh tindakan</span>
                      <span className="font-semibold text-amber-300">3</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/20">
                      <div className="h-full w-[72%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                <div className="hero-floating-card rounded-3xl border border-border/60 bg-background/95 px-5 py-6 shadow-lg">
                  <p className="text-sm font-semibold text-muted-foreground">Ringkasan timeline</p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Analisis merek</p>
                        <p className="text-xs text-muted-foreground">Kecocokan 96% di database DJKI</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Selesai
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Dokumen lengkap</p>
                        <p className="text-xs text-muted-foreground">Ditandatangani dan siap unggah</p>
                      </div>
                      <span className="rounded-full bg-amber-100/40 px-3 py-1 text-xs font-medium text-amber-500">
                        Review
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Pengajuan resmi</p>
                        <p className="text-xs text-muted-foreground">Estimasi selesai 1 hari kerja</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Dalam proses
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-background/80 p-6 backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Didukung teknologi dan pakar HKI</p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      Gabungkan otomatisasi AI dan tim manusia dalam satu dashboard.
                    </p>
                  </div>
                  <a
                    href="https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+mengetahui+alur+pendaftaran+merek.&type=phone_number&app_absent=0"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-primary/60 px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Pelajari alurnya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
