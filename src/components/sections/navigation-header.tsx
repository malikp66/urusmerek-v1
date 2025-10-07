"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

// ⬇️ import modal
import { AuthModal } from "@/components/auth/AuthModal";
import { LangSwitcher } from "@/components/lang/LangSwitcher";

const layananItems = [
  { title: "Pendaftaran Merek", href: "/layanan/pendaftaran-merek", description: "Amankan identitas brand Anda dengan pendaftaran merek resmi." },
  { title: "Perpanjangan Merek", href: "/layanan/perpanjangan-merek", description: "Jaga keberlangsungan proteksi merek Anda yang akan berakhir." },
  { title: "Pengalihan Hak Merek", href: "/layanan/pengalihan-hak", description: "Proses legal untuk memindahkan kepemilikan merek Anda." },
  { title: "Konsultasi HKI", href: "/layanan/konsultasi-hki", description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual." },
];

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false); // ⬅️ state modal
  const pathname = usePathname();
  const isActive = React.useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")),
    [pathname]
  );
  const layananActive = React.useMemo(() => layananItems.some(i => isActive(i.href)), [isActive]);

  const capsuleClass =
    "rounded-full border border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 " +
    "[box-shadow:0_1px_0_0_rgba(0,0,0,.03),0_4px_14px_-6px_rgba(17,24,39,.10)]";

  const linkBase = "px-4 py-0 justify-center h-8 inline-flex items-center rounded-full text-sm font-medium transition";
  const linkHover = "hover:bg-transparent focus:bg-transparent hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]";
  const linkActive = "text-primary [text-shadow:0_0_8px_rgba(220,38,38,.35)]";
  const menuPopoverRadius = "rounded-[28px]";

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="container flex h-20 max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <div className={cn(capsuleClass, "px-5 py-2 h-12 flex items-center")}>
            <Link href="/" className="flex items-center gap-0">
              <span className="text-xl font-bold text-primary">urusmerek</span>
              <span className="text-xl font-bold text-foreground">.id</span>
            </Link>
          </div>

          {/* Nav */}
          <div className={cn("hidden lg:flex", capsuleClass, "px-3 py-2 h-12")}>
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                <NavigationMenuItem>
                  <Link href="/" aria-current={isActive("/") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/") ? linkActive : "text-foreground/80")}>
                      Beranda
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn("px-4 h-8 rounded-full text-sm font-medium transition", linkHover, layananActive ? linkActive : "text-foreground/80")}
                    aria-current={layananActive ? "page" : undefined}
                  >
                    Layanan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className={cn("shadow-lg", menuPopoverRadius)}>
                    <ul className="grid w-[420px] gap-3 p-4 md:w-[520px] md:grid-cols-2 lg:w-[620px]">
                      {layananItems.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} active={isActive(item.href)}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/harga" aria-current={isActive("/harga") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/harga") ? linkActive : "text-foreground/80")}>
                      Harga
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/profil-perusahaan" aria-current={isActive("/profil-perusahaan") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/profil-perusahaan") ? linkActive : "text-foreground/80")}>
                      Profil Perusahaan
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/faq" aria-current={isActive("/faq") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/faq") ? linkActive : "text-foreground/80")}>
                      FAQ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Lang Switcher */}
            <LangSwitcher
              className={cn(capsuleClass, "h-12 px-2")}
              // contoh: sambungkan ke router/i18n-mu di sini
              onChange={(loc) => {
                // TODO: jika pakai i18n route, lakukan router.replace(`/${loc}${pathnameWithoutLocale}`)
                // Untuk sementara cukup simpan & refresh:
                if (typeof window !== "undefined") window.location.reload();
              }}
            />

            {/* CTA kanan */}
            <div className={cn("items-center flex h-12", capsuleClass, "px-2")}>
              <CtaSegmented onOpenAuth={() => setAuthOpen(true)} />
            </div>
          </div>


          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-xl font-bold text-primary">UrusMerek</span>
                    <span className="text-xl font-bold text-foreground">.id</span>
                  </Link>
                </SheetHeader>
                {/* Mobile Lang Switcher */}
                <div className={cn("mb-4", capsuleClass, "px-2 py-2")}>
                  <LangSwitcher className="w-full justify-between" onChange={() => window.location.reload()} />
                </div>


                <div className="flex h-full flex-col py-6">
                  <nav className="flex flex-col space-y-4 text-sm font-medium text-foreground">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      Beranda
                    </Link>

                    <MobileLayananDropdown onLinkClick={() => setIsMobileMenuOpen(false)} currentPath={pathname} />

                    <Link href="/harga" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/harga") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      Harga
                    </Link>

                    <Link href="/profil-perusahaan" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/profil-perusahaan") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      Profil Perusahaan
                    </Link>

                    <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/faq") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      FAQ
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      className={cn("text-left transition")}
                    >
                      Mitra
                    </button>

                    <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/hubungi-kami") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      Hubungi Kami
                    </Link>
                  </nav>

                  <div className="mt-auto">
                    <CtaSegmented
                      className={cn(capsuleClass, "w-full justify-between p-1")}
                      onOpenAuth={() => {
                        setIsMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ⬇️ Modal Auth */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}

/* --- CTA --- */
const CtaSegmented = ({ className = "", onOpenAuth }: { className?: string; onOpenAuth?: () => void }) => (
  <div className={cn("inline-flex items-center gap-1", className)}>
    {/* Ganti Link Mitra menjadi tombol pemicu modal */}
    <button
      onClick={onOpenAuth}
      className={cn(
        "h-9 px-4 inline-flex items-center rounded-full text-sm font-medium",
        "text-foreground/80 hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)] transition"
      )}
    >
      Mitra
    </button>
    <Link
      href="/hubungi-kami"
      className={cn(
        "h-9 px-4 inline-flex items-center rounded-full text-sm font-semibold text-white",
        "bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)]",
        "border border-white/20 shadow-[inset_0_-1px_0_rgba(0,0,0,.08),0_6px_14px_-6px_rgba(220,38,38,.45)]",
        "hover:shadow-[inset_0_-1px_0_rgba(0,0,0,.12),0_10px_18px_-8px_rgba(220,38,38,.55)]",
        "active:translate-y-px transition"
      )}
    >
      Konsultasi
    </Link>
  </div>
)

/* --- Mobile dropdown (tetap) --- */
const MobileLayananDropdown = ({
  onLinkClick,
  currentPath,
}: {
  onLinkClick: () => void;
  currentPath: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(layananItems.some((i) => currentPath.startsWith(i.href)));
  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <div className="flex flex-col space-y-2">
      <button
        className={cn("flex items-center justify-between w-full transition", layananItems.some((i) => isActive(i.href)) && "text-primary font-semibold")}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>Layanan</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-2 pl-4 border-l-2 ml-1">
          {layananItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-sm transition",
                isActive(item.href) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* --- Item di popover --- */
const ListItem = React.memo(React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { active?: boolean }
>(({ className, title, children, active = false, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            // ubah hover jadi text-only di dalam kartu konten
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            active ? "text-primary [text-shadow:0_0_8px_rgba(220,38,38,.35)]" : "text-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none group-hover:text-primary group-hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]">{title}</div>
          <p className="line-clamp-2 text-sm group-hover:text-muted-foreground group-hover:[text-shadow:none] leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}));
ListItem.displayName = "ListItem";
