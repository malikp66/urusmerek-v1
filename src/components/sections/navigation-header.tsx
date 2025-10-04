"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, Search } from "lucide-react";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

/**
 * NavigationHeader (GSAP-powered)
 *
 * - Animations: GSAP timelines for logo, layanan dropdown, layanan item stagger,
 *   and mobile sheet animation.
 * - Accessibility: aria attributes and keyboard handling for dropdown (Escape to close).
 * - Next Link usage: uses <Link className="..."> (no nested <a>).
 *
 * Paste this file as e.g. `components/NavigationHeader.tsx`
 */

/* ---------- data ---------- */
const layananItems: { title: string; href: string; description: string }[] = [
  {
    title: "Pendaftaran Merek",
    href: "/layanan/pendaftaran-merek",
    description: "Amankan identitas brand Anda dengan pendaftaran merek resmi.",
  },
  {
    title: "Perpanjangan Merek",
    href: "/layanan/perpanjangan-merek",
    description: "Jaga keberlangsungan proteksi merek Anda yang akan berakhir.",
  },
  {
    title: "Pengalihan Hak Merek",
    href: "/layanan/pengalihan-hak",
    description: "Proses legal untuk memindahkan kepemilikan merek Anda.",
  },
  {
    title: "Konsultasi HKI",
    href: "/layanan/konsultasi-hki",
    description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual.",
  },
];

