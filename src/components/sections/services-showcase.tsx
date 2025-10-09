"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/context";
import { Button } from "../ui/button";
import { MediaSkeleton } from "@/components/ui/media-skeleton";

type TabProps = {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

const ServiceTab = ({ title, description, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left p-6 transition-all duration-300 ease-in-out relative border-l-4",
      isActive ? "border-primary bg-light-red/50" : "border-gray-200 hover:bg-gray-50"
    )}
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

const ServicesShowcase = () => {
  const t = useTranslations("servicesShowcase");
  const heading = t<string>("heading");
  const description = t<string>("description");
  const cta = t<string>("cta");
  const tabs = t<{ title: string; description: string; image: string }[]>("tabs");
  const tabItems = tabs ?? [];
  const [activeTab, setActiveTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const total = tabItems.length;
  const hoverAreaRef = useRef<HTMLDivElement | null>(null);

  // Auto-rotate logic (pause-aware)
  useEffect(() => {
    if (paused || total === 0) return;
    const id = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % total);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  // Optional: reset ke tab pertama bila jumlah data berubah (defensif)
  useEffect(() => {
    if (activeTab >= total) setActiveTab(0);
  }, [total, activeTab]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-bold text-4xl md:text-5xl leading-tight text-foreground tracking-tight">{heading}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <Button asChild variant="secondary" size="lg" className="btn-secondary mt-6 hover:-translate-y-px">
            <Link
              href="/layanan"
            >
              <span>{cta}</span>
            </Link>
          </Button>
        </div>

        {/* Hovering area pauses auto-rotate */}
        <div
          ref={hoverAreaRef}
          className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24 items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex flex-col mb-12 lg:mb-0">
            {tabItems.map((tab, index) => (
              <ServiceTab
                key={index}
                title={tab.title}
                description={tab.description}
                isActive={activeTab === index}
                onClick={() => {
                  setActiveTab(index);
                  // jeda sejenak agar user bisa baca setelah klik manual (opsional)
                  setPaused(true);
                  setTimeout(() => setPaused(false), 1200);
                }}
              />
            ))}
          </div>

          <div className="relative w-full aspect-[640/423] overflow-hidden">
            {tabItems.map((tab, index) => {
              const isLoaded = loadedImages[index];
              const isActive = activeTab === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500 ease-in-out",
                    isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <MediaSkeleton isVisible={!isLoaded && isActive} className="rounded-xl" />
                  <Image
                    src={tab.image}
                    alt={tab.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority={index === 0}
                    onLoadingComplete={() =>
                      setLoadedImages((prev) => (prev[index] ? prev : { ...prev, [index]: true }))
                    }
                    className={cn(
                      "rounded-xl shadow-2xl object-cover absolute inset-0 transition-opacity duration-500 ease-in-out",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              );
            })}

            {/* Soft gradient overlay for smoother fade (opsional, feel free to remove) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/0 transition-opacity" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
