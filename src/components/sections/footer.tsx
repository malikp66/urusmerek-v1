import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HelpCircle, CalendarDays, ShieldCheck, Zap, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';

const urusMerekLinks = [
  { name: 'Download App', href: '#' },
  { name: 'Tentang Kami', href: '#' },
  { name: 'Karir', href: '#' },
  { name: 'Klien', href: '#' },
  { name: 'Komunitas', href: '#' },
  { name: 'Afiliasi', href: '#' },
  { name: 'Ulasan', href: '#' },
  { name: 'Media', href: '#' },
  { name: 'Brand Kit', href: '#' },
  { name: 'Roadmap Kami', href: '#' },
  { name: 'Status Layanan', href: '#' },
];

const resourcesLinks = [
  { name: 'Bantuan', href: '#' },
  { name: 'Demo', href: '#' },
  { name: 'UrusMerek University', href: '#' },
  { name: 'Webinar', href: '#' },
  { name: 'Acara', href: '#' },
  { name: 'Templat Dokumen', href: '#' },
  { name: 'Impor Data', href: '#' },
  { name: 'API', href: '#' },
  { name: 'Konsultan HKI', href: '#' },
  { name: 'Mitra', href: '#' },
  { name: 'Hubungi Kami', href: '#' },
];

const servicesLinks = [
  { name: 'Pendaftaran Merek', href: '#' },
  { name: 'Perpanjangan Merek', href: '#' },
  { name: 'Pengalihan Hak', href: '#' },
  { name: 'Analisis Merek', href: '#' },
  { name: 'Laporan DJKI', href: '#' },
  { name: 'Jadwal Penting', href: '#' },
  { name: 'Otomatisasi', href: '#' },
  { name: 'Formulir Online', href: '#' },
  { name: 'Catatan', href: '#' },
  { name: 'Papan Strategi', href: '#' },
  { name: 'Dokumen & Berkas', href: '#' },
];

const compareLinks = [
  { name: 'vs Kompetitor A', href: '#' },
  { name: 'vs Kompetitor B', href: '#' },
  { name: 'vs Kompetitor C', href: '#' },
  { name: 'vs Kompetitor D', href: '#' },
  { name: 'vs Kompetitor E', href: '#' },
  { name: 'vs Kompetitor F', href: '#' },
  { name: 'vs Kompetitor G', href: '#' },
  { name: 'vs Kompetitor H', href: '#' },
  { name: 'vs Kompetitor I', href: '#' },
  { name: 'vs Kompetitor J', href: '#' },
  { name: 'vs Kompetitor K', href: '#' },
];

const learnLinks = [
  { name: 'Blog', href: '#' },
  { name: 'Pusat UMKM', href: '#' },
  { name: 'Pusat Agensi', href: '#' },
];

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

const trustBadges = [
  { icon: HelpCircle, text: 'Dukungan 24/7' },
  { icon: CalendarDays, text: 'Terdaftar di DJKI' },
  { icon: ShieldCheck, text: 'Aman & Terpercaya' },
  { icon: Zap, text: 'Proses Cepat & 99.9% Uptime' },
];

const FooterLinkColumn = ({ title, links }: { title: string; links: { name: string; href: string }[] }) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    <ul>
      {links.map((link) => (
        <li key={link.name} className="mb-2">
          <Link href={link.href} className="text-sm text-foreground hover:text-primary transition-colors">
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
      <div className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <badge.icon className="w-5 h-5 text-current" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-secondary text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/be51f6a2-86bf-435d-8907-19b2ee1db37a-clickup-com/assets/svgs/logo-v3-clickup-symbol-only-28.svg?"
                  alt="UrusMerek.id Logo"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-lg">UrusMerek.id</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Solusi lengkap untuk pendaftaran merek Anda.
              </p>
            </div>

            <FooterLinkColumn title="UrusMerek.id" links={urusMerekLinks} />
            <FooterLinkColumn title="Sumber Daya" links={resourcesLinks} />
            <FooterLinkColumn title="Layanan Kami" links={servicesLinks} />
            <FooterLinkColumn title="Bandingkan" links={compareLinks} />
            
            <div>
              <FooterLinkColumn title="Pelajari" links={learnLinks} />
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Connect</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="bg-gray-200 p-2 rounded-md text-foreground hover:bg-gray-300 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-y-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="#">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/be51f6a2-86bf-435d-8907-19b2ee1db37a-clickup-com/assets/svgs/app-store-badge-black-29.svg?" alt="Download on the App Store" width={120} height={40} />
              </Link>
              <Link href="#">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/be51f6a2-86bf-435d-8907-19b2ee1db37a-clickup-com/assets/svgs/google-play-badge-black-30.svg?" alt="Get it on Google Play" width={135} height={40} />
              </Link>
              <Link href="#">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/be51f6a2-86bf-435d-8907-19b2ee1db37a-clickup-com/assets/svgs/app-store-microsoft-badge-black-31.svg?" alt="Get it from Microsoft" width={110} height={40} />
              </Link>
            </div>
            <div className="text-center sm:text-right text-sm text-muted-foreground">
              <p className="mb-1 sm:mb-0">&copy; {new Date().getFullYear()} UrusMerek.id</p>
              <div className="flex gap-x-4 justify-center sm:justify-end">
                <Link href="#" className="hover:text-primary transition-colors">Keamanan</Link>
                <Link href="#" className="hover:text-primary transition-colors">Privasi</Link>
                <Link href="#" className="hover:text-primary transition-colors">Ketentuan</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;