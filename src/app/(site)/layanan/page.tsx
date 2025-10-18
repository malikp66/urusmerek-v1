import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { servicePages } from "@/constants/service-pages";
import { Button } from "@/components/ui/button";
import FaqSection from "@/components/sections/faq-section";
import { layananFaqContent } from "@/constants/faq-content";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata: Metadata = {
  title: "Layanan Urus Merek | Konsultasi, Pendaftaran, Perpanjangan",
  description:
    "Pilihan layanan lengkap untuk mengurus perlindungan merek: pendaftaran, perpanjangan, pengalihan hak, hingga konsultasi HKI bersama konsultan bersertifikat.",
  alternates: {
    canonical: "https://www.urusmerek.id/layanan",
  },
};

export default function LayananPage() {
  return (
    <>
      <div className="flex flex-col">
      <section className="relative isolate overflow-hidden bg-[#111827] pb-20 md:pb-28">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/web-banner-bg.png)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/65 via-black/45 to-[#7f1d1d]/75" />

        <div className="container relative z-10 mx-auto px-6 md:px-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">
            Layanan urus merek
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Solusi lengkap untuk mengamankan dan mengelola merek dagang Anda
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100 sm:text-xl">
            Pilih layanan yang sesuai dengan kebutuhan bisnis Anda. Setiap paket ditangani langsung oleh
            konsultan HKI bersertifikat dengan proses transparan dan pendampingan menyeluruh.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 bg-primary shadow-lg shadow-red-500/30 hover:bg-primary/90"
          >
            <Link href="https://wa.me/628112119718">
              Konsultasi Cepat
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {servicePages.map((service) => (
              <article
                key={service.slug}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_60px_-40px_rgba(220,38,38,.28)] transition hover:-translate-y-1 hover:shadow-[0_38px_70px_-38px_rgba(220,38,38,.36)]"
              >
                {service.hero.image && (
                  <div className="overflow-hidden">
                    <SafeImage
                      src={service.hero.image.src}
                      alt={service.hero.image.alt}
                      width={640}
                      height={360}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      containerClassName="w-full"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {service.hero.eyebrow}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold text-foreground">
                    {service.hero.title}
                  </h2>
                  {service.hero.highlight && (
                    <p className="mt-1 text-sm font-medium text-primary/80">
                      {service.hero.highlight}
                    </p>
                  )}
                  <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
                    {service.hero.description}
                  </p>
                  <Button asChild variant="secondary" size="lg" className="mt-6 bg-primary/10 text-primary hover:bg-primary/20">
                    <Link href={`/layanan/${service.slug}`}>
                      Lihat Detail
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </div>
      <FaqSection {...layananFaqContent} />
    </>
  );
}
