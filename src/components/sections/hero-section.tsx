"use client";

import { useEffect, useRef, useState } from "react";
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

const VIDEO_SRC = "/gone-banner.mp4";

type Service = {
  id: string;
  name: string;
  description: string;
  Icon: React.ElementType;
};

const services: Service[] = [
  {
    id: "pendaftaran",
    name: "Pendaftaran Merek",
    description: "Bebas antri, konsultasi akurat, ajukan resmi hingga bukti permohonan.",
    Icon: ClipboardCheck,
  },
  {
    id: "perpanjangan",
    name: "Perpanjangan Merek",
    description: "Sekali proses online, perlindungan lanjut sampai 10 tahun.",
    Icon: CalendarClock,
  },
  {
    id: "sertifikat",
    name: "Cetak Sertifikat",
    description: "Cetak sertifikat terdaftar & kirim ke alamat Anda.",
    Icon: Award,
  },
  {
    id: "perubahan-nama",
    name: "Perubahan Nama/Alamat",
    description: "Pencatatan perubahan data pemilik merek, cepat & tuntas.",
    Icon: UserCog,
  },
  {
    id: "pengalihan-hak",
    name: "Pengalihan Hak Merek",
    description: "Transfer kepemilikan aman didampingi ahli berpengalaman.",
    Icon: Shuffle,
  },
  {
    id: "usul-tolak",
    name: "Tanggapan Usul/Tolak",
    description: "Surat tanggapan substantif agar merek tetap berpeluang terdaftar.",
    Icon: FileWarning,
  },
  {
    id: "surat-keberatan",
    name: "Surat Keberatan",
    description: "Hadang merek tiruan dengan argumen kuat & susunan tepat.",
    Icon: ShieldCheck,
  },
  {
    id: "lisensi",
    name: "Perjanjian Lisensi",
    description: "Rancang lisensi yang sah untuk kolaborasi aman & menguntungkan.",
    Icon: FileSignature,
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
    <section ref={sectionRef} className="relative overflow-hidden py-10 z-10 sm:py-14 lg:py-20">
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute top-12 left-1/4 z-10 h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-1/4 z-10 h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div ref={leftRef} className="max-w-xl space-y-6">
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 rounded-full bg-[#DC2626]/10 px-4 py-2 text-sm font-semibold text-[#DC2626] border border-[#DC2626]/30">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626] animate-pulse" />
              Jasa Pendaftaran Merek
            </div>

            <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Urus merek anda
            </h1>

            <div className="relative">
              <span id="typedWord" className="text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl font-bold">{typed}</span>
              <span className="ml-1 text-[#DC2626] text-3xl sm:text-4xl lg:text-5xl animate-pulse">▎</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahli kapan saja.
            </p>

            {/* CTA buttons – dengan animasi hover */}
            <div className="btn-group flex gap-4 pt-2">
              <a
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek."
                className="group relative overflow-hidden rounded-lg bg-[#DC2626] text-white px-6 py-3.5 font-semibold shadow-md shadow-[#DC2626]/30 transition-all duration-300
                          hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#DC2626]/35 active:translate-y-0"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Mulai Konsultasi
                  <ArrowRight className="h-4 w-4 translate-x-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {/* shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent
                                transition-transform duration-700 group-hover:translate-x-full" />
              </a>

              <a
                href="#layanan"
                className="group relative rounded-lg border-2 border-[#DC2626]/30 px-6 py-3.5 font-semibold text-foreground transition-all duration-300
                          hover:bg-[#DC2626]/5 hover:border-[#DC2626]/50 hover:translate-y-[-1px] active:translate-y-0"
              >
                <span className="inline-flex items-center gap-2">
                  Lihat Layanan
                  <ArrowRight className="h-4 w-4 translate-x-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </div>

            <ul ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
              {heroStats.map((s) => (
                <li key={s.label} className="rounded-xl border border-border/60 bg-white/60 backdrop-blur-sm p-4 hover:border-[#DC2626]/40 transition-all">
                  <div className="text-2xl mb-1" dangerouslySetInnerHTML={{ __html: s.icon }} />
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-6 opacity-80">
              <img src="/logos/kemenkumham.svg" className="h-6 grayscale hover:grayscale-0 transition" alt="Kemenkumham" />
              <img src="/logos/kominfo.svg" className="h-6 grayscale hover:grayscale-0 transition" alt="Kominfo" />
              <img src="/logos/iso27001.svg" className="h-6 grayscale hover:grayscale-0 transition" alt="ISO 27001" />
            </div>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="relative">
            <div ref={cardRef} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/70 shadow-xl bg-black/5">
              <video src={VIDEO_SRC} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Overlay Info */}
              <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex-shrink-0">
                    <activeService.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{activeService.name}</h5>
                    <p className="text-sm text-gray-600">{activeService.description}</p>
                  </div>
                </div>

                {/* Pagination dots tetap */}
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
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/20">
              <div
                key={currentServiceIndex}
                className="h-full bg-[#DC2626]"
                style={{ animation: "progress 4s linear forwards" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles */}
      <style jsx>{`
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse-slow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  );
}