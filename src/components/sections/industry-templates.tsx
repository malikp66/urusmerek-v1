"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  Rocket, Factory, Store, Cpu, Paintbrush, CheckCircle, ShieldCheck, FileText,
  BarChart, MessageCircle, Globe, Package, Users, FileCheck2, ShoppingBag,
  Map, AlertTriangle, Codepen, Cloud, Book, Briefcase, Palette, Copyright, Film,
  Handshake, LayoutGrid, ArrowRight, LucideProps
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type IconName = 'Rocket' | 'Factory' | 'Store' | 'Cpu' | 'Paintbrush' | 'ShieldCheck' | 'FileText' | 'BarChart' | 'MessageCircle' | 'Globe' | 'Package' | 'Users' | 'FileCheck2' | 'ShoppingBag' | 'Map' | 'AlertTriangle' | 'Codepen' | 'Cloud' | 'Book' | 'Briefcase' | 'Palette' | 'Copyright' | 'Film' | 'Handshake';

const ICONS: { [key in IconName]: React.ComponentType<LucideProps> } = {
  Rocket, Factory, Store, Cpu, Paintbrush, ShieldCheck, FileText, BarChart, MessageCircle, Globe, Package, Users, FileCheck2, ShoppingBag, Map, AlertTriangle, Codepen, Cloud, Book, Briefcase, Palette, Copyright, Film, Handshake
};

const IconComponent = ({ name, className }: { name: IconName; className?: string }) => {
  const Icon = ICONS[name];
  return Icon ? <Icon className={className} /> : null;
};

interface TabData {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  features: string[];
  testimonial: {
    quote: string;
    boldPart: string;
    quoteAfter: string;
    name: string;
    role: string;
    image: string;
  };
  benefits: {
    icon: IconName;
    text: string;
  }[];
  link: string;
}

const TABS_DATA: TabData[] = [
  {
    id: 'startup',
    label: 'Startup',
    icon: Rocket,
    title: 'Amankan Nama Brand Startup Anda Sejak Dini',
    description: 'Bangun fondasi brand yang kuat dengan perlindungan merek yang tepat, pastikan ide brilian Anda aman dari peniruan.',
    features: [
      'Validasi nama brand agar unik dan aman',
      'Pendaftaran merek untuk produk/layanan digital',
      'Perlindungan logo dan tagline inovatif Anda',
    ],
    testimonial: {
      quote: 'UrusMerek membantu kami mengamankan brand teknologi kami',
      boldPart: 'dengan cepat',
      quoteAfter: ', sehingga kami bisa fokus pada pengembangan produk.',
      name: 'Andi Pratama',
      role: 'CEO, TechStarter',
      image: "https://images.ctfassets.net/w8fc6tgspyjz/53XXc832C6bIBuA69DTIAe/c7a5060dd37cdcddbab2ba6acc61b0d2/convene-headshot.png",
    },
    benefits: [
      { icon: 'ShieldCheck', text: 'Perlindungan hukum menyeluruh' },
      { icon: 'FileText', text: 'Proses pendaftaran efisien' },
      { icon: 'BarChart', text: 'Monitoring merek pasca-pendaftaran' },
      { icon: 'MessageCircle', text: 'Konsultasi ahli HKI' },
    ],
    link: '#',
  },
  {
    id: 'manufaktur',
    label: 'Manufaktur',
    icon: Factory,
    title: 'Lindungi Merek Dagang Produk Manufaktur',
    description: 'Pastikan merek produk unggulan Anda terlindungi di pasar domestik dan internasional, dari nama hingga desain kemasan.',
    features: [
      'Pendaftaran merek untuk barang produksi',
      'Perlindungan desain industri produk',
      'Manajemen portofolio merek untuk lini produk',
    ],
    testimonial: {
      quote: 'Dengan portofolio produk yang luas,',
      boldPart: 'UrusMerek menjadi mitra strategis',
      quoteAfter: ' kami dalam menjaga aset tak berwujud perusahaan.',
      name: 'Budi Santoso',
      role: 'Direktur Operasional, Manufaktur Jaya',
      image: "https://images.ctfassets.net/w8fc6tgspyjz/6ohY5Fu69CRHGE0mah7axr/059950d4d81638a7397ec2419c96cc49/finastra-headshot.png",
    },
    benefits: [
      { icon: 'Globe', text: 'Perlindungan merek internasional' },
      { icon: 'Package', text: 'Keamanan desain kemasan' },
      { icon: 'Users', text: 'Lisensi dan waralaba merek' },
      { icon: 'FileCheck2', text: 'Audit aset merek' },
    ],
    link: '#',
  },
  {
    id: 'retail',
    label: 'Retail',
    icon: Store,
    title: 'Jaga Identitas Unik Bisnis Retail Anda',
    description: 'Dari nama toko hingga merek produk private label, lindungi semua aset yang membuat bisnis retail Anda menonjol di antara pesaing.',
    features: [
      'Pendaftaran merek toko dan slogan',
      'Perlindungan merek "private label"',
      'Strategi merek untuk ekspansi cabang',
    ],
    testimonial: {
      quote: 'Kami bisa berekspansi dengan tenang karena',
      boldPart: 'nama toko kami sudah aman terdaftar',
      quoteAfter: ' berkat layanan profesional dari UrusMerek.',
      name: 'Citra Lestari',
      role: 'Pemilik, Retail Lokal Maju',
      image: "https://images.ctfassets.net/w8fc6tgspyjz/7uRPSnTn4VvZydj8WdKPLS/7dd63b4d43dea19d5d7b706b0114e329/lulu-headshot.png",
    },
    benefits: [
      { icon: 'Store', text: 'Perlindungan identitas toko' },
      { icon: 'ShoppingBag', text: 'Keamanan merek produk' },
      { icon: 'Map', text: 'Strategi ekspansi aman' },
      { icon: 'AlertTriangle', text: 'Pencegahan sengketa merek' },
    ],
    link: '#',
  },
  {
    id: 'teknologi',
    label: 'Teknologi',
    icon: Cpu,
    title: 'Perlindungan Komprehensif untuk Inovasi',
    description: 'Amankan merek software, aplikasi, dan platform Anda. Pastikan nama dan logo solusi digital Anda terlindungi secara hukum.',
    features: [
      'Pendaftaran merek untuk software & aplikasi',
      'Perlindungan nama domain dan platform digital',
      'Manajemen merek untuk produk SaaS',
    ],
    testimonial: {
      quote: 'Proses pendaftaran merek SaaS kami berjalan sangat mulus. Tim',
      boldPart: 'UrusMerek sangat mengerti kebutuhan industri teknologi.',
      quoteAfter: '',
      name: 'Dewi Anggraini',
      role: 'Product Manager, Inovasi Digital',
      image: "https://images.ctfassets.net/w8fc6tgspyjz/7tXR2qwRxHMkFKTzSkYnO2/9c3756d6e60b7395c72ac037b65521eb/pressed-headshot.png",
    },
    benefits: [
      { icon: 'Codepen', text: 'Keamanan merek perangkat lunak' },
      { icon: 'Cloud', text: 'Perlindungan platform SaaS' },
      { icon: 'Book', text: 'Hak cipta & dokumentasi' },
      { icon: 'Briefcase', text: 'Strategi lisensi perangkat lunak' },
    ],
    link: '#',
  },
  {
    id: 'kreatif',
    label: 'Kreatif',
    icon: Paintbrush,
    title: 'Lindungi Karya dan Brand Industri Kreatif',
    description: 'Bagi agensi, studio, atau kreator individu, merek adalah identitas. Kami bantu lindungi nama, logo, dan karya Anda.',
    features: [
      'Pendaftaran merek untuk agensi/studio',
      'Perlindungan hak cipta untuk konten kreatif',
      'Manajemen merek untuk portofolio klien',
    ],
    testimonial: {
      quote: 'Reputasi adalah segalanya di industri kreatif.',
      boldPart: 'UrusMerek memastikan brand agensi kami terlindungi',
      quoteAfter: ' dengan baik.',
      name: 'Rian Firmansyah',
      role: 'Creative Director, Agensi Visi',
      image: "https://images.ctfassets.net/w8fc6tgspyjz/3WlMeqwdFWzrKz9Gikfwsh/65b6c88dacf2a804a870dfa529de8305/hawkemedia-headshot.png",
    },
    benefits: [
      { icon: 'Palette', text: 'Perlindungan merek kreatif' },
      { icon: 'Copyright', text: 'Manajemen Hak Cipta' },
      { icon: 'Film', text: 'Keamanan konten digital' },
      { icon: 'Handshake', text: 'Perjanjian kerja kreatif' },
    ],
    link: '#',
  }
];

