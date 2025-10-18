"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  MessageSquareText,
  Search,
  icons,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconName = keyof typeof icons;

type FaqItem = {
  value: string;
  question: string;
  answer: ReactNode;
  keywords?: string[];
};

type FaqCategory = {
  id: string;
  title: string;
  summary?: string;
  icon: IconName;
  accent?: {
    gradient?: string;
    icon?: string;
  };
  items: FaqItem[];
};

type ContactChannel = {
  label: string;
  value: string;
  helper?: string;
  href?: string;
};

type FaqSectionProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  heading?: string;
  description?: string;
  categories?: FaqCategory[];
  cta?: {
    label: string;
    href: string;
  };
  search?:
    | boolean
    | {
        placeholder?: string;
        emptyMessage?: string;
      };
  showContactCard?: boolean;
  contactChannels?: ContactChannel[];
};

const defaultContactChannels: ContactChannel[] = [
  {
    label: "WhatsApp",
    value: "62822 6789 0152",
    helper: "Respon cepat < 5 menit pada jam kerja",
    href: "https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0",
  },
  {
    label: "Email",
    value: "yessikurniawan@urusmerek.id",
    helper: "Penanganan dokumen dan tindak lanjut resmi",
    href: "mailto:yessikurniawan@urusmerek.id",
  },
  {
    label: "Jam Layanan",
    value: "Senin-Jumat, 09.00-17.00 WIB",
    helper: "Reservasi di luar jam kerja akan kami balas keesokan harinya",
  },
];

const defaultSearchEmptyMessage =
  "Tidak ditemukan jawaban yang cocok. Coba gunakan kata kunci lain atau hubungi tim kami.";

const defaultAccent = {
  gradient: "from-rose-100/70 via-white/80 to-transparent",
  icon: "bg-rose-100/80 text-rose-500",
};

