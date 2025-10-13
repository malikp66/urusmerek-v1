"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { SafeImage } from "@/components/ui/safe-image";

/* Lucide icons */
import {
  BadgeCheck,        // Pendaftaran
  CalendarClock,     // Perpanjangan
  Stamp,             // Cetak sertifikat
  FileEdit,          // Perubahan data
  ArrowLeftRight,    // Pengalihan hak
  FileWarning,       // Usul/tolak
  Gavel,             // Surat keberatan/oposisi
  Handshake,         // Perjanjian lisensi
  CheckCircle,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

/* ===== Types ===== */
type PriceVariant = { id: string; name: string; price: number; note?: string };
type Service = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  image: string;
  features: string[];
  benefits: string[];
  prices: PriceVariant[];
  ctaLink?: string;
};

const IDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const serviceIconMap: Record<string, React.ComponentType<any>> = {
  BadgeCheck,
  CalendarClock,
  Stamp,
  FileEdit,
  ArrowLeftRight,
  FileWarning,
  Gavel,
  Handshake,
};

/* ===== Component ===== */
export default function IndustryTemplates() {
  const t = useTranslations("industryTemplates");
  const heading = t<string>("heading");  
  const eyebrow = t<string>("eyebrow");
  const description = t<string>("description");
  const seeAll = t<string>("seeAll");
  const close = t<string>("close");
  const priceLabel = t<string>("priceLabel");
  const priceDisclaimer = t<string>("priceDisclaimer");
  const optionsHeading = t<string>("optionsHeading");
  const cta = t<string>("cta");
  const servicesCopy = t<(Service & { icon: string })[]>("services") ?? [];
  const services = useMemo<Service[]>(
    () =>
      servicesCopy.map(({ icon, ...service }) => ({
        ...service,
        icon: serviceIconMap[icon] ?? BadgeCheck,
      })),
    [servicesCopy]
  );
  const [activeId, setActiveId] = useState<string>(servicesCopy[0]?.id ?? "");
  const [expanded, setExpanded] = useState(false);
  const [pickedVariantByService, setPickedVariantByService] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!services.some((service) => service.id === activeId)) {
      setActiveId(services[0]?.id ?? "");
    }
  }, [services, activeId]);

  const active = useMemo(() => services.find((s) => s.id === activeId) ?? services[0], [services, activeId]);
  const visibleServices = expanded ? services : services.slice(0, 4);

  const currentVariantId = active ? pickedVariantByService[active.id] ?? active.prices[0]?.id : undefined;
  const currentVariant = active?.prices.find((p) => p.id === currentVariantId) ?? active?.prices[0];

  if (!active) {
    return null;
  }

  return (
    <section id="harga" className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-base eyebrow font-semibold text-primary">{eyebrow}</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Selector + toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-1.5">
          <div className="flex flex-wrap justify-center gap-1.5 rounded-xl">
            {visibleServices.map((s) => {
              const Icon = s.icon;
              const checked = s.id === activeId;
              return (
                <Button
                  variant={checked ? "default" : "outline"}
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  size="lg"
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Toggle expand/collapse */}
          {!expanded ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpanded(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 sm:mt-0 sm:w-auto"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{seeAll}</span>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={() => setExpanded(false)}
              aria-label={close}
              className="mt-3 flex h-10 w-10 items-center justify-center sm:mt-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Details panel */}
        <div className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg max-w-6xl mx-auto transition-all duration-300">
          <div className="grid gap-8 md:gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Left: copy + features */}
            <div className="lg:col-span-3">
              <h3 className="text-2xl md:text-3xl font-semibold">{active.title}</h3>
              <p className="mt-3 text-muted-foreground">{active.description}</p>

              <ul className="mt-6 space-y-3">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 overflow-hidden rounded-xl">
                <div className="relative h-48 w-full sm:h-56 md:h-64">
                  <SafeImage
                    key={active.image}
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-cover rounded-xl"
                    skeletonClassName="rounded-xl"
                    containerClassName="h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right: price + benefits + CTA */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              {/* Variants */}
              <div>
                <h4 className="text-lg font-semibold">{optionsHeading}</h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {active.prices.map((p) => {
                    const isActive = currentVariantId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() =>
                          setPickedVariantByService((prev) => ({ ...prev, [active.id]: p.id }))
                        }
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          isActive ? "border-primary bg-primary text-white" : "hover:border-primary/60"
                        )}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                {/* Price */}
                <div className="mt-5">
                  <div className="text-sm text-muted-foreground">{priceLabel}</div>
                  <div className="text-3xl font-semibold">{currentVariant ? IDR(currentVariant.price) : "-"}</div>
                  {currentVariant?.note && (
                    <div className="text-sm text-muted-foreground mt-1">{currentVariant.note}</div>
                  )}
                </div>

                {/* Benefits */}
                <div className="mt-6 grid grid-cols-1 gap-2">
                  {active.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-muted-foreground">{priceDisclaimer}</p>
              </div>

              <Button asChild size="lg" className="mt-6 w-full justify-center sm:w-auto">
                <Link href={active.ctaLink ?? "#"} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
