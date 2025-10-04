"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

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

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLayananOpen, setIsLayananOpen] = React.useState(false);
  const layananTimeout = React.useRef<number | null>(null);

  // Helper untuk hover/focus agar tidak langsung close on tiny mouse moves
  const openLayanan = () => {
    if (layananTimeout.current) window.clearTimeout(layananTimeout.current);
    setIsLayananOpen(true);
  };
  const closeLayanan = () => {
    layananTimeout.current = window.setTimeout(() => setIsLayananOpen(false), 120);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.span
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-xl font-extrabold text-primary">UrusMerek</span>
              <span className="text-xl font-extrabold text-foreground">.id</span>
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/beranda">
              <a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1">
                Beranda
              </a>
            </Link>

            {/* layanan with animated dropdown */}
            <div
              className="relative"
              onMouseEnter={openLayanan}
              onFocus={openLayanan}
              onMouseLeave={closeLayanan}
            >
              <button
                type="button"
                aria-expanded={isLayananOpen}
                onClick={() => setIsLayananOpen((s) => !s)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
              >
                <span>Layanan</span>
                <motion.span
                  animate={{ rotate: isLayananOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isLayananOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    onMouseEnter={openLayanan}
                    onMouseLeave={closeLayanan}
                    className="absolute left-0 top-full mt-2 w-[520px] rounded-lg border border-border/40 bg-popover p-4 shadow-lg"
                    role="menu"
                  >
                    <ul className="grid gap-3 md:grid-cols-2">
                      {layananItems.map((item, i) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.18 }}
                        >
                          <Link href={item.href}>
                            <a
                              className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setIsLayananOpen(false)}
                              role="menuitem"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold">{item.title}</div>
                                <span className="text-xs text-muted-foreground">Selengkapnya →</span>
                              </div>
                              <p className="mt-1 text-sm line-clamp-2 text-muted-foreground">{item.description}</p>
                            </a>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/harga"><a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors">Harga</a></Link>
            <Link href="/profil-perusahaan"><a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors">Profil Perusahaan</a></Link>
            <Link href="/mitra"><a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors">Mitra</a></Link>
            <Link href="/faq"><a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors">FAQ</a></Link>
            <Link href="/hubungi-kami"><a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/40 transition-colors">Hubungi Kami</a></Link>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* small search icon */}
          <button
            aria-label="Cari"
            className="hidden sm:flex items-center justify-center rounded-md p-2 hover:bg-accent/40 transition-colors focus:outline-none focus:ring-2"
            title="Cari"
          >
            <Search className="h-4 w-4" />
          </button>

          <Button className="hidden lg:inline-flex rounded-md relative overflow-hidden">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Konsultasi Gratis
            </span>
            <motion.span
              initial={{ x: -6, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="ml-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white"
            >
              Gratis
            </motion.span>
          </Button>

          {/* Mobile sheet menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-md">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-lg font-extrabold text-primary">UrusMerek</span>
                    <span className="text-lg font-extrabold text-foreground">.id</span>
                  </Link>
                  <button
                    aria-label="Tutup menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-md p-2 hover:bg-accent/40 transition-colors focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </SheetHeader>

              <div className="flex h-full flex-col py-6">
                <MobileNavContent onLinkClick={() => setIsMobileMenuOpen(false)} />
                <Button className="mt-auto rounded-md">Konsultasi Gratis</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* Mobile nav content separated so logic is clean */
const MobileNavContent: React.FC<{ onLinkClick: () => void }> = ({ onLinkClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="flex flex-col gap-4 text-sm font-medium text-foreground">
      <Link href="/beranda"><a onClick={onLinkClick}>Beranda</a></Link>

      <div className="flex flex-col">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
        >
          <span className="font-medium">Layanan</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-2 flex flex-col gap-2 pl-4 border-l-2 ml-1"
            >
              {layananItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: 6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link href={item.href}><a className="text-muted-foreground" onClick={onLinkClick}>{item.title}</a></Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href="/harga"><a onClick={onLinkClick}>Harga</a></Link>
      <Link href="/profil-perusahaan"><a onClick={onLinkClick}>Profil Perusahaan</a></Link>
      <Link href="/mitra"><a onClick={onLinkClick}>Mitra</a></Link>
      <Link href="/faq"><a onClick={onLinkClick}>FAQ</a></Link>
      <Link href="/hubungi-kami"><a onClick={onLinkClick}>Hubungi Kami</a></Link>
    </nav>
  );
};
