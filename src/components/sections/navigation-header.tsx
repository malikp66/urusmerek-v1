"use client";

import * as React from "react";
import Link from "next/link";
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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    description:
      "Dapatkan panduan ahli mengenai strategi Hak Kekayaan Intelektual.",
  },
];

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-1" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-xl font-bold text-primary">UrusMerek</span>
            <span className="text-xl font-bold text-foreground">.id</span>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/beranda" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Beranda
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Layanan</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {layananItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
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
        </div>

        <div className="flex items-center space-x-2">
          <Button className="hidden lg:inline-flex rounded-md">
            Konsultasi Gratis
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-md">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <Link href="/" className="flex items-center space-x-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-bold text-primary">UrusMerek</span>
                  <span className="text-xl font-bold text-foreground">.id</span>
                </Link>
              </SheetHeader>
              <div className="flex h-full flex-col py-6">
                <nav className="flex flex-col space-y-4 text-sm font-medium text-foreground">
                  <Link href="/beranda" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                  <MobileLayananDropdown onLinkClick={() => setIsMobileMenuOpen(false)} />
                  <Link href="/harga" onClick={() => setIsMobileMenuOpen(false)}>Harga</Link>
                  <Link href="/profil-perusahaan" onClick={() => setIsMobileMenuOpen(false)}>Profil Perusahaan</Link>
                  <Link href="/mitra" onClick={() => setIsMobileMenuOpen(false)}>Mitra</Link>
                  <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
                  <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)}>Hubungi Kami</Link>
                </nav>
                <Button className="mt-auto rounded-md">Konsultasi Gratis</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const MobileLayananDropdown = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex flex-col space-y-2">
      <button 
        className="flex items-center justify-between w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Layanan</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="flex flex-col space-y-2 pl-4 border-l-2 ml-1">
          {layananItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onLinkClick} className="text-muted-foreground">{item.title}</Link>
          ))}
        </div>
      )}
    </div>
  );
};


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";