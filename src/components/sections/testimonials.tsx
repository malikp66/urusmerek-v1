"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CalendarClock,
  FileText,
  RefreshCw,
  ArrowLeftRight,
  ShieldAlert,
  FileSignature,
} from "lucide-react";

/* ===== Types ===== */
type Variant = { id: string; name: string; price: number; note?: string };
type Service = {
  id: string;
  name: string;
  icon: React.ElementType;
  image: string;
  blurb: string;
  benefits: string[];
  variants: Variant[];
  badge?: string;
};

/* ===== Utils ===== */
const IDRC = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ===== Data ===== */
const SERVICES: Service[] = [
  {
    id: "pendaftaran",
    name: "Pendaftaran Merek",
    icon: BadgeCheck,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Analisis awal + pengajuan resmi DJKI. Terima beres hingga sertifikat.",
    benefits: [
      "Analisis ketersediaan nama",
      "One-day submission (dokumen lengkap)",
      "Pendampingan hingga terbit sertifikat",
    ],
    variants: [{ id: "std", name: "Paket Lengkap", price: 4_500_000 }],
    badge: "Favorit",
  },
  {
    id: "perpanjangan",
    name: "Perpanjangan Merek",
    icon: RefreshCw,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Perlindungan lanjut 10 tahun dalam sekali proses.",
    benefits: ["Cek masa berlaku & dokumen", "Pengajuan online ditangani ahli"],
    variants: [
      { id: "early", name: "< 6 bulan sebelum habis", price: 3_500_000 },
      { id: "late", name: "≥ 6 bulan/grace", price: 6_000_000 },
    ],
  },
  {
    id: "cetak-sertifikat",
    name: "Cetak Sertifikat",
    icon: FileText,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Cetak fisik sertifikat merek terdaftar & pengiriman.",
    benefits: ["Validasi nomor sertifikat", "Percetakan & pengiriman"],
    variants: [{ id: "print", name: "Cetak Sertifikat", price: 1_000_000 }],
  },
  {
    id: "perubahan-data",
    name: "Perubahan Nama/Alamat",
    icon: FileSignature,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Koreksi data pemilik merek (nama/alamat) resmi di DJKI.",
    benefits: ["Penyusunan dokumen", "Pengajuan pencatatan perubahan"],
    variants: [{ id: "chg", name: "Perubahan Data", price: 3_500_000 }],
  },
  {
    id: "pengalihan-hak",
    name: "Pengalihan Hak",
    icon: ArrowLeftRight,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Transfer kepemilikan merek aman & terdokumentasi.",
    benefits: ["Review dokumen peralihan", "Pengajuan resmi ke DJKI"],
    variants: [{ id: "assign", name: "Pengalihan Hak", price: 6_000_000 }],
  },
  {
    id: "usul-tolak",
    name: "Tanggapan Penolakan",
    icon: ShieldAlert,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Surat tanggapan substantif agar merek tetap berpeluang terdaftar.",
    benefits: ["Analisis dasar penolakan", "Penyusunan argumen & bukti"],
    variants: [{ id: "resp", name: "Tanggapan Substantif", price: 2_500_000 }],
  },
  {
    id: "keberatan",
    name: "Surat Keberatan",
    icon: CalendarClock,
    image:
      "https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA",
    blurb: "Oposisi untuk menghadang merek tiruan saat publikasi.",
    benefits: ["Riset pembanding", "Penyusunan legal letter"],
    variants: [{ id: "opp", name: "Oposisi/Keberatan", price: 2_500_000 }],
  },
];

/* ===== Component ===== */
export default function PricingSelectorSection() {
  const [active, setActive] = useState<Service["id"]>("pendaftaran");
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const service = useMemo(() => SERVICES.find((s) => s.id === active)!, [active]);

  return (
    <section id="harga" className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Paket & Harga</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Pilih layanan yang Anda butuhkan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Klik salah satu opsi di bawah. Detail, manfaat, dan harga akan tampil di panel.
          </p>
        </div>

        {/* === SMALL OPTION GRID (form-like) === */}
        <div className="flex flex-col p-4 border-red-300 max-w-xl background-white rounded-3xl shadow-2xl items-center gap-4">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Pilih 
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Klik
          </p>
          <div
            role="radiogroup"
            aria-label="Pilih layanan"
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const checked = s.id === active;
              return (
                <button
                  key={s.id}
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "flex min-h-[64px] flex-col items-center justify-center gap-2 rounded-xl border bg-card px-3 py-2 text-center text-sm font-medium shadow-sm transition",
                    checked
                      ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("h-5 w-5", checked ? "text-primary" : "text-foreground/70")} />
                  <span className={cn(checked ? "text-primary" : "text-foreground")}>{s.name}</span>
                </button>
              );
            })}
          </div>
          <a
            href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+memesan+layanan+UrusMerek."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow hover:opacity-95"
          >
            Konsultasi
          </a>
        </div>
        

        {/* === DETAILS PANEL === */}
        <div className="mt-10 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Preview */}
            <div className="relative h-56 w-full overflow-hidden rounded-xl lg:h-72 lg:w-1/2">
              <Image src={service.image} alt={service.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-sm opacity-90">Layanan terpilih</div>
                <h3 className="text-2xl font-semibold">{service.name}</h3>
              </div>
            </div>

            {/* Options & Price */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold">Pilih opsi & lihat harga</h4>

              <div className="mt-3 flex flex-wrap gap-2">
                {service.variants.map((v) => {
                  const current = chosen[service.id] ?? service.variants[0].id;
                  const isActive = current === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setChosen((p) => ({ ...p, [service.id]: v.id }))}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        isActive ? "border-primary bg-primary text-white" : "hover:border-primary/60"
                      )}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Harga</div>
                  <div className="text-3xl font-semibold">
                    {IDRC(
                      service.variants.find(
                        (v) => v.id === (chosen[service.id] ?? service.variants[0].id)
                      )?.price ?? service.variants[0].price
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">{service.blurb}</p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {service.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Harga di atas termasuk jasa pengurusan. Beberapa layanan dapat membutuhkan PNBP sesuai aturan DJKI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
