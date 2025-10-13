import type { Metadata } from "next";

const INDONESIAN_DESCRIPTION =
  "Urus Merek adalah platform digital untuk penelusuran dan perlindungan merek usaha. Kami menyediakan fitur cek merek real-time berbasis AI, pencarian kelas barang/jasa, serta monitoring status merek dengan notifikasi otomatis. Tujuan kami adalah memastikan pendaftaran merek Anda berjalan lancar sehingga merek usaha Anda terlindungi.";

const ENGLISH_DESCRIPTION =
  "Urus Merek is a digital platform for trademark search and brand protection. We provide real-time AI-powered trademark checks, class search across goods and service categories, and status monitoring with automatic notifications. Our goal is to ensure your trademark registration proceeds smoothly so your brand is protected.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Urus Merek",
  url: "https://www.urusmerek.id/tentang-kami",
  logo: "https://www.urusmerek.id/logo.png",
  foundingDate: "2021",
  founder: [{ "@type": "Person", name: "Nama Founder" }],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@urusmerek.id",
    telephone: "+62-21-1234567",
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
      name: "Tentang Kami",
      item: "https://www.urusmerek.id/tentang-kami",
    },
  ],
};

export const metadata: Metadata = {
  title: "Tentang Urus Merek | Konsultan Pendaftaran Merek",
  description:
    "Kenali tim konsultan dan teknologi Urus Merek yang membantu ribuan bisnis melindungi merek dagang.",
  keywords: [
    "tentang urus merek",
    "profil konsultan merek",
    "perusahaan jasa pendaftaran merek",
    "tim konsultan merek berlisensi",
    "layanan hki indonesia",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/tentang-kami",
  },
  openGraph: {
    title: "Tentang Urus Merek",
    description:
      "Pelajari misi, tim, dan teknologi yang mendampingi pendaftaran merek Anda.",
    url: "https://www.urusmerek.id/tentang-kami",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Tentang Urus Merek",
    description:
      "Platform layanan pendaftaran merek terpercaya di Indonesia.",
  },
};

export default function TentangKamiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
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
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Tentang Kami</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Mengenal lebih dekat misi Urus Merek dalam membantu pelaku usaha melindungi identitas brand mereka.
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{INDONESIAN_DESCRIPTION}</p>
            </article>

            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">English</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{ENGLISH_DESCRIPTION}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
