"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* Lucide icons */
import {
  BadgeCheck,        // Pendaftaran
  CalendarClock,     // Perpanjangan
  Stamp,             // Cetak sertifikat
  FileEdit,          // Perubahan data
  ArrowLeftRight,    // Pengalihan hak
  FileWarning,       // Usul/tolak
  Gavel,             // Surat keberatan/oposisi
  Handshake,         // Perjanjian lisensi
  CheckCircle,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/* ===== Types ===== */
type PriceVariant = { id: string; name: string; price: number; note?: string };
type Service = {
  id: string;
  label: string;                   // pendek untuk tab
  title: string;                   // judul di panel
  description: string;             // copy pendek
  icon: React.ComponentType<any>;  // lucide icon
  image: string;                   // ilustrasi/cover
  features: string[];              // bullet utama
  benefits: string[];              // bullet tambahan
  prices: PriceVariant[];          // 1 atau lebih varian
  ctaLink?: string;                // WA / link lainnya
};

const IDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/* ===== Data (disalin dari PDF harga & deskripsi layanan) ===== */
const SERVICES: Service[] = [
  {
    id: "pendaftaran",
    label: "Pendaftaran",
    title: "Jasa Pendaftaran Merek",
    description:
      "Bebas antri & terima beres—analisis ketersediaan nama lalu ajukan resmi ke DJKI hingga terbit sertifikat.",
    icon: BadgeCheck,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: [
      "Analisis awal nama/kelas merek",
      "One-day submission (dokumen lengkap)",
      "Pendampingan penuh sampai sertifikat",
    ],
    benefits: [
      "Tanpa drama birokrasi",
      "Progress update & bukti permohonan resmi",
    ],
    prices: [{ id: "std", name: "Paket Lengkap", price: 4_500_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+daftar+merek+di+UrusMerek.",
  },
  {
    id: "perpanjangan",
    label: "Perpanjangan",
    title: "Perpanjangan Merek 10 Tahun",
    description:
      "Cek masa berlaku & ajukan perpanjangan online—sekali proses, perlindungan lanjut 10 tahun.",
    icon: CalendarClock,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: [
      "Audit dokumen & tenggat masa berlaku",
      "Pengajuan cepat oleh tim ahli",
      "Notifikasi status perpanjangan",
    ],
    benefits: [
      "Minim risiko lewat pengecekan awal",
      "Proses ringkas & transparan",
    ],
    prices: [
      { id: "early", name: "< 6 bulan sebelum habis", price: 3_500_000 },
      { id: "late", name: "≥ 6 bulan/grace period", price: 6_000_000 },
    ],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+perpanjang+merek.",
  },
  {
    id: "sertifikat",
    label: "Cetak Sertifikat",
    title: "Cetak Sertifikat Merek Terdaftar",
    description:
      "Cetak fisik sertifikat yang sudah terbit & kirim ke alamat Anda—bukti kepemilikan sah.",
    icon: Stamp,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: [
      "Validasi data & nomor sertifikat",
      "Proses percetakan resmi",
      "Pengemasan & pengiriman",
    ],
    benefits: [
      "Dokumen otentik yang rapi",
      "Tracking pengiriman",
    ],
    prices: [{ id: "print", name: "Cetak Sertifikat", price: 1_000_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+cetak+sertifikat+merek.",
  },
  {
    id: "perubahan",
    label: "Perubahan Data",
    title: "Permohonan Perubahan Nama/Alamat",
    description:
      "Koreksi data pemilik merek (nama/alamat) secara resmi dan terdokumentasi.",
    icon: FileEdit,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: ["Penyusunan berkas", "Pengajuan pencatatan perubahan", "Pelaporan hasil resmi"],
    benefits: ["Akurat & tuntas", "Minim revisi dokumen"],
    prices: [{ id: "chg", name: "Perubahan Data", price: 3_500_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+ubah+data+merek.",
  },
  {
    id: "pengalihan",
    label: "Pengalihan Hak",
    title: "Pengalihan Hak Atas Merek",
    description:
      "Transfer kepemilikan merek yang aman sesuai kesepakatan—didampingi ahli berpengalaman.",
    icon: ArrowLeftRight,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: ["Review perjanjian pengalihan", "Pengajuan pencatatan resmi", "Dokumentasi lengkap"],
    benefits: ["Kepastian legal", "Alur tertib & jelas"],
    prices: [{ id: "assign", name: "Pengalihan Hak", price: 6_000_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+pengalihan+hak+merek.",
  },
  {
    id: "usul-tolak",
    label: "Usul/Tolak",
    title: "Tanggapan Substantif Usul/Tolak",
    description:
      "Analisis dasar penolakan lalu susun argumen & bukti agar peluang pendaftaran tetap terbuka.",
    icon: FileWarning,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: ["Analisis kemiripan/pasal terkait", "Perumusan argumen hukum", "Pengajuan tanggapan"],
    benefits: ["Strategi anti-tolak", "Dikerjakan tim ahli HKI"],
    prices: [{ id: "resp", name: "Tanggapan Substantif", price: 2_500_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+butuh+tanggapan+usul%2Ftolak.",
  },
  {
    id: "keberatan",
    label: "Keberatan",
    title: "Surat Keberatan (Oposisi)",
    description:
      "Hadang merek tiruan saat masa publikasi dengan surat keberatan berbasis riset pembanding.",
    icon: Gavel,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: ["Riset pembanding & bukti", "Penyusunan legal letter", "Pengajuan resmi"],
    benefits: ["Lindungi ruang merekmu", "Cepat & terstruktur"],
    prices: [{ id: "opp", name: "Oposisi/Keberatan", price: 2_500_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+ingin+ajukan+keberatan+merek.",
  },
  {
    id: "lisensi",
    label: "Lisensi",
    title: "Perjanjian Lisensi Merek",
    description:
      "Rancang perjanjian lisensi yang jelas & menguntungkan—siap untuk kolaborasi komersial.",
    icon: Handshake,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    features: ["Draft perjanjian komprehensif", "Penyesuaian klausul bisnis", "Review risiko & kepatuhan"],
    benefits: ["Protect IP & revenue", "Dokumen siap tanda tangan"],
    prices: [{ id: "lic", name: "Penyusunan Lisensi", price: 3_500_000 }],
    ctaLink:
      "https://api.whatsapp.com/send/?phone=6282267890152&text=Halo%2C+saya+butuh+perjanjian+lisensi+merek.",
  },
];

/* ===== Component ===== */
export default function IndustryTemplates() {
  const [activeId, setActiveId] = useState<Service["id"]>("pendaftaran");
  const [expanded, setExpanded] = useState(false);
  const [pickedVariantByService, setPickedVariantByService] = useState<Record<string, string>>({});

  const active = useMemo(() => SERVICES.find((s) => s.id === activeId)!, [activeId]);
  const visibleServices = expanded ? SERVICES : SERVICES.slice(0, 4);

  const currentVariantId = pickedVariantByService[active.id] ?? active.prices[0].id;
  const currentVariant = active.prices.find((p) => p.id === currentVariantId) ?? active.prices[0];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Harga Layanan</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pilih layanan yang Anda butuhkan—detail, manfaat, dan harga akan tampil di panel.
          </p>
        </div>

        {/* Selector + toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
          <div className="flex flex-wrap justify-center gap-1.5 bg-white p-1.5 rounded-xl shadow-sm">
            {visibleServices.map((s) => {
              const Icon = s.icon;
              const checked = s.id === activeId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                    checked ? "bg-primary text-primary-foreground shadow" : "text-foreground hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle expand/collapse */}
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-foreground bg-white shadow-sm hover:bg-gray-100 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Lihat semua</span>
            </button>
          ) : (
            <button
              onClick={() => setExpanded(false)}
              aria-label="Tutup daftar"
              className="flex items-center justify-center h-10 w-10 rounded-lg text-foreground bg-white shadow-sm hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Details panel */}
        <div className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg max-w-6xl mx-auto transition-all duration-300">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: copy + features */}
            <div className="lg:col-span-3">
              <h3 className="text-2xl md:text-3xl font-semibold">{active.title}</h3>
              <p className="mt-3 text-muted-foreground">{active.description}</p>

              <ul className="mt-6 space-y-3">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 overflow-hidden rounded-xl">
                <div className="relative h-48 w-full">
                  <Image src={active.image} alt={active.title} fill className="object-cover rounded-xl" />
                </div>
              </div>
            </div>

            {/* Right: price + benefits + CTA */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              {/* Variants */}
              <div>
                <h4 className="text-lg font-semibold">Opsi & Harga</h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {active.prices.map((p) => {
                    const isActive = currentVariantId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() =>
                          setPickedVariantByService((prev) => ({ ...prev, [active.id]: p.id }))
                        }
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          isActive ? "border-primary bg-primary text-white" : "hover:border-primary/60"
                        )}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                {/* Price */}
                <div className="mt-5">
                  <div className="text-sm text-muted-foreground">Harga</div>
                  <div className="text-3xl font-semibold">{IDR(currentVariant.price)}</div>
                  {currentVariant.note && (
                    <div className="text-sm text-muted-foreground mt-1">{currentVariant.note}</div>
                  )}
                </div>

                {/* Benefits */}
                <div className="mt-6 grid grid-cols-1 gap-2">
                  {active.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Pendaftaran mencakup biaya resmi; untuk layanan lain PNBP mengikuti ketentuan DJKI (jika berlaku).
                </p>
              </div>

              <Button asChild size="lg" className="mt-6 w-full">
                <a href={active.ctaLink ?? "#"} target="_blank" rel="noopener noreferrer">
                  Konsultasi & Pesan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
