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
import { useTranslations } from "@/lib/i18n/context";

const layananItems = [
  { title: "Pendaftaran Merek", href: "/layanan/pendaftaran-merek", description: "Amankan identitas brand Anda dengan pendaftaran merek resmi." },
  { title: "Perpanjangan Merek", href: "/layanan/perpanjangan-merek", description: "Jaga keberlangsungan proteksi merek Anda yang akan berakhir." },
  { title: "Pengalihan Hak Merek", href: "/layanan/pengalihan-hak", description: "Proses legal untuk memindahkan kepemilikan merek Anda." },
  { title: "Konsultasi HKI", href: "/layanan/konsultasi-hki", description: "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual." },
];

const toolsItems = [
  {
    title: "Cek Merek",
    href: "/cek-merek",
    description:
      "Platform cek merek dengan teknologi AI yang menampilkan estimasi peluang keberhasilan pendaftaran secara real-time serta menyediakan Dokumen Hasil Analisis (DHA) lengkap.",
  },
  {
    title: "Cari Kelas Merek",
    href: "/cari-kelas-merek",
    description:
      "Portal pencarian kelas merek terlengkap, mencakup kelas barang (1-35) hingga kelas jasa (36-45), dengan sistem filter lanjutan untuk hasil pencarian yang lebih akurat.",
  },
  {
    title: "Monitoring Merek",
    href: "/monitoring-merek",
    description:
      "Tools monitoring status merek untuk mitigasi risiko penolakan. Aktifkan notifikasi otomatis dan pantau perubahan status merek Anda.",
  },
];

  const menuPanelClass =
  "relative overflow-hidden p-3 " +
  "rounded-[28px] backdrop-blur-xl bg-white/30 supports-[backdrop-filter]:bg-white/20 " +
  "ring-1 ring-black/5 shadow-[0_20px_60px_-20px_rgba(15,23,42,.25),0_6px_18px_-10px_rgba(220,38,38,.25)] " +
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " +
  // gradient border via ::before
  "before:absolute before:inset-0 before:rounded-[28px] before:p-[1px] " +
  "before:[background:linear-gradient(135deg,rgba(255,255,255,.65),rgba(220,38,38,.35),rgba(255,255,255,.55))] " +
  "before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] " +
  // soft top highlight
  "after:pointer-events-none after:absolute after:inset-x-6 after:top-0 after:h-10 after:rounded-[24px] after:bg-white/30 after:blur-xl";

