import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";

import type { ServicePageContent } from "@/constants/service-pages";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import FaqSection from "@/components/sections/faq-section";
import { serviceFaqContent } from "@/constants/faq-content";

type ServicePageTemplateProps = {
  content: ServicePageContent;
};

export function ServicePageTemplate({ content }: ServicePageTemplateProps) {
  const { hero, overview, benefits, pricing } = content;
  const faqConfig = serviceFaqContent[content.slug];

  return (
    <div className="flex flex-col">
      <section
        className="relative isolate overflow-hidden bg-[#111827] py-20 md:py-28"
        aria-labelledby="service-hero-title"
      >
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(${hero.backgroundImage ?? "/web-banner-bg.png"})`,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/65 via-black/45 to-[#7f1d1d]/75" />

        <div className="container relative z-10 mx-auto px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-white">
              {hero.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-red-100">
                  {hero.eyebrow}
                </span>
              )}
              <h1
                id="service-hero-title"
                className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="block">{hero.title}</span>
                {hero.highlight && (
                  <span className="mt-1 block text-red-200">{hero.highlight}</span>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-100 sm:text-xl">
                {hero.description}
              </p>

              {hero.bullets && hero.bullets.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {hero.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-slate-100">
                      <span className="mt-1 rounded-full bg-white/15 p-1 text-red-100">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary shadow-lg shadow-red-500/30 hover:bg-primary/90"
                >
                  <Link href="/layanan">
                    <span>{hero.cta.label}</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                {hero.secondaryCta && (
                  <Button asChild variant="secondary" size="lg" className="bg-white/10 text-white hover:bg-white/20">
                    <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
                  </Button>
                )}
              </div>

              {hero.note && (
                <p className="mt-4 text-sm text-slate-200/80">{hero.note}</p>
              )}

              {hero.stats && hero.stats.length > 0 && (
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {hero.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <span className="text-xs uppercase tracking-wide text-red-100/90">
                        {stat.label}
                      </span>
                      <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hero.image && (
              <div className="relative">
                <div className="absolute -left-10 -top-10 hidden h-32 w-32 rounded-full bg-primary/40 blur-3xl lg:block" />
                <div className="absolute -right-12 -bottom-12 hidden h-36 w-36 rounded-full bg-amber-400/40 blur-3xl lg:block" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-lg">
                  <SafeImage
                    src={hero.image.src}
                    alt={hero.image.alt}
                    width={720}
                    height={520}
                    className="h-full w-full object-cover"
                    containerClassName="h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {overview && (
        <section
          id={overview.id}
          className="relative overflow-hidden bg-white py-16 md:py-24"
          aria-labelledby="service-overview-heading"
        >
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-red-100/50 blur-3xl" />
          <div className="absolute -right-44 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

          <div className="container relative mx-auto px-6 md:px-10">
            <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <header>
                  <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Tahap pendampingan
                  </span>
                  <h2
                    id="service-overview-heading"
                    className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl"
                  >
                    {overview.heading}
                  </h2>
                </header>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  {overview.description}
                </p>

                {overview.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}

                {overview.media && (
                  <div className="rounded-3xl border border-slate-200/60 bg-slate-50 p-4 shadow-inner">
                    <SafeImage
                      src={overview.media.src}
                      alt={overview.media.alt}
                      width={620}
                      height={360}
                      className="w-full rounded-2xl object-cover"
                      containerClassName="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {overview.items.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_45px_-30px_rgba(220,38,38,.25)] transition hover:-translate-y-1 hover:shadow-[0_35px_55px_-28px_rgba(220,38,38,.35)]"
                  >
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {benefits && (
        <section
          className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-red-50 py-16 md:py-24"
          aria-labelledby="service-benefits-heading"
        >
          <div className="container relative mx-auto px-6 md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id="service-benefits-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                {benefits.heading}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{benefits.description}</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.items.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-3xl border border-transparent bg-white/80 p-6 shadow-[0_28px_60px_-36px_rgba(220,38,38,.38)] backdrop-blur transition hover:-translate-y-1 hover:border-red-200/60"
                >
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {pricing && (
        <section
          className="bg-white py-16 md:py-24"
          aria-labelledby="service-pricing-heading"
        >
          <div className="container mx-auto grid gap-12 px-6 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h2
                id="service-pricing-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                {pricing.heading}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {pricing.description}
              </p>
              {pricing.note && (
                <p className="text-sm text-muted-foreground/80">{pricing.note}</p>
              )}
            </div>

            <div className="space-y-6">
              {pricing.packages.map((pkg) => (
                <article
                  key={pkg.name}
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_32px_70px_-40px_rgba(220,38,38,.35)]"
                >
                  {pkg.badge && (
                    <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {pkg.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-semibold text-foreground">{pkg.name}</h3>
                  <p className="mt-2 text-lg font-medium text-primary">{pkg.price}</p>

                  {pkg.description && (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                  )}

                  <div className="mt-6 space-y-3">
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-base text-muted-foreground">
                        <span className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                          <Check className="h-4 w-4" />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="mt-8 w-full bg-primary hover:bg-primary/90"
                  >
                    <Link href={pkg.cta.href}>
                      {pkg.cta.label}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {pkg.footnote && (
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      {pkg.footnote}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {faqConfig ? <FaqSection {...faqConfig} /> : null}
    </div>
  );
}

export default ServicePageTemplate;
