import type { Metadata } from "next";
import { TrademarkSearchClient } from "./trademark-search-client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FaqSection from "@/components/sections/faq-section";
import { cekMerekFaqContent } from "@/constants/faq-content";

const INDONESIAN_SUMMARY =
  "Telusuri status merek secara resmi langsung ke basis data DJKI. Layanan kami menambahkan tanda tangan PDKI Signature dan merapikan hasil agar mudah dianalisis bersama tim legal.";

const ENGLISH_SUMMARY =
  "Search Indonesian trademarks directly against the official DJKI registry. We generate the required PDKI Signature, proxy the data securely, and present clean insights for your legal review.";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apakah pencarian ini menggunakan data resmi DJKI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Kami mem-proxy permintaan ke pdki-indonesia.dgip.go.id, menambahkan tanda tangan keamanan PDKI Signature, dan menampilkan hasil yang sama persis dengan portal DJKI.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah ada batasan jumlah pencarian?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Untuk menjaga kepatuhan terhadap batasan DJKI, sistem menerapkan throttle pintar. Anda dapat melakukan beberapa pencarian beruntun dan mengunduh ringkasannya ke format PDF.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cek Merek DJKI Terintegrasi",
  provider: {
    "@type": "Organization",
    name: "Urus Merek",
    url: "https://www.urusmerek.id/cek-merek",
  },
  areaServed: "ID",
  serviceOutput: "Ringkasan konflik berdasarkan data DJKI",
  offers: {
    "@type": "Offer",
    priceCurrency: "IDR",
    price: "0",
    availability: "https://schema.org/InStock",
  },
};

const sellingPoints = [
  {
    title: "Tanda tangan resmi PDKI",
    description:
      "Permintaan ditandatangani dengan algoritma AES-256 yang sama seperti portal DJKI, sehingga lolos pemeriksaan keamanan dan captcha.",
  },
  {
    title: "Merangkum data kompleks",
    description:
      "Kami mendeteksi nama merek, pemilik, kelas Nice, nomor permohonan, dan status terbaru lalu menyusunnya dalam kartu yang mudah dibaca.",
  },
  {
    title: "Siap dibagikan",
    description:
      "Ekspor ke PDF atau bagikan tautan dinamis untuk diskusi bersama manajemen dan konsultan hukum.",
  },
];

const followupActions = [
  {
    title: "Diskusikan dengan konsultan",
    description:
      "Gaungkan hasil pencarian ke konsultan terdaftar untuk merumuskan strategi keberatan atau jalur keberlanjutan merek.",
  },
  {
    title: "Lakukan analisis kelas",
    description:
      "Gunakan fitur \"Cek Kelas\" untuk memastikan seluruh produk/jasa Anda tercakup dalam kelas Nice yang tepat.",
  },
  {
    title: "Aktifkan monitoring",
    description:
      "Terapkan pengawasan berkala untuk mendeteksi permohonan baru yang berpotensi konflik sebelum memasuki tahap pengumuman.",
  },
];

export const metadata: Metadata = {
  title: "Cek Merek Dagang Resmi DJKI | Urus Merek",
  description:
    "Cari merek dagang di basis data DJKI secara langsung. Layanan kami menambahkan PDKI Signature, menampilkan status, kelas, dan pemilik dalam hitungan detik.",
  keywords: [
    "cek merek djki",
    "cek merek dagang",
    "pencarian merek resmi",
    "pdki signature",
    "analisis konflik merek",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/cek-merek",
  },
  openGraph: {
    title: "Cek Merek DJKI Terintegrasi",
    description:
      "Telusuri status merek resmi, lengkap dengan status permohonan, kelas, dan pemilik hanya dengan satu klik.",
    url: "https://www.urusmerek.id/cek-merek",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cek Merek DJKI Terintegrasi",
    description:
      "Proxy resmi ke PD-KI dengan tanda tangan PDKI Signature — cepat, akurat, dan mudah dibaca.",
  },
};

