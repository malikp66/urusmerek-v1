import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, FileText, RefreshCw, BarChart3, ShieldAlert, Lock, CalendarClock,
  GitBranch, KeyRound, Headset, FolderKanban, Settings, Files, Workflow, Users,
  FileClock, MessageSquare, Briefcase, Zap, CheckSquare, GanttChartSquare,
  ClipboardList, Package, Scale, BookOpen, Clock, Tag, Globe, LayoutGrid,
  Database, Link as LinkIcon,
} from "lucide-react";

type Feature = {
  name: string;
  type: "small" | "large";
  icon?: React.ElementType;
  image?: string;
  link: string;
  subtitle?: string;
};

/* === 4 besar (gambar tetap sama & relevan) === */
const primary: Feature[] = [
  { name: "Pendaftaran Merek", subtitle: "", image: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA", type: "large", link: "/layanan/pendaftaran-merek" },
  { name: "Perpanjangan 10 Tahun", subtitle: "", image: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA", type: "large", link: "/layanan/perpanjangan-merek" },
  { name: "Surat Keberatan", subtitle: "", image: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA", type: "large", link: "/layanan/surat-keberatan" },
  { name: "Penelusuran Nama Merek", subtitle: "", image: "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA", type: "large", link: "/layanan/pendaftaran-merek#penelusuran" },
];

/* === kecil === */
const small: Feature[] = [
  { name: "Pengalihan Hak", icon: GitBranch, type: "small", link: "/layanan/pengalihan-hak" },
  { name: "Lisensi Merek", icon: KeyRound, type: "small", link: "/layanan/lisensi" },
  { name: "Notifikasi Tenggat", icon: CalendarClock, type: "small", link: "/info/notifikasi-tenggat" },
  { name: "Manajemen Dokumen", icon: Files, type: "small", link: "/info/dokumen" },
  { name: "Alur Kerja Terstandar", icon: Workflow, type: "small", link: "/info/proses" },
  { name: "Keamanan Data", icon: Lock, type: "small", link: "/info/keamanan-data" },
  { name: "Audit Trail Internal", icon: Scale, type: "small", link: "/info/audit" },
  { name: "Manajemen Kasus", icon: Briefcase, type: "small", link: "/info/kasus" },
  { name: "Komentar & Anotasi Internal", icon: MessageSquare, type: "small", link: "/info/komentar" },
  { name: "Riwayat Versi Dokumen", icon: FileClock, type: "small", link: "/info/riwayat" },
  { name: "Ringkasan Progres", icon: BarChart3, type: "small", link: "/info/progres" },
  { name: "Tugas & Checklist", icon: CheckSquare, type: "small", link: "/info/tugas" },
  { name: "Manajemen Aset Berkas", icon: Package, type: "small", link: "/info/aset" },
  { name: "Basis Pengetahuan", icon: BookOpen, type: "small", link: "/info/basis-pengetahuan" },
  { name: "Pencarian Arsip", icon: Search, type: "small", link: "/info/pencarian-arsip" },
  { name: "Pelacakan Waktu Internal", icon: Clock, type: "small", link: "/info/time-tracking" },
  { name: "Tag & Label Berkas", icon: Tag, type: "small", link: "/info/tag" },
  { name: "Yurisdiksi Global (Konsultatif)", icon: Globe, type: "small", link: "/info/yurisdiksi" },
  { name: "Dashboard (Soon)", icon: LayoutGrid, type: "small", link: "/soon" },
  { name: "Penyimpanan Terpusat", icon: Database, type: "small", link: "/info/penyimpanan" },
  { name: "Formulir", icon: FileText, type: "small", link: "/info/formulir" },
  { name: "Dukungan 24/7", icon: Headset, type: "small", link: "/kontak" },
  { name: "Manajemen Portofolio Merek", icon: FolderKanban, type: "small", link: "/info/portofolio" },
  { name: "Otomatisasi Ringan (Internal)", icon: Zap, type: "small", link: "/info/otomatisasi" },
  { name: "Daftar Klien", icon: ClipboardList, type: "small", link: "/info/klien" },
  { name: "Kolaborasi Tim", icon: Users, type: "small", link: "/info/tim" },
  { name: "Pengaturan", icon: Settings, type: "small", link: "/info/pengaturan" },
];

/* === Cards === */
const SmallCard = ({ f }: { f: Feature }) => {
  const Icon = f.icon!;
  return (
    <Link
      href={f.link}
      className="group h-full w-full rounded-xl border border-smooth bg-white/90 backdrop-blur-sm
                shadow-sm shadow-glow-red transition-all duration-300
                hover:-translate-y-[1px] hover:border-primary-strong hover:shadow-red-strong
                flex items-center justify-center text-center p-3"
    >
      <div className="flex flex-col items-center gap-1.5">
        <Icon className="h-5 w-5 text-gray-600 group-hover-stroke-primary" />
        <span className="text-xs font-medium text-gray-700 leading-tight group-hover-text-primary">
          {f.name}
        </span>
      </div>
    </Link>
  );
};

const LargeCard = ({ f }: { f: Feature }) => (
  <Link
    href={f.link}
    className="group h-full w-full overflow-hidden rounded-xl border border-smooth bg-white
              shadow-sm shadow-glow-red transition-all duration-300
              hover:-translate-y-[1px] hover:border-primary-strong hover:shadow-red-strong
              flex flex-col"
  >
    <div className="p-4 pb-3 flex-1">
      <div className="h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-rose-50 to-white">
        <Image
          src={f.image!}
          alt={f.name}
          width={1200}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
    <div className="px-4 pb-4 pt-0">
      <strong className="text-base text-center font-semibold block text-gray-900 group-hover-text-primary">
        {f.name}
      </strong>
      {f.subtitle && (
        <span className="mt-0.5 block text-xs text-gray-600 leading-snug">{f.subtitle}</span>
      )}
    </div>
  </Link>
);

/* === Grid === */
export default function FeaturesGrid() {
  const getSmall = (i: number) => small[i % small.length];

  return (
    <section
      className="relative isolate overflow-hidden py-20 bg-gradient-to-b from-rose-50/70 via-white to-white section-edge-mask-vars"
      style={{ ['--sx1' as any]:'1%', ['--sy1' as any]:'1.5%' }}
    >
      <div className="container mx-auto px-5">
        {/* header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-base font-semibold text-primary">Layanan Urus Merek</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Layanan lengkap untuk pendaftaran, perpanjangan, dan perlindungan merek
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Semua proses dikerjakan manual oleh tim konsultan—berbasis formulir, cepat, dan rapi.
          </p>
          <div className="mt-10">
            <Link
              href="/konsultasi"
              className="inline-block rounded-full bg-gray-900 px-8 py-3.5 text-base font-semibold text-white
                         shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Mulai Konsultasi
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div
          className="relative mx-auto mt-16 max-w-[1510px] grid-edge-mask"
        >
          {/* overlay gradasi halus */}
          {/* <div aria-hidden className="pointer-events-none absolute inset-0 z-10 grid-soft-vignette" /> */}
          <div className="relative z-0 grid grid-cols-8 gap-3 grid-row-lg">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`r1c${i}`} className="col-span-1">
                <SmallCard f={getSmall(i)} />
              </div>
            ))}

            <div className="col-span-1"><SmallCard f={getSmall(8)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(9)} /></div>

            <div className="col-span-2 row-span-2"><LargeCard f={primary[0]} /></div>
            <div className="col-span-2 row-span-2"><LargeCard f={primary[1]} /></div>

            <div className="col-span-1"><SmallCard f={getSmall(10)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(11)} /></div>

            <div className="col-span-1"><SmallCard f={getSmall(12)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(13)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(14)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(15)} /></div>

            <div className="col-span-1"><SmallCard f={getSmall(16)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(17)} /></div>

            <div className="col-span-2 row-span-2"><LargeCard f={primary[2]} /></div>
            <div className="col-span-2 row-span-2"><LargeCard f={primary[3]} /></div>

            <div className="col-span-1"><SmallCard f={getSmall(18)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(19)} /></div>

            <div className="col-span-1"><SmallCard f={getSmall(20)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(21)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(22)} /></div>
            <div className="col-span-1"><SmallCard f={getSmall(23)} /></div>

            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`r6c${i}`} className="col-span-1">
                <SmallCard f={getSmall(24 + i)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
