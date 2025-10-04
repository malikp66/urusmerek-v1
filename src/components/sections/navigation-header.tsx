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
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import gsap from "gsap";

const layananItems = [
  {
    title: "Pendaftaran Merek",
    href: "/layanan/pendaftaran-merek",
    description: "Amankan identitas brand Anda dengan pendaftaran merek resmi.",
    icon: "📝"
  },
  {
    title: "Perpanjangan Merek",
    href: "/layanan/perpanjangan-merek",
    description: "Perpanjang perlindungan merek Anda sebelum habis masa berlakunya.",
    icon: "🔄"
  },
  {
    title: "Pengalihan Hak Merek",
    href: "/layanan/pengalihan-hak",
    description: "Proses legal untuk memindahkan kepemilikan merek Anda.",
    icon: "📋"
  },
  {
    title: "Konsultasi HKI",
    href: "/layanan/konsultasi-hki",
    description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual.",
    icon: "💡"
  },
];

// Flag components as SVG for better quality
const IDFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="7.5" fill="#FF0000" />
    <rect y="7.5" width="20" height="7.5" fill="#FFFFFF" />
  </svg>
);

const ENFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="15" fill="#012169" />
    <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3" />
    <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="2" />
    <path d="M10 0V15M0 7.5H20" stroke="white" strokeWidth="5" />
    <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="3" />
  </svg>
);

