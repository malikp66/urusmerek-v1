import type { Metadata } from "next";

import { KonsultasiForm } from "./_components/konsultasi-form";

const PAGE_DESCRIPTION =
  "Isi form konsultasi merek dan dapatkan pendampingan konsultan berlisensi untuk proses pendaftaran DJKI.";

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Konsultasi Merek Dagang Urus Merek",
  url: "https://www.urusmerek.id/konsultasi",
  areaServed: "ID",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@urusmerek.id",
    availableLanguage: ["id", "en"],
    areaServed: "ID",
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
      name: "Konsultasi",
      item: "https://www.urusmerek.id/konsultasi",
    },
  ],
};

export const metadata: Metadata = {
  title: "Konsultasi Merek Dagang Berlisensi | Urus Merek",
  description: PAGE_DESCRIPTION,
  keywords: [
    "konsultasi merek dagang",
    "form konsultasi merek",
    "jasa konsultan merek",
    "biaya konsultasi merek",
    "konsultan merek djki",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/konsultasi",
  },
  openGraph: {
    title: "Form Konsultasi Merek Dagang",
    description:
      "Tim berlisensi siap membantu strategi pendaftaran dan perlindungan merek.",
    url: "https://www.urusmerek.id/konsultasi",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Konsultasi Merek Dagang Berlisensi",
    description:
      "Hubungi konsultan Urus Merek untuk pendampingan resmi DJKI.",
  },
};

export default function KonsultasiPage() {
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
      <section className="bg-white pt-16">
        <div className="container mx-auto px-6 lg:px-10">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
              Konsultasi Merek Dagang dengan Konsultan Berlisensi
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{PAGE_DESCRIPTION}</p>
          </header>
        </div>
      </section>
      <KonsultasiForm />
    </>
  );
}
