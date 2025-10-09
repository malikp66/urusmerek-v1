"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/context";
import { Button } from "../ui/button";
import { MediaSkeleton } from "@/components/ui/media-skeleton";

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

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: red theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-red-50 to-white" aria-hidden="true" />

      {/* Red decorative glows */}
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
            <span className="text-sm eyebrow font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {heading}
            </h2>
            <p className="mt-3 text-base font-semibold text-primary">{subheading}</p>
            <p className="mt-4 text-lg text-muted-foreground">{body}</p>
            <p className="mt-3 text-sm text-muted-foreground">{note}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="hover:-translate-y-px">
                <Link
                  href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0"
                >
                  {primaryCta}
                </Link>
              </Button>

              <Button variant="outline" asChild size="lg" className="btn-outline-brand hover:-translate-y-px">
                <Link href="#harga">
                  {secondaryCta}
                </Link>
              </Button>
            </div>
          </div> {/* ✅ TUTUP div Copy */}

          {/* Visual */}
          <div className="mt-12 lg:mt-0">
            <div className="relative mx-auto w-full overflow-hidden rounded-xl shadow-2xl">
              <MediaSkeleton isVisible={!isImageLoaded} className="rounded-xl" />
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={760}
                priority
                onLoadingComplete={() => setIsImageLoaded(true)}
                className={`rounded-xl w-full h-auto transition-opacity duration-500 ease-out ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
