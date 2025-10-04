"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import gsap from "gsap";

const layananItems = [
  {
    title: "Pendaftaran Merek",
    href: "/layanan/pendaftaran-merek",
    description: "Amankan identitas brand Anda dengan pendaftaran merek resmi."
  },
  {
    title: "Perpanjangan Merek",
    href: "/layanan/perpanjangan-merek",
    description: "Perpanjang perlindungan merek Anda sebelum habis masa berlakunya."
  },
  {
    title: "Pengalihan Hak Merek",
    href: "/layanan/pengalihan-hak",
    description: "Proses legal untuk memindahkan kepemilikan merek Anda."
  },
  {
    title: "Konsultasi HKI",
    href: "/layanan/konsultasi-hki",
    description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual."
  },
];

// Simple SVG Flag Components
const IDFlag = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
    <rect width="24" height="9" fill="#FF0000" rx="2" />
    <rect y="9" width="24" height="9" fill="#FFFFFF" rx="2" />
  </svg>
);

const ENFlag = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
    <rect width="24" height="18" fill="#012169" rx="2" />
    <path d="M0 0L24 18M24 0L0 18" stroke="white" strokeWidth="3" />
    <path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="2" />
    <path d="M12 0V18M0 9H24" stroke="white" strokeWidth="5" />
    <path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="3" />
  </svg>
);

export default function NavigationHeader() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState<"id" | "en">("id");

  const dropdownRootRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownItemsRef = React.useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const dropdownTl = React.useRef<gsap.core.Timeline | null>(null);
  const mobileTl = React.useRef<gsap.core.Timeline | null>(null);

  /* --------------- Dropdown GSAP --------------- */
  React.useEffect(() => {
    if (!dropdownRootRef.current || !dropdownItemsRef.current) return;

    dropdownTl.current = gsap.timeline({ paused: true })
      .set(dropdownRootRef.current, { autoAlpha: 1, pointerEvents: "auto" })
      .fromTo(
        dropdownRootRef.current,
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.2, ease: "power2.out" }
      )
      .fromTo(
        Array.from(dropdownItemsRef.current.children),
        { y: 8, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.2, ease: "power2.out" },
        "-=0.1"
      );

    gsap.set(dropdownRootRef.current, { autoAlpha: 0, pointerEvents: "none" });

    return () => {
      dropdownTl.current?.kill();
    };
  }, []);

  React.useEffect(() => {
    if (!dropdownTl.current) return;
    if (isDropdownOpen) {
      dropdownTl.current.play();
    } else {
      dropdownTl.current.reverse();
    }
  }, [isDropdownOpen]);

  /* --------------- Mobile drawer GSAP --------------- */
  React.useEffect(() => {
    if (!mobileDrawerRef.current || !overlayRef.current) return;

    gsap.set(mobileDrawerRef.current, { xPercent: 100 });
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    mobileTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.3 }, 0)
      .to(mobileDrawerRef.current, { xPercent: 0, duration: 0.35, ease: "power3.out" }, 0)
      .fromTo(
        mobileDrawerRef.current.querySelectorAll(".mobile-link"),
        { x: -12, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, stagger: 0.04, duration: 0.25 },
        "-=0.15"
      );

    return () => {
      mobileTl.current?.kill();
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
      }, 350);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        style={{ display: isMobileOpen ? "block" : "none" }}
        onClick={() => setIsMobileOpen(false)}
      />

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
                🏢
              </div>
              <span className="text-xl font-bold text-red-600">urusmerek.id</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/beranda" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Beranda
              </Link>

              {/* Layanan Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Layanan
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Panel */}
                <div
                  ref={dropdownRootRef}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[580px] bg-white rounded-lg border border-gray-200 shadow-xl p-4"
                  style={{ display: "block" }}
                >
                  <div ref={dropdownItemsRef} className="grid grid-cols-2 gap-2">
                    {layananItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block p-3 rounded-md hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/harga" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Harga
              </Link>
              <Link href="/profil-perusahaan" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Profil Perusahaan
              </Link>
              <Link href="/mitra" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Mitra
              </Link>
              <Link href="/faq" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                FAQ
              </Link>
              <Link href="/hubungi-kami" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Hubungi Kami
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setCurrentLang("id")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    currentLang === "id"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <IDFlag />
                  ID
                </button>
                <button
                  onClick={() => setCurrentLang("en")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    currentLang === "en"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <ENFlag />
                  EN
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <aside
        ref={mobileDrawerRef}
        className="fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl overflow-y-auto"
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-white text-xs">
              🏢
            </div>
            <span className="text-lg font-bold text-red-600">urusmerek.id</span>
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-1">
          <Link
            href="/beranda"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            Beranda
          </Link>

          <details className="mobile-link">
            <summary className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer list-none flex items-center justify-between">
              Layanan
              <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-200 flex flex-col gap-1">
              {layananItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/harga"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            Harga
          </Link>
          <Link
            href="/profil-perusahaan"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            Profil Perusahaan
          </Link>
          <Link
            href="/mitra"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            Mitra
          </Link>
          <Link
            href="/faq"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/hubungi-kami"
            className="mobile-link px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            Hubungi Kami
          </Link>

          {/* Mobile Language Switcher */}
          <div className="mobile-link mt-6 pt-6 border-t border-gray-200">
            <p className="px-3 text-xs font-semibold text-gray-500 mb-3">LANGUAGE</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentLang("id")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                  currentLang === "id"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <IDFlag />
                Indonesia
              </button>
              <button
                onClick={() => setCurrentLang("en")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                  currentLang === "en"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <ENFlag />
                English
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}