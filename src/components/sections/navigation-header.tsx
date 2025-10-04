"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import gsap from "gsap";

const layananItems = [
  { title: "Pendaftaran Merek", href: "/layanan/pendaftaran-merek", description: "Amankan identitas brand Anda dengan pendaftaran merek resmi." },
  { title: "Perpanjangan Merek", href: "/layanan/perpanjangan-merek", description: "Perpanjang perlindungan merek Anda sebelum habis masa berlakunya." },
  { title: "Pengalihan Hak Merek", href: "/layanan/pengalihan-hak", description: "Proses legal untuk memindahkan kepemilikan merek Anda." },
  { title: "Konsultasi HKI", href: "/layanan/konsultasi-hki", description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual." },
];

export default function NavigationHeader() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const dropdownRootRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownItemsRef = React.useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = React.useRef<HTMLDivElement | null>(null);

  // prepare GSAP timelines (create once)
  const dropdownTl = React.useRef<gsap.core.Timeline | null>(null);
  const mobileTl = React.useRef<gsap.core.Timeline | null>(null);

  /* --------------- Dropdown GSAP (desktop) --------------- */
  React.useEffect(() => {
    if (!dropdownRootRef.current || !dropdownItemsRef.current) return;

    dropdownTl.current = gsap.timeline({ paused: true })
      .set(dropdownRootRef.current, { autoAlpha: 1, pointerEvents: "auto" }) // make visible for animation
      .fromTo(dropdownRootRef.current, { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.20, ease: "power2.out" })
      .fromTo(Array.from(dropdownItemsRef.current.children), { y: 6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.22, ease: "power3.out" }, "-=0.12");

    // hide initially so it can't affect layout
    gsap.set(dropdownRootRef.current, { autoAlpha: 0, pointerEvents: "none" });

    return () => {
      dropdownTl.current?.kill();
      dropdownTl.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!dropdownTl.current || !dropdownRootRef.current) return;
    if (isDropdownOpen) {
      dropdownTl.current.play();
    } else {
      dropdownTl.current.reverse();
    }
  }, [isDropdownOpen]);

  /* --------------- Mobile drawer GSAP --------------- */
  React.useEffect(() => {
    if (!mobileDrawerRef.current) return;

    // initialize off-screen (translateX(100%)) so it doesn't create overflow
    gsap.set(mobileDrawerRef.current, { xPercent: 100, willChange: "transform", position: "fixed", right: 0 });

    mobileTl.current = gsap.timeline({ paused: true })
      .to(mobileDrawerRef.current, { xPercent: 0, duration: 0.38, ease: "power3.out" })
      .fromTo(mobileDrawerRef.current.querySelectorAll(".mobile-link"), { x: -12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.04, duration: 0.25 }, "-=0.2");

    return () => {
      mobileTl.current?.kill();
      mobileTl.current = null;
    };
  }, []);

  React.useEffect(() => {
    // lock body scroll when mobile menu opens (prevent background horizontal shift)
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";
      mobileTl.current?.play();
    } else {
      // revert styles
      mobileTl.current?.reverse();
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
    };
  }, [isMobileOpen]);

  /* safety: prevent any horizontal overflow from header wrapper */
  const headerWrapperClasses = "overflow-x-hidden";

  return (
    <header className={cn("sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60", headerWrapperClasses)}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* logo */}
          <Link href="/" className="text-xl font-bold text-primary">urusmerek.id</Link>

          {/* desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/beranda" className="text-sm hover:text-primary">Beranda</Link>

            {/* layanan dropdown trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onFocus={() => setIsDropdownOpen(true)}
            >
              <button aria-expanded={isDropdownOpen} className="flex items-center gap-1 text-sm hover:text-primary">
                <span>Layanan</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* dropdown panel - absolute & centered, limited width */}
              <div
                ref={dropdownRootRef}
                // important: keep pointer-events none by default until opened by GSAP (set by timeline)
                className="absolute left-1/2 top-full z-40 mt-3 -translate-x-1/2 w-[min(90vw,640px)] rounded-lg border border-border/40 bg-popover p-4 shadow-lg box-border"
                role="menu"
                aria-hidden={!isDropdownOpen}
                style={{ display: "block" }} // kept as block; GSAP hides/shows via autoAlpha
              >
                <div ref={dropdownItemsRef} className="grid gap-3 md:grid-cols-2">
                  {layananItems.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className="dropdown-item block rounded-md p-3 hover:bg-accent/10 focus:outline-none"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="text-sm font-semibold text-foreground">{it.title}</div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{it.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/harga" className="text-sm hover:text-primary">Harga</Link>
            <Link href="/profil-perusahaan" className="text-sm hover:text-primary">Profil Perusahaan</Link>
            <Link href="/mitra" className="text-sm hover:text-primary">Mitra</Link>
            <Link href="/faq" className="text-sm hover:text-primary">FAQ</Link>
            <Link href="/hubungi-kami" className="text-sm hover:text-primary">Hubungi Kami</Link>
          </nav>

          {/* right actions */}
          <div className="flex items-center gap-3">
            {/* language switcher placeholder (small) */}
            <div className="hidden md:flex items-center gap-2">
              <button className="px-2 py-1 rounded-md text-sm">🇮🇩</button>
              <button className="px-2 py-1 rounded-md text-sm">EN</button>
            </div>

            {/* konsultasi button visible on large */}
            <button className="hidden lg:inline-flex rounded-md bg-red-600 px-3 py-1 text-white">Konsultasi Gratis</button>

            {/* mobile menu button */}
            <button className="lg:hidden p-2 rounded-md" aria-label="Open menu" onClick={() => setIsMobileOpen((s) => !s)}>
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile drawer (fixed off-canvas) */}
      <aside
        ref={mobileDrawerRef}
        className="fixed top-0 right-0 z-50 h-full w-[86vw] max-w-[420px] bg-background border-l border-border/40 shadow-2xl"
        aria-hidden={!isMobileOpen}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" onClick={() => setIsMobileOpen(false)} className="text-lg font-bold text-primary">urusmerek.id</Link>
          <button onClick={() => setIsMobileOpen(false)} aria-label="Close" className="p-2"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-4 py-6 flex flex-col gap-4">
          <Link href="/beranda" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>Beranda</Link>

          <details className="mobile-link">
            <summary className="cursor-pointer font-medium">Layanan</summary>
            <div className="mt-3 flex flex-col gap-2 pl-3">
              {layananItems.map((it) => (
                <Link key={it.href} href={it.href} className="text-sm text-muted-foreground" onClick={() => setIsMobileOpen(false)}>{it.title}</Link>
              ))}
            </div>
          </details>

          <Link href="/harga" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>Harga</Link>
          <Link href="/profil-perusahaan" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>Profil Perusahaan</Link>
          <Link href="/mitra" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>Mitra</Link>
          <Link href="/faq" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>FAQ</Link>
          <Link href="/hubungi-kami" className="mobile-link text-base" onClick={() => setIsMobileOpen(false)}>Hubungi Kami</Link>

          <div className="mt-6">
            <button className="w-full rounded-md bg-red-600 py-2 text-white" onClick={() => setIsMobileOpen(false)}>Konsultasi Gratis</button>
          </div>
        </div>
      </aside>
    </header>
  );
}
