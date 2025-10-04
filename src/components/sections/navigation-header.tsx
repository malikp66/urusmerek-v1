"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const layananItems = [
  {
    title: "Pendaftaran Merek",
    href: "/layanan/pendaftaran-merek",
    description: "Amankan identitas brand Anda dengan pendaftaran merek resmi.",
  },
  {
    title: "Perpanjangan Merek",
    href: "/layanan/perpanjangan-merek",
    description: "Perpanjang perlindungan merek Anda sebelum habis masa berlakunya.",
  },
  {
    title: "Pengalihan Hak Merek",
    href: "/layanan/pengalihan-hak",
    description: "Proses legal untuk memindahkan kepemilikan merek Anda.",
  },
  {
    title: "Konsultasi HKI",
    href: "/layanan/konsultasi-hki",
    description: "Dapatkan panduan ahli strategi Hak Kekayaan Intelektual.",
  },
];

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 🌀 GSAP animasi dropdown
  useGSAP(() => {
    if (dropdownOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-xl font-bold text-primary">UrusMerek</span>
          <span className="text-xl font-bold text-foreground">.id</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/beranda" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Beranda
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <NavigationMenuTrigger>Layanan</NavigationMenuTrigger>
              {dropdownOpen && (
                <NavigationMenuContent ref={dropdownRef}>
                  <ul className="grid w-[550px] gap-4 p-4 md:grid-cols-2">
                    {layananItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        description={item.description}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/harga" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Harga
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/profil-perusahaan" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profil Perusahaan
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/mitra" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Mitra
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/faq" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/hubungi-kami" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Hubungi Kami
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* LANGUAGE + BUTTON */}
        <div className="flex items-center space-x-3">
          {/* 🌐 Manual language switch */}
          <LanguageSwitcher />

          <Button className="hidden lg:inline-flex rounded-md bg-red-600 hover:bg-red-700 text-white">
            Konsultasi Gratis
          </Button>

          {/* MOBILE MENU */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-md">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-bold text-primary">
                    UrusMerek
                  </span>
                  <span className="text-xl font-bold text-foreground">.id</span>
                </Link>
              </SheetHeader>
              <div className="flex flex-col py-6 space-y-4 text-foreground">
                <Link href="/beranda" onClick={() => setIsMobileMenuOpen(false)}>
                  Beranda
                </Link>
                <MobileLayananDropdown onLinkClick={() => setIsMobileMenuOpen(false)} />
                <Link href="/harga" onClick={() => setIsMobileMenuOpen(false)}>
                  Harga
                </Link>
                <Link href="/profil-perusahaan" onClick={() => setIsMobileMenuOpen(false)}>
                  Profil Perusahaan
                </Link>
                <Link href="/mitra" onClick={() => setIsMobileMenuOpen(false)}>
                  Mitra
                </Link>
                <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>
                  FAQ
                </Link>
                <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)}>
                  Hubungi Kami
                </Link>

                <div className="pt-4 border-t mt-auto">
                  <LanguageSwitcher />
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
                    Konsultasi Gratis
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* 🌐 Simple language switcher 🇮🇩 / 🇬🇧 */
function LanguageSwitcher() {
  const [lang, setLang] = React.useState<"id" | "en">("id");

  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="flex items-center gap-2 border rounded-md px-2 py-1 hover:bg-accent transition"
    >
      <span className="text-sm">{lang === "id" ? "🇮🇩" : "🇬🇧"}</span>
      <span className="text-xs font-medium">{lang === "id" ? "ID" : "EN"}</span>
    </button>
  );
}

/* 📱 Mobile dropdown */
const MobileLayananDropdown = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col space-y-2">
      <button
        className="flex items-center justify-between w-full font-medium"
        onClick={() => setOpen(!open)}
      >
        <span>Layanan</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="flex flex-col pl-4 space-y-2 border-l ml-1">
          {layananItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* 🧩 Item Dropdown (GSAP + hover effect) */
const ListItem = ({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) => {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-transparent p-4 transition-all duration-200 hover:bg-accent/10 hover:shadow-sm hover:-translate-y-1"
    >
      <div className="text-sm font-semibold text-foreground group-hover:text-primary">
        {title}
      </div>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {description}
      </p>
    </Link>
  );
};
