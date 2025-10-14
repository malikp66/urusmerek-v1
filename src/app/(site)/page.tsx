import type { Metadata } from "next";

import HeroSection from "@/components/sections/hero-section";
import TrustedCompanies from "@/components/sections/trusted-companies";
import ProblemSolutionSection from "@/components/sections/problem-solution";
import ServicesShowcase from "@/components/sections/services-showcase";
import AiFeatures from "@/components/sections/ai-features";
import FeaturesGrid from "@/components/sections/features-grid";
import TestimonialsSection from "@/components/sections/testimonials";
import FlexibilityFeatures from "@/components/sections/flexibility-features";
import IndustryTemplates from "@/components/sections/industry-templates";
import FinalCta from "@/components/sections/final-cta";
import FaqSection from "@/components/sections/faq-section";
import RedDiagonalBackground from "@/components/RedDiagonalBackground";

const HOME_DESCRIPTION =
  "Daftarkan merek usaha dengan tim ahli Urus Merek. Cek merek, pilih kelas, dan ajukan ke DJKI lebih cepat.";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Urus Merek",
  url: "https://www.urusmerek.id/",
  logo: "https://www.urusmerek.id/logo.png",
  sameAs: ["https://www.dgip.go.id/"],
  serviceProvided: {
    "@type": "Service",
    name: "Jasa pengurusan merek dagang",
    areaServed: "ID",
    providerMobility: "dynamic",
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
  ],
};

export const metadata: Metadata = {
  title: "Jasa Pengurusan Merek Cepat & Terpercaya | Urus Merek",
  description: HOME_DESCRIPTION,
  keywords: [
    "jasa pengurusan merek dagang",
    "pendaftaran merek dagang",
    "konsultan merek djki",
    "platform cek merek",
    "monitoring merek",
    "biaya daftar merek dagang",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/",
  },
  openGraph: {
    title: "Jasa Pengurusan Merek Dagang Terintegrasi",
    description:
      "Solusi cek merek, penyusunan dokumen, dan pendaftaran DJKI dalam satu platform.",
    url: "https://www.urusmerek.id/",
    siteName: "Urus Merek",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pengurusan Merek Cepat",
    description:
      "Platform terpadu untuk cek merek, pilih kelas, dan daftar ke DJKI.",
    images: ["https://www.urusmerek.id/og-cover.png"],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="">
        <section className="">
          <HeroSection />
          {/* <RedDiagonalBackground intensity={1} /> */}
        </section>
        <TrustedCompanies />
        {/* <ProblemSolutionSection /> */}
        <ServicesShowcase />
        {/* <AiFeatures /> */}
        <FeaturesGrid />
        {/* <TestimonialsSection /> */}
        {/* <FlexibilityFeatures /> */}
        <IndustryTemplates />
        <FaqSection />
        <FinalCta />
      </div>
    </>
  );
}
