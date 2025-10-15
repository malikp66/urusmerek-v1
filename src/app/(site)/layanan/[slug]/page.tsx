import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getServicePageContent,
  servicePageSlugs,
} from "@/constants/service-pages";
import { ServicePageTemplate } from "@/components/service/service-page-template";

type ServicePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return servicePageSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const content = getServicePageContent(params.slug);

  if (!content) {
    return {
      title: "Layanan Urus Merek",
      description: "Temukan berbagai layanan perlindungan dan pengelolaan merek di urusmerek.id.",
    };
  }

  return content.metadata;
}

export default function ServicePage({ params }: ServicePageProps) {
  const content = getServicePageContent(params.slug);

  if (!content) {
    notFound();
  }

  return <ServicePageTemplate content={content} />;
}
