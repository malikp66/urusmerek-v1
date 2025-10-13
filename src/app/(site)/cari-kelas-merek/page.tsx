import type { Metadata } from "next";

const INDONESIAN_SUMMARY =
  "Portal pencarian kelas merek terlengkap, mencakup kelas barang (1-35) hingga kelas jasa (36-45), dengan sistem filter lanjutan untuk hasil pencarian yang lebih akurat.";

const ENGLISH_SUMMARY =
  "A comprehensive trademark class search portal covering goods classes 1-35 and service classes 36-45, equipped with advanced filtering for precise results.";

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Pencarian Kelas Merek",
  provider: {
    "@type": "Organization",
    name: "Urus Merek",
    url: "https://www.urusmerek.id/cari-kelas-merek",
  },
  serviceType: "Trademark Class Search",
  areaServed: "ID",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paket Konsultasi Kelas Merek",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Review kelas merek oleh konsultan",
        },
      },
    ],
  },
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
  title: "Cari Kelas Merek Dagang Nice Classification | Urus Merek",
  description:
    "Temukan kelas merek barang dan jasa dengan database resmi. Hindari penolakan DJKI dengan panduan Urus Merek.",
  keywords: [
    "cari kelas merek",
    "kelas merek dagang",
    "nice classification indonesia",
    "panduan kelas merek umkm",
    "cek kelas merek barang dan jasa",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/cari-kelas-merek",
  },
  openGraph: {
    type: "website",
    url: "https://www.urusmerek.id/cari-kelas-merek",
    title: "Cari Kelas Merek Dagang Resmi Nice Classification",
    description:
      "Filter kelas barang dan jasa dengan data resmi DJKI dan rekomendasi otomatis.",
  },
  twitter: {
    card: "summary",
    title: "Cari Kelas Merek Dagang",
    description:
      "Gunakan database Urus Merek untuk memilih kelas barang/jasa secara akurat.",
  },
};

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
      <section className="relative py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <header className="mb-12 max-w-3xl">
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Cari Kelas Merek</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {INDONESIAN_SUMMARY}
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Temukan kelas merek yang tepat sebelum mengajukan permohonan. Basis data Urus Merek merangkum seluruh klasifikasi Nice Classification untuk barang (kelas 1-35) dan jasa (kelas 36-45) berikut penjelasan rinci tiap subkelas.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Sistem Advance Filter kami membantu Anda memetakan kategori bisnis secara cepat. Saring hasil berdasarkan kata kunci, jenis produk atau layanan, bahkan status pendaftaran kompetitor untuk menilai peluang keberhasilan.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
                <li>Visualisasi hirarki kelas untuk mempermudah eksplorasi kategori terkait.</li>
                <li>Contoh produk atau jasa populer di setiap kelas sebagai referensi pengisian formulir.</li>
                <li>Rekomendasi kelas tambahan yang relevan dengan model bisnis Anda.</li>
              </ul>
              <p className="text-base leading-relaxed text-muted-foreground">
                Dengan pemetaan kelas yang akurat, Anda dapat meminimalkan risiko penolakan karena salah klasifikasi dan mempercepat proses administrasi.
              </p>
            </article>

            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">English</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Identify the right trademark classes before filing your application. Urus Merek consolidates the entire Nice Classification for goods (classes 1-35) and services (classes 36-45), complete with detailed explanations for every subclass.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Our Advance Filter System maps your business category in seconds. Narrow the list by keywords, product or service types, and even competitor registrations to gauge your filing strategy.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
                <li>Hierarchy visuals that make it easy to explore adjacent classes.</li>
                <li>Example goods and services for each class to guide your application wording.</li>
                <li>Suggested complementary classes aligned with your business model.</li>
              </ul>
              <p className="text-base leading-relaxed text-muted-foreground">
                Accurate class mapping minimizes refusal risk due to misclassification and accelerates your administrative process.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