export default function IndustryTemplates() {
  const [activeTab, setActiveTab] = useState(TABS_DATA[0].id);

  const activeTabData = TABS_DATA.find((tab) => tab.id === activeTab);

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">Mulai dengan Cepat dan Tepat</h2>
          <p className="mt-4 text-lg text-muted-foreground">Solusi siap pakai untuk setiap jenis usaha agar bisa langsung mulai.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
          <div className="flex flex-wrap justify-center gap-1.5 bg-white p-1.5 rounded-xl shadow-sm">
            {TABS_DATA.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-foreground hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <a href="#" className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-foreground bg-white shadow-sm hover:bg-gray-100 transition-colors">
            <LayoutGrid className="w-4 h-4" />
            <span>Lihat semua</span>
          </a>
        </div>

        {activeTabData && (
          <div className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg max-w-6xl mx-auto transition-all duration-300">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3">
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground">{activeTabData.title}</h3>
                <p className="mt-3 text-muted-foreground">{activeTabData.description}</p>
                <ul className="mt-6 space-y-3">
                  {activeTabData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-8 border-t flex items-center gap-5">
                  <Image
                    src={activeTabData.testimonial.image}
                    alt={activeTabData.testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full flex-shrink-0"
                  />
                  <blockquote className="text-muted-foreground">
                    “{activeTabData.testimonial.quote} <span className="font-semibold text-foreground">{activeTabData.testimonial.boldPart}</span>{activeTabData.testimonial.quoteAfter}”
                  </blockquote>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col justify-between">
                <div className="space-y-3">
                  {activeTabData.benefits.map((benefit) => (
                    <div key={benefit.text} className="flex items-center gap-4 p-4 border rounded-lg bg-background">
                      <IconComponent name={benefit.icon} className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="font-medium text-sm text-foreground">{benefit.text}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-6 w-full">
                  <a href={activeTabData.link}>
                    Gunakan Solusi Ini
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}