"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

const layananMenu = [
  {
    title: "Pendaftaran Merek",
    description: "Validasi dan pengajuan merek resmi hingga terbit sertifikat.",
    href: "/layanan/pendaftaran",
  },
  {
    title: "Perpanjangan Merek",
    description: "Pastikan merek Anda tetap aktif tanpa kehilangan hak hukum.",
    href: "/layanan/perpanjangan",
  },
  {
    title: "Konsultasi Hukum",
    description: "Diskusikan kebutuhan hukum merek dan strategi perlindungannya.",
    href: "/layanan/konsultasi",
  },
];

// --------------------------
// 🌐 DESKTOP NAVBAR
// --------------------------
export default function NavbarMenu() {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Animasi dropdown GSAP (desktop)
  React.useEffect(() => {
    if (!dropdownRef.current) return;
    const el = dropdownRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".dropdown-item"),
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
        }
      );
    }, dropdownRef);
    return () => ctx.revert();
  }, []);

  // Animasi slide-in mobile menu
  React.useEffect(() => {
    if (!mobileMenuRef.current) return;
    const el = mobileMenuRef.current;

    if (isMenuOpen) {
      gsap.to(el, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.fromTo(
        el.querySelectorAll(".mobile-link"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
      );
    } else {
      gsap.to(el, {
        x: "100%",
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          urusmerek.id
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Layanan</NavigationMenuTrigger>
                <NavigationMenuContent ref={dropdownRef}>
                  <ul className="grid w-[320px] gap-3 p-4">
                    {layananMenu.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        description={item.description}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/harga" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="transition-colors hover:text-primary"
                  >
                    Harga
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/tentang" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="transition-colors hover:text-primary"
                  >
                    Tentang Kami
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/kontak" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="transition-colors hover:text-primary"
                  >
                    Kontak
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground hover:text-primary transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-background border-l border-border shadow-lg z-40 translate-x-full"
      >
        <div className="flex flex-col p-6 gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            urusmerek.id
          </Link>

          <div className="flex flex-col gap-4 mt-6">
            <span className="mobile-link font-semibold">Layanan</span>
            {layananMenu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="mobile-link text-sm text-muted-foreground hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            <Link
              href="/harga"
              className="mobile-link text-sm text-muted-foreground hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Harga
            </Link>

            <Link
              href="/tentang"
              className="mobile-link text-sm text-muted-foreground hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang Kami
            </Link>

            <Link
              href="/kontak"
              className="mobile-link text-sm text-muted-foreground hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// --------------------------
// 🔗 LIST ITEM COMPONENT
// --------------------------
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
    description?: string;
  }
>(({ className, title, description, ...props }, ref) => {
  return (
    <li className="dropdown-item">
      <NavigationMenuLink asChild>
        <Link
          ref={ref as any}
          className={cn(
            "block select-none space-y-1 rounded-lg border border-transparent p-3 leading-none no-underline outline-none transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-sm hover:scale-[1.02] focus:bg-accent/20 focus:shadow focus:scale-[1.02]",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none text-foreground">
            {title}
          </div>
          {description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
