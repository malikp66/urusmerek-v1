import type { Metadata } from "next";
import { ClassSearchClient } from "./class-search-client";
import { Badge } from "@/components/ui/badge";

const INDONESIAN_SUMMARY =
  "Pilih kelas Nice 1–45 berdasarkan data resmi DJKI. Kami mengambil langsung dari Sistem Klasifikasi Merek (SKM), sehingga contoh barang dan jasa selalu mutakhir.";

const ENGLISH_SUMMARY =
  "Explore Nice classes 1–45 backed by the official DJKI dataset. Every entry is proxied from the Indonesian Classification portal to ensure accuracy.";

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Pencarian Klasifikasi Nice Resmi DJKI",
  provider: {
    "@type": "Organization",
    name: "Urus Merek",
    url: "https://www.urusmerek.id/cari-kelas-merek",
  },
  serviceType: "Trademark class search",
  areaServed: "ID",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Beranda",
      item: "https://www.urusmerek.id/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Cari Kelas Merek",
      item: "https://www.urusmerek.id/cari-kelas-merek",
    },
  ],
};

export const metadata: Metadata = {
  title: "Cari Kelas Merek Nice DJKI | Urus Merek",
  description:
    "Telusuri klasifikasi Nice resmi Indonesia berdasarkan data SKM DJKI. Filter ribuan contoh barang dan jasa agar tidak salah pilih kelas.",
  keywords: [
    "kelas merek nice",
    "klasifikasi merek djki",
    "cek kelas merek resmi",
    "nice classification indonesia",
    "pemetaan kelas merek",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/cari-kelas-merek",
  },
  openGraph: {
    type: "website",
    url: "https://www.urusmerek.id/cari-kelas-merek",
    title: "Cari Kelas Merek Nice DJKI",
    description:
      "Integrasi langsung dengan Sistem Klasifikasi Merek DJKI. Pilih kelas 1–45 dengan contoh nyata barang dan jasa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cari Kelas Merek Nice DJKI",
    description:
      "Pemetaan kelas barang dan jasa berbasis data resmi Sistem Klasifikasi Merek DJKI.",
  },
};

const highlights = [
  {
    title: "Selalu sinkron",
    description:
      "Data diambil langsung dari skm.dgip.go.id pada saat Anda melakukan pencarian, sehingga mencerminkan pembaruan terbaru DJKI.",
  },
  {
    title: "Filter kata kunci",
    description:
      "Saring ribuan entri per kelas berdasarkan kata kunci (misal: kosmetik, layanan konsultasi) untuk mempermudah seleksi.",
  },
  {
    title: "Dual bahasa",
    description:
      "Setiap entri merek disajikan dalam Bahasa Indonesia dan Bahasa Inggris sesuai standar Nice Classification.",
  },
];

export default function CariKelasMerekPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-rose-50 py-24 text-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.6),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(250,232,255,0.45),_transparent_60%)]" />

        <div className="container relative mx-auto flex flex-col gap-16 px-6 lg:px-10">
          <header className="flex flex-col gap-5 text-center sm:text-left">
            <Badge className="mx-auto w-fit bg-[#FEE2E2] px-4 py-1 text-[#B91C1C] sm:mx-0">
              Data resmi Sistem Klasifikasi Merek
            </Badge>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Cari kelas merek yang tepat sebelum Anda mendaftar ke DJKI.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:mx-0 sm:text-lg">
                {INDONESIAN_SUMMARY}
              </p>
              <p className="text-sm text-slate-500">{ENGLISH_SUMMARY}</p>
            </div>
          </header>

          <ClassSearchClient />

          <div className="grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#FECACA] bg-white/90 p-6 shadow-sm shadow-[#FECACA]/60"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
