"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/brand-hero.mp4";
const VIDEO_POSTER = "/images/brand-hero-poster.jpg";

const services = [
  {
    name: "Pendaftaran Merek",
    description: "Validasi & pengajuan resmi sampai terbit sertifikat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/1kLoj8UkXEaJzqpbLhnGQK/78a22bec17ad80746b1b649cbfa7c1b6/tasks.svg",
  },
  {
    name: "Perpanjangan Merek",
    description: "Perpanjang perlindungan tanpa melewatkan tenggat.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6o4c6qQmBkj73Aze7mxo97/d75cc705830bb23a68e82e51f111ce2b/calendar.svg",
  },
  {
    name: "Cetak Sertifikat",
    description: "Sertifikat digital & fisik siap dikirim.",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/3GU8BuwIs7zQ2gq6DODK0E/c0833c2a402a37fc4eb9588275dde294/chat.svg",
  },
];

const typeWords = ["lebih cepat", "lebih aman", "lebih transparan", "lebih hemat biaya"];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);

  // Auto-loop service cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let i = 0, j = 0, deleting = false;
    const loop = () => {
      const word = typeWords[i % typeWords.length];
      if (!deleting) {
        if (j <= word.length) {
          setTyped(word.slice(0, j++));
          setTimeout(loop, 80);
        } else {
          deleting = true;
          setTimeout(loop, 1000);
        }
      } else {
        if (j > 0) {
          setTyped(word.slice(0, j--));
          setTimeout(loop, 40);
        } else {
          deleting = false;
          i++;
          setTimeout(loop, 400);
        }
      }
    };
    loop();
  }, []);

  // GSAP animations (cinematic)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      // Cinematic entrance (delayed layers)
      tl.from(".badge", { y: -20, opacity: 0 })
        .from(".hero-title", { y: 50, opacity: 0, duration: 1.2 }, "-=0.3")
        .from(".typewriter", { y: 20, opacity: 0 }, "-=0.8")
        .from(".hero-desc", { y: 30, opacity: 0 }, "-=0.6")
        .from(".btn-group", { y: 30, opacity: 0, stagger: 0.1 }, "-=0.6")
        .from(".hero-stats li", { y: 20, opacity: 0, stagger: 0.08 }, "-=0.8")
        .from(videoRef.current, { x: 100, opacity: 0, duration: 1.4 }, "-=1");

      // ScrollTrigger Parallax
      gsap.to(leftRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(videoRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Slow float and zoom for video
      gsap.to(videoRef.current, {
        y: -12,
        scale: 1.04,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Optional pin for cinematic “hold” moment
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom+=200 top",
        pin: true,
        pinSpacing: false,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-white/95 to-white py-20 sm:py-28 lg:py-32"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-[#DC2626]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[20rem] w-[20rem] rounded-full bg-[#DC2626]/5 blur-3xl" />
      </div>

      <div className="container px-6 mx-auto max-w-7xl grid lg:grid-cols-2 items-center gap-16">
        {/* LEFT TEXT */}
        <div ref={leftRef} className="space-y-6">
          <div className="badge inline-flex items-center gap-2 bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] px-4 py-2 rounded-full text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
            </span>
            UrusMerek.id — Profesional & Terverifikasi
          </div>

          <h1 className="hero-title text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
            Urus merek anda
          </h1>

          <div className="typewriter relative inline-block text-[#DC2626] text-4xl sm:text-5xl font-bold -mt-2">
            {typed}
            <span className="ml-1 animate-pulse">▎</span>
          </div>

          <p className="hero-desc text-lg text-gray-600 max-w-lg">
            Dari analisis kesesuaian hingga penerbitan sertifikat — alur yang ramping, dokumen terstruktur, dan dukungan ahli kapan saja.
          </p>

          <div className="btn-group flex flex-col sm:flex-row gap-4">
            <a
              href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek."
              className="bg-[#DC2626] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-[1.03] transition-transform"
            >
              Mulai Konsultasi
            </a>
            <a
              href="#layanan"
              className="border border-[#DC2626]/40 text-[#DC2626] px-6 py-3 rounded-lg font-semibold hover:bg-[#DC2626]/10 transition"
            >
              Lihat Layanan
            </a>
          </div>

          <ul className="hero-stats grid grid-cols-3 gap-4 pt-6">
            {["850+ Bisnis", "30 Mentor", "24 Jam"].map((stat, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 p-4 text-center bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition"
              >
                <div className="text-lg font-bold text-[#DC2626]">{stat.split(" ")[0]}</div>
                <div className="text-xs text-gray-500">{stat.split(" ")[1]}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT VIDEO */}
        <div ref={videoRef} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
          <video
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl max-w-xs shadow-xl border border-white/40">
            <div className="flex gap-3 items-start">
              <Image
                src={services[active].icon}
                alt=""
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h4 className="font-bold text-gray-900">{services[active].name}</h4>
                <p className="text-sm text-gray-600">{services[active].description}</p>
              </div>
            </div>

            {/* Dots pagination */}
            <div className="flex gap-1 mt-3">
              {services.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${i === active ? "bg-[#DC2626]" : "bg-gray-300"
                    } transition-all`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
