"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/context";
import { Button } from "../ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { gsap } from "gsap";

type TabProps = {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
};

const ServiceTab = ({ title, description, isActive, onClick, onHover }: TabProps) => (
  <button
    onClick={onClick}
    onMouseEnter={onHover}
    className={cn(
      "w-full text-left rounded-xl border-l-4 p-4 transition-all duration-300 ease-in-out sm:p-6",
      isActive ? "border-primary bg-light-red/50" : "border-gray-200 hover:bg-gray-50"
    )}
    data-service-step
    style={{
      backgroundColor: isActive ? "rgba(247, 245, 255, 0)" : "",
    }}
  >
    <h3
      className={cn(
        "text-xl font-bold transition-colors duration-300",
        isActive ? "text-primary" : "text-foreground"
      )}
    >
      {title}
    </h3>
    <p className="mt-1 text-base text-muted-foreground">{description}</p>
  </button>
);

const AUTO_MS = 3000;
const VISIBLE_COUNT = 3;
const PAUSE_MS = 3000; // berhenti 3 detik saat klik / hover

const ServicesShowcase = () => {
  const t = useTranslations("servicesShowcase");
  const heading = t<string>("heading");
  const eyebrow = t<string>("eyebrow");
  const description = t<string>("description");
  const cta = t<string>("cta");
  const tabs = t<{ title: string; description: string; image: string }[]>("tabs");
  const tabItems = tabs ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [windowStart, setWindowStart] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = tabItems.length;
  const visibleCount = Math.min(VISIBLE_COUNT, total || 0);
  const maxStart = Math.max(total - visibleCount, 0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto rotate tapi berhenti sementara saat paused = true
  useEffect(() => {
    if (paused || total <= visibleCount) return;
    const id = setInterval(() => {
      setWindowStart((prev) => (prev >= maxStart ? 0 : prev + 1));
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, total, visibleCount, maxStart]);

  // Reset windowStart jika keluar range
  useEffect(() => {
    if (windowStart > maxStart) setWindowStart(0);
  }, [maxStart, windowStart]);

  // Pastikan activeIndex tetap di dalam window
  useEffect(() => {
    if (visibleCount === 0) return;
    if (activeIndex < windowStart || activeIndex >= windowStart + visibleCount) {
      setActiveIndex(windowStart);
    }
  }, [activeIndex, windowStart, visibleCount]);

  // GSAP animasi fade untuk daftar tab
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-service-step]");
    if (!items.length) return;
    gsap.killTweensOf(items);
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }
    );
  }, [windowStart, visibleCount, total]);

  // Animasi fade untuk gambar
  useEffect(() => {
    if (!imageWrapperRef.current) return;
    gsap.killTweensOf(imageWrapperRef.current);
    gsap.fromTo(
      imageWrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, [activeIndex]);

  const handlePause = () => {
    setPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setPaused(false);
    }, PAUSE_MS);
  };

  const visibleTabs =
    visibleCount > 0 ? tabItems.slice(windowStart, windowStart + visibleCount) : [];
  const activeItem = tabItems[activeIndex];

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="text-base eyebrow font-semibold text-primary">{eyebrow}</span>
          <h2 className="font-bold text-4xl md:text-5xl leading-tight text-foreground tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="btn-secondary mt-6 w-full justify-center hover:-translate-y-px sm:w-auto"
          >
            <Link href="/layanan">
              <span>{cta}</span>
            </Link>
          </Button>
        </div>

        <div className="relative grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
          <div ref={listRef} className="mb-12 flex flex-col gap-4 lg:mb-0">
            {visibleTabs.map((tab, index) => {
              const globalIndex = windowStart + index;
              const isLastInWindow = index === visibleCount - 1;

              const handleClick = () => {
                handlePause(); // stop 3 detik
                setActiveIndex(globalIndex);
                if (isLastInWindow && windowStart < maxStart) {
                  setWindowStart((prev) => Math.min(prev + 1, maxStart));
                }
              };

              const handleHover = () => {
                handlePause(); // stop 3 detik
                setActiveIndex(globalIndex);
              };

              return (
                <ServiceTab
                  key={globalIndex}
                  title={tab.title}
                  description={tab.description}
                  isActive={activeIndex === globalIndex}
                  onClick={handleClick}
                  onHover={handleHover}
                />
              );
            })}
            {total === 0 && (
              <div className="p-6 border-l-4 border-gray-200">
                <p className="text-muted-foreground">Data layanan belum tersedia.</p>
              </div>
            )}
          </div>

          <div
            ref={imageWrapperRef}
            className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px] overflow-hidden rounded-xl flex items-center justify-center"
          >
            {activeItem ? (
              <div className="relative">
                <SafeImage
                  key={activeItem.image}
                  src={activeItem.image}
                  alt={activeItem.title}
                  width={400}
                  height={200}
                  className="object-contain rounded-xl"
                  containerClassName="flex items-center justify-center"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-xl bg-muted" />
            )}

            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-black/0 via-black/0 to-black/0" />
          </div>

          <div
            className="animate-pulse-slow absolute -right-32 top-10 hidden h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl lg:block"
            style={{ animationDelay: "1s" }}
          />

          <div
            className="animate-pulse-slow absolute -left-32 bottom-6 hidden h-96 w-96 rounded-full bg-[#DC2626]/15 blur-3xl lg:block"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
