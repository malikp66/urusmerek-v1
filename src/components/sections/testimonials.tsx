"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CalendarClock,
  FileText,
  RefreshCw,
  ArrowLeftRight,
  ShieldAlert,
  FileSignature,
} from "lucide-react";

import { useTranslations } from "@/lib/i18n/context";

type Variant = {
  id: string;
  name: string;
  price: number;
  note?: string;
};

type ServiceContent = {
  id: string;
  name: string;
  icon: string;
  image: {
    src: string;
    alt: string;
  };
  blurb: string;
  benefits: string[];
  variants: Variant[];
  badge?: string;
};

type SelectorContent = {
  title: string;
  description: string;
  button: {
    label: string;
    href: string;
    aria: string;
  };
};

type PanelContent = {
  selectedLabel: string;
  optionLabel: string;
  priceLabel: string;
  note: string;
};

const iconMap: Record<string, React.ElementType> = {
  badgeCheck: BadgeCheck,
  refreshCw: RefreshCw,
  fileText: FileText,
  fileSignature: FileSignature,
  arrowLeftRight: ArrowLeftRight,
  shieldAlert: ShieldAlert,
  calendarClock: CalendarClock,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const PricingSelectorSection = () => {
  const t = useTranslations("pricingSelector");
  const eyebrow = t("eyebrow");
  const title = t("title");
  const description = t("description");
  const selector = t<SelectorContent>("selector");
  const panel = t<PanelContent>("panel");
  const services = t<ServiceContent[]>("services");

  const initialService = services[0];
  const [active, setActive] = useState(initialService?.id ?? "");
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const service = useMemo(() => {
    return services.find((item) => item.id === active) ?? initialService;
  }, [services, active, initialService]);

  if (!service) {
    return null;
  }

  return (
    <section id="harga" className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col p-4 max-w-xl bg-white rounded-3xl shadow-2xl items-center gap-4">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{selector.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{selector.description}</p>
          <div
            role="radiogroup"
            aria-label={selector.title}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {services.map((item) => {
              const Icon = iconMap[item.icon] ?? BadgeCheck;
              const checked = item.id === (service?.id ?? "");
              return (
                <button
                  key={item.id}
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "flex min-h-[64px] flex-col items-center justify-center gap-2 rounded-xl border bg-card px-3 py-2 text-center text-sm font-medium shadow-sm transition",
                    checked
                      ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("h-5 w-5", checked ? "text-primary" : "text-foreground/70")} />
                  <span className={cn(checked ? "text-primary" : "text-foreground")}>{item.name}</span>
                </button>
              );
            })}
          </div>
          <a
            href={selector.button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={selector.button.aria}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow hover:opacity-95"
          >
            {selector.button.label}
          </a>
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative h-56 w-full overflow-hidden rounded-xl lg:h-72 lg:w-1/2">
              <Image src={service.image.src} alt={service.image.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-sm opacity-90">{panel.selectedLabel}</div>
                <h3 className="text-2xl font-semibold">{service.name}</h3>
                {service.badge ? (
                  <span className="mt-2 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {service.badge}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-semibold">{panel.optionLabel}</h4>

              <div className="mt-3 flex flex-wrap gap-2">
                {service.variants.map((variant) => {
                  const current = chosen[service.id] ?? service.variants[0].id;
                  const isActive = current === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setChosen((prev) => ({ ...prev, [service.id]: variant.id }))}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        isActive ? "border-primary bg-primary text-white" : "hover:border-primary/60"
                      )}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{panel.priceLabel}</div>
                  <div className="text-3xl font-semibold">
                    {formatCurrency(
                      service.variants.find(
                        (variant) => variant.id === (chosen[service.id] ?? service.variants[0].id)
                      )?.price ?? service.variants[0].price
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">{service.blurb}</p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">{panel.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSelectorSection;
