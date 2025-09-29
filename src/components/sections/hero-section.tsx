"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const services = [
  {
    name: "Pendaftaran Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/1kLoj8UkXEaJzqpbLhnGQK/78a22bec17ad80746b1b649cbfa7c1b6/tasks.svg",
  },
  {
    name: "Perpanjangan Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6o4c6qQmBkj73Aze7mxo97/d75cc705830bb23a68e82e51f111ce2b/calendar.svg",
  },
  {
    name: "Cetak Sertifikat",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/3GU8BuwIs7zQ2gq6DODK0E/c0833c2a402a37fc4eb9588275dde294/chat.svg",
  },
  {
    name: "Perubahan Nama/Data",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/4pELfkucykUliBs955mmB1/a296804ab8fa5735641bde6cb0fd82c5/forms.svg",
  },
  {
    name: "Pengalihan Hak",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/6SB8kXExiVbLkbhcQH3bA1/8a613cfe129bdd78687b4ede40e697ca/dashboards.svg",
  },
  {
    name: "Usul/Tolak Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7eNAW6hFEsR5PZ11mfOb8A/a6face0cb17db3f1841772b959118320/whiteboards.svg",
  },
  {
    name: "Surat Keberatan",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/7MqGgkMNjMmHKd5bE6G8VZ/e11962f1688dba77b57f8ac00388e1f2/gantt.svg",
  },
  {
    name: "Lisensi Merek",
    icon: "https://images.ctfassets.net/w8fc6tgspyjz/5U24qrdYQdSOJ8UbKyyeYh/297a97b00008121101dfff781f4e6742/clickup-brain-2.png",
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".hero-title", { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".hero-ctas > a", { y: 12, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.2")
        .from(rightRef.current, { x: 40, opacity: 0, duration: 0.6 }, "-=0.2")
        .from(".service-card", { y: 16, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-20 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div ref={leftRef} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <h1 className="hero-title tracking-tighter">
              Daftar Merek Tanpa Drama, 1 Hari Langsung Terlindungi
            </h1>
            <p className="hero-subtitle max-w-[600px] text-muted-foreground md:text-xl">
              Solusi perlindungan merek usaha Anda di Indonesia, dibantu Ahli berpengalaman. Kami urus pendaftaran, perpanjangan, hingga surat keberatan—cepat, aman, dan resmi tercatat di Kemenkumham.
            </p>
            <div className="hero-ctas flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2CSaya+ingin+mengajukan+pendaftaran+merek.+Apa+yang+harus+saya+persiapkan%3F&type=phone_number&app_absent=0"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Mulai Konsultasi
              </a>
              <a
                href="#harga"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors border border-primary h-12 px-8 bg-background text-primary hover:bg-accent"
              >
                Lihat Semua Paket
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Konsultasi gratis. Tanpa biaya tersembunyi.
            </p>
          </div>
          <div ref={rightRef} className="bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
            <div className="flex flex-col space-y-4">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/be51f6a2-86bf-435d-8907-19b2ee1db37a/generated_images/vector-illustration-in-a-clean%2c-modern-8e183e8c-20250929100505.jpg?"
                  alt="Ilustrasi perlindungan merek dagang untuk bisnis"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Layanan Utama Kami</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Pilih layanan yang sesuai dengan kebutuhan bisnis Anda.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="service-card flex flex-col items-center justify-center space-y-2 rounded-lg border bg-gray-50/50 p-4 text-center"
                  >
                    <div className="relative h-8 w-8">
                       <Image
                        src={service.icon}
                        alt={`${service.name} icon`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+mulai+pendaftaran+merek.&type=phone_number&app_absent=0"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-11 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
              >
                Mulai Pendaftaran
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}