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

/* ====== Links (selaras layanan UrusMerek) ====== */
const servicesLinks = [
  { name: "Pendaftaran Merek", href: "/layanan/pendaftaran-merek" },
  { name: "Perpanjangan Merek", href: "/layanan/perpanjangan-merek" },
  { name: "Perubahan Nama/Alamat", href: "/layanan/perubahan-data" },
  { name: "Pengalihan Hak", href: "/layanan/pengalihan-hak" },
  { name: "Cetak Sertifikat", href: "/layanan/cetak-sertifikat" },
  { name: "Keberatan (Oposisi)", href: "/layanan/keberatan-oposisi" },
  { name: "Tanggapan Usul/Tolak", href: "/layanan/tanggapan-penolakan" },
  { name: "Perjanjian Lisensi", href: "/layanan/lisensi-merek" },
];

const learnLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Pusat UMKM", href: "/pusat/umkm" },
  { name: "Pusat Agensi", href: "/pusat/agensi" },
];

/* ====== Sosial & kontak ====== */
const socialLinks = [
  { name: "WhatsApp", icon: MessageCircle, href: "https://api.whatsapp.com/send/?phone=6282267890152" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/" },
];

/* ====== Lisensi & Referensi (logo lokal / public/logo.png) ======
   Ganti imgSrc ke PNG resmi tiap instansi bila sudah ada URL-nya. */
const licenses = [
  { name: "Kementerian Hukum & HAM (DJKI)", href: "https://www.dgip.go.id/", imgSrc: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA" },
  { name: "Direktorat Jenderal Kekayaan Intelektual", href: "https://www.dgip.go.id/", imgSrc: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA" },
  { name: "Klasifikasi Nice (Referensi Kelas Merek)", href: "https://www.wipo.int/classifications/nice/", imgSrc: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA" },
];

const trustBadges = [
  { icon: HelpCircle, text: "Dukungan 24/7" },
  { icon: CalendarDays, text: "Terdaftar di DJKI" },
  { icon: ShieldCheck, text: "Aman & Terpercaya" },
  { icon: Zap, text: "Proses Cepat" },
];

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
  return (
    <footer className="bg-background">
      {/* Stripe kepercayaan */}
      <div className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <badge.icon className="w-5 h-5 text-current" />
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
                <Image src="/logo.png" alt="UrusMerek.id" width={62} height={62} />
                <span className="font-semibold text-lg">UrusMerek.id</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Mitra tepercaya untuk pendaftaran, perpanjangan, dan perlindungan merek di Indonesia.
              </p>
            </div>

            <div className="">
            </div>

            {/* Lisensi & referensi */}
            <div className="col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Lisensi & Referensi
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                {licenses.map((l) => (
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
                * Logo instansi pemerintah ditampilkan sebagai referensi otoritas pendaftaran merek.
                UrusMerek.id adalah konsultan independen.
              </p>
            </div>

            {/* Menu */}
            <FooterLinkColumn title="Layanan" links={servicesLinks} />

            {/* Pelajari + Sosial */}
            <div>
              <FooterLinkColumn title="Pelajari" links={learnLinks} />

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Connect
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="bg-gray-200 p-2 rounded-md text-foreground hover:bg-gray-300 transition-colors"
                    >
                      <s.icon className="w-5 h-5" />
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
              <Link href="/legal/keamanan" className="hover:text-primary transition-colors">Keamanan</Link>
              <Link href="/legal/privasi" className="hover:text-primary transition-colors">Privasi</Link>
              <Link href="/legal/ketentuan" className="hover:text-primary transition-colors">Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