const FaqSection = ({
  id,
  className,
  eyebrow,
  title,
  heading,
  description,
  categories,
  cta,
  search,
  showContactCard = true,
  contactChannels,
}: FaqSectionProps) => {
  const sectionTitle =
    title ?? heading ?? "Pertanyaan yang sering diajukan tentang Urus Merek";
  const resolvedCategories = categories ?? [];
  const useSearch = Boolean(search);
  const searchConfig =
    typeof search === "object" ? search : { placeholder: undefined };

  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return resolvedCategories;
    }

    return resolvedCategories
      .map((category) => {
        const matchedItems = category.items.filter((item) => {
          const haystack = [
            item.question,
            ...(item.keywords ?? []),
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        });

        if (matchedItems.length === 0) {
          return null;
        }

        return {
          ...category,
          items: matchedItems,
        };
      })
      .filter((category): category is FaqCategory => Boolean(category));
  }, [normalizedQuery, resolvedCategories]);

  const categoriesToRender =
    normalizedQuery && useSearch ? filteredCategories : resolvedCategories;
  const hasResults =
    categoriesToRender.length > 0 &&
    categoriesToRender.some((category) => category.items.length > 0);

  const emptyMessage =
    (typeof search === "object" && search?.emptyMessage) ||
    defaultSearchEmptyMessage;

  const channels = contactChannels ?? defaultContactChannels;

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 sm:py-28",
        "before:absolute before:left-1/2 before:top-0 before:-z-10 before:size-[520px] before:-translate-x-1/2 before:bg-[radial-gradient(circle,_rgba(248,208,215,0.28),_transparent_65%)]",
        "after:absolute after:bottom-[-30%] after:left-[10%] after:-z-10 after:size-[480px] after:bg-[radial-gradient(circle,_rgba(253,230,138,0.16),_transparent_70%)]",
        className,
      )}
    >
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-white/60 bg-white/85 p-8 shadow-[0_28px_60px_-42px_rgba(220,38,38,0.45)] backdrop-blur-xl sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-4">
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary/70">
                  {eyebrow}
                </span>
              ) : null}
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
                  {sectionTitle}
                </h2>
                {description ? (
                  <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {description}
                  </p>
                ) : null}
              </div>
              {cta ? (
                <Button
                  asChild
                  size="lg"
                  className="w-fit rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ) : null}
            </div>

            {useSearch ? (
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-muted-foreground/70">
                  <Search className="size-5" aria-hidden="true" />
                </div>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    searchConfig.placeholder ?? "Cari topik: biaya, timeline, dsb."
                  }
                  className={cn(
                    "h-14 rounded-2xl border border-primary/20 bg-white/80 pl-12 pr-4 text-base shadow-inner shadow-primary/5",
                    "focus-visible:border-primary focus-visible:ring-primary/30",
                  )}
                />
              </div>
            ) : null}
          </div>

          {useSearch && normalizedQuery && !hasResults ? (
            <div className="mt-10 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center text-sm text-muted-foreground sm:text-base">
              {emptyMessage}
            </div>
          ) : null}

          <div className="mt-12 space-y-10">
            {categoriesToRender.map((category, categoryIndex) => {
              if (category.items.length === 0) {
                return null;
              }

              const Icon = icons[category.icon] ?? HelpCircle;
              const gradient = category.accent?.gradient ?? defaultAccent.gradient;
              const iconAccent = category.accent?.icon ?? defaultAccent.icon;

              return (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-[36px] border border-primary/10 bg-white/90 shadow-[0_14px_34px_-22px_rgba(220,38,38,0.3)] backdrop-blur"
                >
                  <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-12">
                    <div className="relative max-w-sm flex-1 space-y-5">
                      <div
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br opacity-90 transition duration-500 group-hover:opacity-100",
                          gradient,
                        )}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-white/75" />
                      <div className="relative flex items-center gap-4">
                        <span
                          className={cn(
                            "flex size-12 items-center justify-center rounded-2xl transition duration-500 group-hover:scale-105",
                            iconAccent,
                          )}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/60">
                          {String(categoryIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="relative space-y-3 pt-4">
                        <h3 className="text-2xl font-semibold text-foreground">
                          {category.title}
                        </h3>
                        {category.summary ? (
                          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {category.summary}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex-1">
                      <Accordion
                        type="multiple"
                        className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-inner shadow-primary/10"
                      >
                        {category.items.map((item) => (
                          <AccordionItem
                            key={item.value}
                            value={item.value}
                            className="group/accordion border-b border-white/60 last:border-b-0 transition-colors duration-300 data-[state=open]:border-primary/20"
                          >
                            <AccordionTrigger className="p-6 text-left text-base font-semibold text-foreground transition-colors hover:no-underline data-[state=open]:text-primary sm:text-lg">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                              <div className="space-y-4 px-6 [&_p]:leading-relaxed">
                                {item.answer}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showContactCard ? (
            <div className="mt-12 relative overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-xl shadow-primary/15 backdrop-blur-xl sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.18),transparent_55%)]"
              />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 lg:flex-1">
                  <div className="flex items-start gap-4">
                    <span className="flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                      <MessageSquareText className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/70 sm:text-sm">
                        Masih butuh panduan?
                      </p>
                      <h4 className="mt-1 text-2xl font-semibold text-foreground">
                        Terhubung langsung dengan Ahli Merek kami
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        Konsultasi cepat untuk menentukan strategi pendaftaran,
                        perpanjangan, atau program kemitraan yang paling sesuai.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3 sm:text-base">
                  {channels.map((channel) => (
                    <div
                      key={`${channel.label}-${channel.value}`}
                      className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">
                        {channel.label}
                      </p>
                      {channel.href ? (
                        <Link
                          href={channel.href}
                          className="mt-2 block font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {channel.value}
                        </Link>
                      ) : (
                        <p className="mt-2 font-semibold text-foreground">
                          {channel.value}
                        </p>
                      )}
                      {channel.helper ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {channel.helper}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
export type { FaqCategory, FaqItem, FaqSectionProps, ContactChannel };
