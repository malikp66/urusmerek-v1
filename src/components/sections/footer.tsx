"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HelpCircle,
  CalendarDays,
  ShieldCheck,
  Zap,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n/context";

const iconMap = {
  HelpCircle,
  CalendarDays,
  ShieldCheck,
  Zap,
  MessageCircle,
  Linkedin,
  Facebook,
  Instagram,
};

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
      {title}
    </h3>
    <ul>
      {links.map((link) => (
        <li key={link.name} className="mb-2">
          <Link
            href={link.href}
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const t = useTranslations("footer");
  const trustBadges = t<{ icon: string; text: string }[]>("trustBadges") ?? [];
  const trustItems = trustBadges.map((badge) => ({
    text: badge.text,
    Icon: iconMap[badge.icon as keyof typeof iconMap] ?? HelpCircle,
  }));
  const brand = t<{ description: string; logoAlt: string }>("brand");
  const licenses = t<{
    title: string;
    items: { name: string; href: string; imgSrc: string }[];
    disclaimer: string;
  }>("licenses");
  const columns = t<{
    servicesTitle: string;
    learnTitle: string;
    connectTitle: string;
    services: { name: string; href: string }[];
    learn: { name: string; href: string }[];
    social: { name: string; href: string; icon: string }[];
  }>("columns");
  const socialItems = columns.social.map((item) => ({
    ...item,
    Icon: iconMap[item.icon as keyof typeof iconMap] ?? MessageCircle,
  }));
  const bottom = t<{ security: string; privacy: string; terms: string }>("bottom");

  return (
    <footer className="bg-background">
      {/* Stripe kepercayaan */}
      <div className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {trustItems.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <badge.Icon className="w-5 h-5 text-current" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Isi footer */}
      <div className="bg-secondary text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Image src="/logo.png" alt={brand.logoAlt} width={62} height={62} />
                <span className="font-semibold text-lg">UrusMerek.id</span>
              </Link>
              <p className="text-sm text-muted-foreground">{brand.description}</p>
            </div>

            <div className="">
            </div>

            {/* Lisensi & referensi */}
            <div className="col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                {licenses.title}
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                {licenses.items.map((l) => (
                  <Link
                    key={l.name}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3"
                    title={l.name}
                  >
                    <Image
                      src={l.imgSrc} // gunakan /public/logo.png; ganti ke URL PNG resmi jika ada
                      alt={l.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain rounded"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground">
                      {l.name}
                    </span>
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {licenses.disclaimer}
              </p>
            </div>

            {/* Menu */}
            <FooterLinkColumn title={columns.servicesTitle} links={columns.services} />

            {/* Pelajari + Sosial */}
            <div>
              <FooterLinkColumn title={columns.learnTitle} links={columns.learn} />

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  {columns.connectTitle}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialItems.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="bg-gray-200 p-2 rounded-md text-foreground hover:bg-gray-300 transition-colors"
                    >
                      <s.Icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-y-6">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} UrusMerek.id
            </div>
            <div className="flex gap-x-4 text-sm">
              <Link href="/legal/keamanan" className="hover:text-primary transition-colors">{bottom.security}</Link>
              <Link href="/legal/privasi" className="hover:text-primary transition-colors">{bottom.privacy}</Link>
              <Link href="/legal/ketentuan" className="hover:text-primary transition-colors">{bottom.terms}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