/* ---------- component ---------- */
export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLayananOpen, setIsLayananOpen] = React.useState(false);

  // refs for GSAP
  const logoRef = React.useRef<HTMLDivElement | null>(null);
  const layananPanelRef = React.useRef<HTMLDivElement | null>(null);
  const layananItemsRef = React.useRef<HTMLDivElement | null>(null);
  const mobileSheetRef = React.useRef<HTMLDivElement | null>(null);
  const menuBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const layananToggleRef = React.useRef<HTMLButtonElement | null>(null);

  // GSAP timelines stored in refs to persist across renders
  const logoTl = React.useRef<gsap.core.Timeline | null>(null);
  const layananTl = React.useRef<gsap.core.Timeline | null>(null);
  const mobileTl = React.useRef<gsap.core.Timeline | null>(null);

  /* ---------- logo animation on mount ---------- */
  React.useEffect(() => {
    if (!logoRef.current) return;
    logoTl.current = gsap.timeline();
    logoTl.current.fromTo(
      logoRef.current,
      { scale: 0.98, y: -4, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
    );
    // subtle pulse once
    logoTl.current.to(logoRef.current, { scale: 1.02, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, "+=0.15");
    return () => {
      logoTl.current?.kill();
      logoTl.current = null;
    };
  }, []);

  /* ---------- layanan dropdown timeline (desktop) ---------- */
  React.useEffect(() => {
    if (!layananPanelRef.current || !layananItemsRef.current) return;

    // build timeline (paused)
    layananTl.current = gsap.timeline({ paused: true });
    layananTl.current
      .set(layananPanelRef.current, { autoAlpha: 0, y: -8, display: "block" })
      .to(layananPanelRef.current, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" })
      .fromTo(
        layananItemsRef.current?.children || [],
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04, ease: "power3.out" },
        "-=0.12"
      );

    return () => {
      layananTl.current?.kill();
      layananTl.current = null;
    };
  }, []);

  /* ---------- mobile sheet timeline ---------- */
  React.useEffect(() => {
    if (!mobileSheetRef.current) return;
    mobileTl.current = gsap.timeline({ paused: true });
    // sheetRef points to the sheet content root; animate from right
    mobileTl.current.fromTo(
      mobileSheetRef.current,
      { xPercent: 12, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" }
    );
    return () => {
      mobileTl.current?.kill();
      mobileTl.current = null;
    };
  }, []);

  /* ---------- toggle layanan (desktop) ---------- */
  React.useEffect(() => {
    // open / close layanan via timeline
    if (!layananTl.current) return;
    if (isLayananOpen) {
      layananTl.current.play();
      // rotate chevron quickly
      gsap.to(layananToggleRef.current, { rotate: 180, duration: 0.18, transformOrigin: "50% 50%" });
    } else {
      layananTl.current.reverse();
      gsap.to(layananToggleRef.current, { rotate: 0, duration: 0.16, transformOrigin: "50% 50%" });
    }
  }, [isLayananOpen]);

  /* ---------- toggle mobile sheet ---------- */
  React.useEffect(() => {
    if (!mobileTl.current) return;
    if (isMobileMenuOpen) {
      mobileTl.current.play();
      // animate menu button (to X)
      gsap.to(menuBtnRef.current, { rotate: 90, duration: 0.18 });
    } else {
      mobileTl.current.reverse();
      gsap.to(menuBtnRef.current, { rotate: 0, duration: 0.12 });
    }
  }, [isMobileMenuOpen]);

  /* ---------- keyboard escape handling for layanan & mobile ---------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLayananOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- helper to close layanan with small delay on mouseleave ---------- */
  const layananTimeout = React.useRef<number | null>(null);
  const openLayanan = () => {
    if (layananTimeout.current) window.clearTimeout(layananTimeout.current);
    setIsLayananOpen(true);
  };
  const closeLayanan = () => {
    layananTimeout.current = window.setTimeout(() => setIsLayananOpen(false), 120);
  };

  /* ---------- render ---------- */
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* LEFT: logo + primary nav */}
        <div className="flex items-center gap-6">
          <div ref={logoRef} className="flex items-baseline gap-1">
            <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-extrabold text-primary">UrusMerek</span>
              <span className="text-xl font-extrabold text-foreground">.id</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            <Link href="/beranda" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors focus:outline-none focus:ring-2">Beranda</Link>

            {/* layanan dropdown */}
            <div
              className="relative"
              onMouseEnter={openLayanan}
              onFocus={openLayanan}
              onMouseLeave={closeLayanan}
            >
              <button
                ref={layananToggleRef}
                aria-expanded={isLayananOpen}
                aria-controls="layanan-panel"
                onClick={() => setIsLayananOpen((s) => !s)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors focus:outline-none focus:ring-2"
              >
                <span>Layanan</span>
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>

              {/* dropdown panel (animated w/ GSAP) */}
              <div
                id="layanan-panel"
                ref={layananPanelRef}
                className={cn(
                  "absolute left-0 top-full mt-2 w-[520px] rounded-lg border border-border/40 bg-popover p-4 shadow-lg",
                  // keep display none initially to avoid flicker
                  !isLayananOpen && "pointer-events-none"
                )}
                role="menu"
                onMouseEnter={openLayanan}
                onMouseLeave={closeLayanan}
              >
                <div ref={layananItemsRef} className="grid gap-3 md:grid-cols-2">
                  {layananItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md p-3 hover:bg-accent/10 transition-all hover:shadow-sm focus:outline-none"
                      role="menuitem"
                      onClick={() => setIsLayananOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold leading-none text-foreground">{item.title}</div>
                        <span className="text-xs text-muted-foreground">Selengkapnya →</span>
                      </div>
                      <p className="mt-1 text-sm line-clamp-2 text-muted-foreground">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/harga" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors">Harga</Link>
            <Link href="/profil-perusahaan" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors">Profil Perusahaan</Link>
            <Link href="/mitra" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors">Mitra</Link>
            <Link href="/faq" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors">FAQ</Link>
            <Link href="/hubungi-kami" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/30 transition-colors">Hubungi Kami</Link>
          </nav>
        </div>

        {/* RIGHT: actions + mobile */}
        <div className="flex items-center gap-2">
          <button aria-label="Cari" className="hidden sm:flex items-center justify-center rounded-md p-2 hover:bg-accent/30 transition-colors focus:outline-none focus:ring-2">
            <Search className="h-4 w-4" />
          </button>

          <Button className="hidden lg:inline-flex rounded-md relative overflow-hidden">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Konsultasi Gratis
            </span>
            <span className="ml-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">Gratis</span>
          </Button>

          {/* Mobile sheet trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button
                ref={menuBtnRef}
                aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="rounded-md p-2 hover:bg-accent/30 transition-colors focus:outline-none"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{isMobileMenuOpen ? "Tutup menu" : "Buka menu"}</span>
              </button>
            </SheetTrigger>

            {/* We attach a ref to the SheetContent root for GSAP animation */}
            <SheetContent side="right" className="w-[300px] sm:w-[360px]" asChild>
              {/* Using a wrapper div to get a stable ref target */}
              <div ref={mobileSheetRef} className="h-full flex flex-col">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="text-lg font-extrabold text-primary">UrusMerek</span>
                      <span className="text-lg font-extrabold text-foreground">.id</span>
                    </Link>
                    <button aria-label="Tutup menu" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md p-2 hover:bg-accent/30 transition-colors focus:outline-none">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </SheetHeader>

                <div className="flex h-full flex-col py-6 px-4">
                  <MobileNav onLinkClick={() => setIsMobileMenuOpen(false)} />
                  <Button className="mt-auto rounded-md">Konsultasi Gratis</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ---------- MobileNav component ---------- */
const MobileNav: React.FC<{ onLinkClick: () => void }> = ({ onLinkClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const itemsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  React.useEffect(() => {
    // build timeline for the expand/collapse of layanan list (mobile)
    if (!itemsContainerRef.current) return;
    tlRef.current = gsap.timeline({ paused: true });
    tlRef.current.fromTo(
      itemsContainerRef.current,
      { height: 0, autoAlpha: 0 },
      { height: "auto", autoAlpha: 1, duration: 0.24, ease: "power2.out" }
    );
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) tlRef.current.play();
    else tlRef.current.reverse();
  }, [isOpen]);

  return (
    <nav className="flex flex-col gap-4 text-sm font-medium text-foreground" aria-label="Mobile">
      <Link href="/beranda" className="block" onClick={onLinkClick}>Beranda</Link>

      <div className="flex flex-col">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
        >
          <span className="font-medium">Layanan</span>
          <ChevronDown className="h-4 w-4" style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }} />
        </button>

        <div ref={itemsContainerRef} className="mt-2 flex flex-col gap-2 pl-4 border-l-2 ml-1 overflow-hidden">
          {layananItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground block" onClick={onLinkClick}>
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/harga" className="block" onClick={onLinkClick}>Harga</Link>
      <Link href="/profil-perusahaan" className="block" onClick={onLinkClick}>Profil Perusahaan</Link>
      <Link href="/mitra" className="block" onClick={onLinkClick}>Mitra</Link>
      <Link href="/faq" className="block" onClick={onLinkClick}>FAQ</Link>
      <Link href="/hubungi-kami" className="block" onClick={onLinkClick}>Hubungi Kami</Link>
    </nav>
  );
};