export default function NavigationHeader() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState<"id" | "en">("id");
  const [isScrolled, setIsScrolled] = React.useState(false);

  const dropdownRootRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownItemsRef = React.useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const logoRef = React.useRef<HTMLAnchorElement | null>(null);

  const dropdownTl = React.useRef<gsap.core.Timeline | null>(null);
  const mobileTl = React.useRef<gsap.core.Timeline | null>(null);

  // Scroll detection for header style change
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logo hover animation
  React.useEffect(() => {
    if (!logoRef.current) return;

    const logo = logoRef.current;

    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    logo.addEventListener("mouseenter", handleMouseEnter);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      logo.removeEventListener("mouseenter", handleMouseEnter);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* --------------- Dropdown GSAP (desktop) --------------- */
  React.useEffect(() => {
    if (!dropdownRootRef.current || !dropdownItemsRef.current) return;

    dropdownTl.current = gsap.timeline({ paused: true })
      .set(dropdownRootRef.current, { autoAlpha: 1, pointerEvents: "auto" })
      .fromTo(
        dropdownRootRef.current,
        { y: -12, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" }
      )
      .fromTo(
        Array.from(dropdownItemsRef.current.children),
        { y: 8, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.25, ease: "power3.out" },
        "-=0.15"
      );

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

  /* --------------- Mobile drawer GSAP with overlay --------------- */
  React.useEffect(() => {
    if (!mobileDrawerRef.current || !overlayRef.current) return;

    gsap.set(mobileDrawerRef.current, {
      xPercent: 100,
      willChange: "transform",
      position: "fixed",
      right: 0
    });
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    mobileTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.3 }, 0)
      .to(mobileDrawerRef.current, {
        xPercent: 0,
        duration: 0.4,
        ease: "power3.out"
      }, 0)
      .fromTo(
        mobileDrawerRef.current.querySelectorAll(".mobile-link"),
        { x: -16, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.3 },
        "-=0.2"
      );

    return () => {
      mobileTl.current?.kill();
      mobileTl.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      mobileTl.current?.play();
    } else {
      mobileTl.current?.reverse();
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 400);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Language switcher with animation
  const handleLanguageSwitch = (lang: "id" | "en") => {
    setCurrentLang(lang);
    // Add a subtle feedback animation
    gsap.fromTo(
      ".lang-indicator",
      { scale: 1.2, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        style={{ display: isMobileOpen ? "block" : "none" }}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          isScrolled
            ? "border-border/60 bg-background/95 backdrop-blur-md shadow-md"
            : "border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with animation */}
            <Link
              ref={logoRef}
              href="/"
              className="text-xl font-bold text-primary inline-flex items-center gap-2 transition-colors hover:text-primary/90"
            >
              <span className="text-2xl">🏢</span>
              <span>urusmerek.id</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/beranda"
                className="text-sm font-medium transition-all hover:text-primary hover:scale-105 relative group"
              >
                Beranda
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>

              {/* Layanan dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  aria-expanded={isDropdownOpen}
                  className="flex items-center gap-1 text-sm font-medium transition-all hover:text-primary hover:scale-105 group"
                >
                  <span>Layanan</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown panel */}
                <div
                  ref={dropdownRootRef}
                  className="absolute left-1/2 top-full z-40 mt-3 -translate-x-1/2 w-[min(90vw,680px)] rounded-xl border border-border/40 bg-popover/95 backdrop-blur-sm p-5 shadow-2xl"
                  role="menu"
                  aria-hidden={!isDropdownOpen}
                  style={{ display: "block" }}
                >
                  <div ref={dropdownItemsRef} className="grid gap-3 md:grid-cols-2">
                    {layananItems.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="dropdown-item block rounded-lg p-4 hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{it.icon}</span>
                          <div>
                            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {it.title}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {it.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {["Harga", "Profil Perusahaan", "Mitra", "FAQ", "Hubungi Kami"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium transition-all hover:text-primary hover:scale-105 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Language switcher with flags */}
              <div className="hidden md:flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
                <button
                  onClick={() => handleLanguageSwitch("id")}
                  className={cn(
                    "lang-indicator flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    currentLang === "id"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Bahasa Indonesia"
                >
                  <IDFlag />
                  <span>ID</span>
                </button>
                <button
                  onClick={() => handleLanguageSwitch("en")}
                  className={cn(
                    "lang-indicator flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    currentLang === "en"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="English"
                >
                  <ENFlag />
                  <span>EN</span>
                </button>
              </div>

              {/* CTA button with icon */}
              <button className="hidden lg:inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-all active:scale-95">
                <Phone className="h-4 w-4" />
                Konsultasi Gratis
              </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-all active:scale-95"
                aria-label="Toggle menu"
                onClick={() => setIsMobileOpen((s) => !s)}
              >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <aside
        ref={mobileDrawerRef}
        className="fixed top-0 right-0 z-50 h-full w-[86vw] max-w-[420px] bg-background border-l border-border/40 shadow-2xl overflow-y-auto"
        aria-hidden={!isMobileOpen}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/40 bg-secondary/30">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="text-lg font-bold text-primary inline-flex items-center gap-2"
          >
            <span className="text-xl">🏢</span>
            <span>urusmerek.id</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg hover:bg-secondary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-6 flex flex-col gap-4">
          <Link
            href="/beranda"
            className="mobile-link text-base font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
            onClick={() => setIsMobileOpen(false)}
          >
            Beranda
          </Link>

          <details className="mobile-link group">
            <summary className="cursor-pointer font-medium px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors list-none flex items-center justify-between">
              <span>Layanan</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 flex flex-col gap-1 pl-3 border-l-2 border-primary/20 ml-3">
              {layananItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary/30"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="text-lg">{it.icon}</span>
                  <span>{it.title}</span>
                </Link>
              ))}
            </div>
          </details>

          {["Harga", "Profil Perusahaan", "Mitra", "FAQ", "Hubungi Kami"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, "-")}`}
              className="mobile-link text-base font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
              onClick={() => setIsMobileOpen(false)}
            >
              {item}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="mobile-link mt-4 px-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Bahasa / Language</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageSwitch("id")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  currentLang === "id"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <IDFlag />
                <span>Indonesia</span>
              </button>
              <button
                onClick={() => handleLanguageSwitch("en")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  currentLang === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <ENFlag />
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="mobile-link mt-6 px-3">
            <button
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-white font-medium shadow-md hover:bg-red-700 transition-all active:scale-95"
              onClick={() => setIsMobileOpen(false)}
            >
              <Phone className="h-4 w-4" />
              Konsultasi Gratis
            </button>
          </div>

          {/* Contact info */}
          <div className="mobile-link mt-4 px-3 py-4 rounded-lg bg-secondary/30 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-3">HUBUNGI KAMI</p>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>+62 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>info@urusmerek.id</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}