const glassCard =
  "group relative block rounded-2xl p-4 transition " +
  "bg-white/55 supports-[backdrop-filter]:bg-white/30 backdrop-blur-lg " +
  "ring-1 ring-black/5 hover:ring-red-200/60 hover:bg-white/70 " +
  "shadow-[inset_0_-1px_0_rgba(255,255,255,.35),0_6px_18px_-10px_rgba(220,38,38,.25)] " +
  "hover:shadow-[inset_0_-1px_0_rgba(255,255,255,.45),0_12px_28px_-16px_rgba(220,38,38,.35)] " +
  // subtle glow on hover
  "hover:[box-shadow:0_0_0_1px_rgba(220,38,38,.15),0_14px_40px_-18px_rgba(220,38,38,.45)]";

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false); // ⬅️ state modal
  const pathname = usePathname();
  const tNav = useTranslations("navigation");
  const brand = tNav<{ primary: string; secondary: string; fallbackPrimary: string; fallbackSecondary: string }>("brand");
  const menu = tNav<{ home: string; services: string; pricing: string; company: string; faq: string; contact: string; partner: string }>("menu");
  const services = tNav<{ title: string; description: string; href: string }[]>("services");
  const aria = tNav<{ openMenu: string }>("aria");
  const mobile = tNav<{ seeAll: string; close: string }>("mobile");
  const consultLabel = tNav<string>("cta.consult");

  const isActive = React.useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")),
    [pathname]
  );
  const layananActive = React.useMemo(() => services.some(i => isActive(i.href)), [isActive, services]);
  const toolsActive = React.useMemo(() => toolsItems.some(i => isActive(i.href)), [isActive]);

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
        <div className="container flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className={cn(capsuleClass, "px-5 py-2 h-12 flex items-center")}>
            <Link href="/" className="flex items-center gap-0">
              <span className="text-xl font-bold text-primary">{brand.primary}</span>
              <span className="text-xl font-bold text-foreground">{brand.secondary}</span>
            </Link>
          </div>

          {/* Nav */}
          <div className={cn("hidden lg:flex", capsuleClass, "px-3 py-2 h-12")}>
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                <NavigationMenuItem>
                  <Link href="/" aria-current={isActive("/") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/") ? linkActive : "text-foreground/80")}> 
                      {menu.home}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn("px-4 h-8 rounded-full text-sm font-medium transition", linkHover, layananActive ? linkActive : "text-foreground/80")}
                    aria-current={layananActive ? "page" : undefined}
                  >
                    {menu.services}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className={cn(menuPanelClass)}>
                    {/* caret / ekor kapsul */}
                    <div className="pointer-events-none absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-md
                                    bg-white/30 ring-1 ring-black/5" />
                    {/* inner grid */}
                    <div className="relative rounded-[22px] p-3">
                      <ul className="grid w-[420px] gap-3 md:w-[520px] md:grid-cols-2 lg:w-[620px]">
                        {services.map((item) => (
                          <ListItem key={item.title} title={item.title} href={item.href} active={isActive(item.href)}>
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/harga" aria-current={isActive("/harga") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/harga") ? linkActive : "text-foreground/80")}> 
                      {menu.pricing}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn("px-4 h-8 rounded-full text-sm font-medium transition", linkHover, toolsActive ? linkActive : "text-foreground/80")}
                    aria-current={toolsActive ? "page" : undefined}
                  >
                    Tools Merek
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className={cn("shadow-lg", menuPopoverRadius)}>
                    <ul className="grid w-[420px] gap-3 p-4 md:w-[520px] lg:w-[620px]">
                      {toolsItems.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} active={isActive(item.href)}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/tentang-kami" aria-current={isActive("/tentang-kami") ? "page" : undefined}>
                    <NavigationMenuLink className={cn(linkBase, linkHover, isActive("/tentang-kami") ? linkActive : "text-foreground/80")}>
                      Tentang Kami
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Lang Switcher */}
            <LangSwitcher className={cn(capsuleClass, "h-12 px-2")} />

            {/* CTA kanan */}
            <div className={cn("items-center flex h-12", capsuleClass, "px-2")}>
              <CtaSegmented
                onOpenAuth={() => setAuthOpen(true)}
                partnerLabel={menu.partner}
                consultLabel={consultLabel}
              />
            </div>
          </div>


          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{aria.openMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-xl font-bold text-primary">{brand.fallbackPrimary}</span>
                    <span className="text-xl font-bold text-foreground">{brand.fallbackSecondary}</span>
                  </Link>
                </SheetHeader>
                {/* Mobile Lang Switcher */}
                <div className={cn("mb-4", capsuleClass, "px-2 py-2")}>
                  <LangSwitcher className="w-full justify-between" />
                </div>


                <div className="flex h-full flex-col py-6">
                  <nav className="flex flex-col space-y-4 text-sm font-medium text-foreground">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      {menu.home}
                    </Link>

                    <MobileLayananDropdown
                      onLinkClick={() => setIsMobileMenuOpen(false)}
                      currentPath={pathname}
                      label={menu.services}
                      items={services}
                    />

                    <Link href="/harga" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/harga") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      {menu.pricing}
                    </Link>

                    <MobileToolsDropdown onLinkClick={() => setIsMobileMenuOpen(false)} currentPath={pathname} />

                    <Link href="/tentang-kami" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/tentang-kami") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      Tentang Kami
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      className={cn("text-left transition")}
                    >
                      {menu.partner}
                    </button>

                    <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)} className={cn(isActive("/hubungi-kami") ? "text-primary font-semibold" : "text-foreground", "transition")}>
                      {menu.contact}
                    </Link>
                  </nav>

                  <div className="mt-auto">
                    <CtaSegmented
                      className={cn(capsuleClass, "w-full justify-between p-1")}
                      onOpenAuth={() => {
                        setIsMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      partnerLabel={menu.partner}
                      consultLabel={consultLabel}
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
const CtaSegmented = ({
  className = "",
  onOpenAuth,
  partnerLabel,
  consultLabel,
}: {
  className?: string;
  onOpenAuth?: () => void;
  partnerLabel: string;
  consultLabel: string;
}) => (
  <div className={cn("inline-flex items-center gap-1", className)}>
    {/* Ganti Link Mitra menjadi tombol pemicu modal */}
    <button
      onClick={onOpenAuth}
      className={cn(
        "h-9 px-4 inline-flex items-center rounded-full text-sm font-medium",
        "text-foreground/80 hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)] transition"
      )}
    >
      {partnerLabel}
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
      {consultLabel}
    </Link>
  </div>
)

/* --- Mobile dropdown (tetap) --- */
const MobileLayananDropdown = ({
  onLinkClick,
  currentPath,
  label,
  items,
}: {
  onLinkClick: () => void;
  currentPath: string;
  label: string;
  items: { title: string; description: string; href: string }[];
}) => {
  const [isOpen, setIsOpen] = React.useState(items.some((i) => currentPath.startsWith(i.href)));
  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <div className="flex flex-col space-y-2">
      <button
        className={cn(
          "flex items-center justify-between w-full transition",
          items.some((i) => isActive(i.href)) && "text-primary font-semibold"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-2 pl-4 border-l-2 ml-1">
          {items.map((item) => (
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

const MobileToolsDropdown = ({
  onLinkClick,
  currentPath,
}: {
  onLinkClick: () => void;
  currentPath: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(toolsItems.some((i) => currentPath.startsWith(i.href)));
  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <div className="flex flex-col space-y-2">
      <button
        className={cn("flex items-center justify-between w-full transition", toolsItems.some((i) => isActive(i.href)) && "text-primary font-semibold")}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>Tools Merek</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-3 pl-4 border-l-2 ml-1">
          {toolsItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "transition",
                isActive(item.href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]"
              )}
            >
              <span className="block text-sm">{item.title}</span>
              <span className="block text-xs text-muted-foreground leading-snug">{item.description}</span>
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
          className={cn(glassCard, className)}
          {...props}
        >
          {/* title (glow di teks saja) */}
          <div className={cn(
            "text-sm font-semibold leading-none transition",
            active
              ? "text-primary [text-shadow:0_0_10px_rgba(220,38,38,.35)]"
              : "text-foreground group-hover:text-primary group-hover:[text-shadow:0_0_10px_rgba(220,38,38,.45)]"
          )}>
            {title}
          </div>

          {/* desc (tenang, tanpa border/rounded putih saat hover) */}
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground
                        group-hover:text-muted-foreground/90 group-hover:[text-shadow:none]">
            {children}
          </p>

          {/* soft underline glow on hover (ornamental) */}
          <span className="pointer-events-none absolute inset-x-4 bottom-3 h-px
                            bg-gradient-to-r from-transparent via-red-300/40 to-transparent
                            opacity-0 group-hover:opacity-100 transition" />
        </a>
      </NavigationMenuLink>
    </li>
  );
}));

ListItem.displayName = "ListItem";
