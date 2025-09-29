import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  FileText,
  RefreshCw,
  MailWarning,
  BarChart3,
  ShieldAlert,
  Lock,
  CalendarClock,
  GitBranch,
  KeyRound,
  Headset,
  FolderKanban,
  Plug,
  Settings,
  Files,
  Workflow,
  Users,
  FileClock,
  MessageSquare,
  Briefcase,
  Zap,
  CheckSquare,
  GanttChartSquare,
  ClipboardList,
  Package,
  Scale,
  BookOpen,
  Clock,
  Tag,
  Globe,
  Mic,
  LayoutGrid,
  Database,
  Link as LinkIcon
} from 'lucide-react';

type Feature = {
  name: string;
  type: 'small' | 'large';
  icon?: React.ElementType;
  image?: string;
  link: string;
};

const allFeatures: Feature[] = [
  { name: 'Perpanjangan Otomatis', icon: RefreshCw, type: 'small', link: '#' },
  { name: 'Surat Keberatan', icon: MailWarning, type: 'small', link: '#' },
  { name: 'Sanggahan & Oposisi', icon: ShieldAlert, type: 'small', link: '#' },
  { name: 'Pelaporan', icon: BarChart3, type: 'small', link: '#' },
  { name: 'Notifikasi Tenggat', icon: CalendarClock, type: 'small', link: '#' },
  { name: 'Pengalihan Hak', icon: GitBranch, type: 'small', link: '#' },
  { name: 'Lisensi Merek', icon: KeyRound, type: 'small', link: '#' },
  { name: 'Dukungan 24/7', icon: Headset, type: 'small', link: '#' },
  { name: 'Manajemen Portofolio', icon: FolderKanban, type: 'small', link: '#' },
  { name: 'Integrasi API', icon: Plug, type: 'small', link: '#' },
  { name: 'Pencarian Merek', image: 'https://images.ctfassets.net/w8fc6tgspyjz/3SIBpiSpDlsgeZOt1H2pLh/ca8361470a3b4d2abced5749b7c65aa8/feature-projects.png', type: 'large', link: '#' },
  { name: 'Formulir Kustom', icon: FileText, type: 'small', link: '#' },
  { name: 'Keamanan Data', icon: Lock, type: 'small', link: '#' },
  { name: 'Manajemen Dokumen', icon: Files, type: 'small', link: '#' },
  { name: 'Alur Kerja Otomatis', icon: Workflow, type: 'small', link: '#' },
  { name: 'Kolaborasi Tim', icon: Users, type: 'small', link: '#' },
  { name: 'Riwayat Versi', icon: FileClock, type: 'small', link: '#' },
  { name: 'Pendaftaran Online', image: 'https://images.ctfassets.net/w8fc6tgspyjz/40QMqVkhZZ7P57ASa6bGKG/faeb6e18824b76b2411faab638165ffa/feature-docs.png', type: 'large', link: '#' },
  { name: 'Monitoring Status', image: 'https://images.ctfassets.net/w8fc6tgspyjz/5JlnrTeyHc2kkWuaTKLarK/43a99fbb8ecbc842fc474a2be7eed1e1/feature-whiteboards.png', type: 'large', link: '#' },
  { name: 'Manajemen Kasus', icon: Briefcase, type: 'small', link: '#' },
  { name: 'Komentar & Anotasi', icon: MessageSquare, type: 'small', link: '#' },
  { name: 'Analisis Kompetitor', image: 'https://images.ctfassets.net/w8fc6tgspyjz/B6bvltQxgBHCjofiEQnqX/6785f24509f2de23b078e9612f3935d2/feature-chat.png', type: 'large', link: '#' },
  { name: 'Gantt Chart', icon: GanttChartSquare, type: 'small', link: '#' },
  { name: 'Tugas & Checklist', icon: CheckSquare, type: 'small', link: '#' },
  { name: 'Otomatisasi', icon: Zap, type: 'small', link: '#' },
  { name: 'Daftar Klien', icon: ClipboardList, type: 'small', link: '#' },
  { name: 'Manajemen Aset', icon: Package, type: 'small', link: '#' },
  { name: 'Audit Trail', icon: Scale, type: 'small', link: '#' },
  { name: 'Basis Pengetahuan', icon: BookOpen, type: 'small', link: '#' },
  { name: 'Pelacakan Waktu', icon: Clock, type: 'small', link: '#' },
  { name: 'Tag & Label', icon: Tag, type: 'small', link: '#' },
  { name: 'Yurisdiksi Global', icon: Globe, type: 'small', link: '#' },
  { name: 'Transkrip AI', icon: Mic, type: 'small', link: '#' },
  { name: 'Dasbor Kustom', icon: LayoutGrid, type: 'small', link: '#' },
  { name: 'Penyimpanan Terpusat', icon: Database, type: 'small', link: '#' },
  { name: 'Tautan Cerdas', icon: LinkIcon, type: 'small', link: '#' },
  { name: 'Pengingat', icon: RefreshCw, type: 'small', link: '#' },
  { name: 'Sasaran & OKR', icon: ShieldAlert, type: 'small', link: '#' },
  { name: 'Pencarian Lanjutan', icon: Search, type: 'small', link: '#' },
  { name: 'Pengaturan Kustom', icon: Settings, type: 'small', link: '#' },
];


const FeatureCard = ({ feature }: { feature: Feature }) => {
  const isLarge = feature.type === 'large';
  const cardBaseClasses = "rounded-2xl border bg-card text-foreground shadow-sm transition-shadow duration-300 hover:shadow-md";

  if (isLarge && feature.image) {
    return (
      <a href={feature.link} className={`${cardBaseClasses} lg:col-span-2 lg:row-span-2 flex flex-col`}>
        <div className="flex-grow p-5 pb-3">
          <div className="aspect-[1.7/1] w-full overflow-hidden rounded-lg">
            <Image
              src={feature.image}
              alt={feature.name}
              width={300}
              height={176}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="px-5 pb-5 pt-0">
          <strong className="text-xl font-semibold">{feature.name}</strong>
        </div>
      </a>
    );
  }

  if (feature.icon) {
    const Icon = feature.icon;
    return (
      <a href={feature.link} className={`${cardBaseClasses} group flex flex-col items-center justify-center p-4 text-center aspect-square`}>
        <Icon className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="mt-2 text-sm font-medium">{feature.name}</span>
      </a>
    );
  }

  return null;
};

export default function FeaturesGrid() {
  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-base font-semibold text-primary">Fitur</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Setiap fitur yang dibutuhkan tim Anda untuk bekerja lebih cepat
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            100+ fitur untuk membawa produktivitas ke level berikutnya.
          </p>
          <div className="mt-10">
            <Link
              href="#"
              className="inline-block rounded-full bg-gray-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Lihat Semua Fitur
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 grid-flow-dense auto-rows-[minmax(0,_1fr)]">
          {allFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}