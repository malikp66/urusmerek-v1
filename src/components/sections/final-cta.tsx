"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/context";

const FinalCta = () => {
  const t = useTranslations("finalCta");
  const eyebrow = t<string>("eyebrow");
  const heading = t<string>("heading");
  const subheading = t<string>("subheading");
  const body = t<string>("body");
  const note = t<string>("note");
  const primaryCta = t<string>("primaryCta");
  const secondaryCta = t<string>("secondaryCta");
  const imageSrc = t<string>("imageSrc");
  const imageAlt = t<string>("imageAlt");
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: red theme */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-red-50 to-white"
        aria-hidden="true"
      />

      {/* Red decorative glows (pure CSS, tanpa asset eksternal) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60
                   bg-[radial-gradient(ellipse_at_center,theme(colors.red.300),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-40
                   bg-[radial-gradient(ellipse_at_center,theme(colors.rose.300),transparent_60%)]"
      />

      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-28 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          {/* Copy */}
          <div className="relative z-10">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {heading}
            </h2>

            <p className="mt-3 text-base font-semibold text-primary">
              {subheading}
            </p>

            <p className="mt-4 text-lg text-muted-foreground">
              {body}
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              {note}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-medium
                           rounded-lg text-primary-foreground bg-primary shadow-lg hover:bg-primary/90
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                {primaryCta}
              </Link>

              <Link
                href="#harga"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold
                           rounded-lg border border-primary/30 text-primary bg-white/70 backdrop-blur
                           hover:bg-white hover:border-primary transition-colors"
              >
                {secondaryCta}
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="mt-12 lg:mt-0">
            <div className="relative mx-auto w-full rounded-xl shadow-2xl">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={760}
                className="rounded-xl w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