export default function CekMerekPage() {
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
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-rose-50 py-24 text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-32 top-[-8rem] h-56 rounded-full bg-[#FEE2E2]/70 blur-3xl" />
          <div className="absolute inset-x-0 bottom-[-10rem] h-72 rounded-full bg-[#FDE68A]/60 blur-3xl" />
        </div>

        <div className="container relative mx-auto flex flex-col gap-16 px-6 sm:gap-20 lg:px-10">
          <header className="flex flex-col gap-5 text-center sm:text-left">
            <Badge className="mx-auto w-fit bg-[#FEE2E2] px-4 py-1 text-sm font-semibold text-[#B91C1C] sm:mx-0">
              Sinkron langsung DJKI
            </Badge>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Cek merek dagang resmi Indonesia tanpa meninggalkan dashboard
                Anda.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-600 sm:mx-0 sm:text-lg">
                {INDONESIAN_SUMMARY}
              </p>
              <p className="text-sm text-slate-500">{ENGLISH_SUMMARY}</p>
            </div>
          </header>

          <TrademarkSearchClient />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sellingPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-3xl border border-[#FECACA] bg-white/90 p-6 shadow-sm shadow-[#FECACA]/60"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[#FECACA] bg-white px-6 py-10 shadow-inner shadow-[#FECACA]/60">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Langkah lanjutan setelah cek merek
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Gunakan temuan awal dari DJKI sebagai fondasi strategi perlindungan
              merek yang berkelanjutan.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {followupActions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-2xl border border-[#FECACA] bg-[#FFF1F2] p-5 text-slate-700"
                >
                  <h3 className="text-base font-semibold text-[#B91C1C]">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed">{action.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#FECACA] bg-white px-6 py-10 shadow-inner shadow-[#FECACA]/60">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Pertanyaan umum
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Masih bingung kapan harus mengajukan permohonan? Jawaban singkat di
              bawah bisa membantu, dan tim kami siap menjelaskan lebih lanjut.
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <details className="group rounded-2xl border border-[#FECACA] bg-[#FFF1F2] px-5 py-4">
                <summary className="cursor-pointer text-base font-semibold text-[#B91C1C]">
                  Bagaimana cara memastikan merek saya benar-benar unik?
                </summary>
                <Separator className="my-3 bg-[#FECACA] opacity-0 transition group-open:opacity-100" />
                <p className="leading-relaxed">
                  Pastikan hasil pencarian tidak menunjukkan merek dengan nama
                  dan kelas identik. Jika ada kemiripan fonetik atau visual,
                  diskusikan opsi rebranding, klaim prioritas, atau strategi
                  keberatan dengan konsultan.
                </p>
              </details>
              <details className="group rounded-2xl border border-[#FECACA] bg-[#FFF1F2] px-5 py-4">
                <summary className="cursor-pointer text-base font-semibold text-[#B91C1C]">
                  Apakah pengecekan ini cukup untuk langsung mendaftar?
                </summary>
                <Separator className="my-3 bg-[#FECACA] opacity-0 transition group-open:opacity-100" />
                <p className="leading-relaxed">
                  Hasil cek membantu memutuskan langkah awal. Namun Anda tetap
                  memerlukan analisis hukum yang mempertimbangkan kelas barang
                  atau jasa, potensi oposisi, dan riwayat merek sejenis.
                </p>
              </details>
              <details className="group rounded-2xl border border-[#FECACA] bg-[#FFF1F2] px-5 py-4">
                <summary className="cursor-pointer text-base font-semibold text-[#B91C1C]">
                  Bisakah saya menyimpan laporan dalam format resmi?
                </summary>
                <Separator className="my-3 bg-[#FECACA] opacity-0 transition group-open:opacity-100" />
                <p className="leading-relaxed">
                  Ya. Anda dapat mengunduh ringkasan ke PDF lengkap dengan
                  timestamp permintaan dan tanda tangan digital Urus Merek untuk
                  dokumentasi internal.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
      <FaqSection {...cekMerekFaqContent} />
    </>
  );
}
