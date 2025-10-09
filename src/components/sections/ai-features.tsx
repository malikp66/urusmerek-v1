"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";

type FeatureButton = {
  variant: "primary" | "secondary";
  label: string;
  href: string;
};

type FeatureItem = {
  id: string;
  badge: string;
  title: string;
  body: string;
  image: {
    src: string;
    alt: string;
  };
  buttons: FeatureButton[];
};

const buttonVariantMap: Record<FeatureButton["variant"], "default" | "outline"> = {
  primary: "default",
  secondary: "outline",
};

const buttonClassMap: Record<FeatureButton["variant"], string> = {
  primary: "bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md",
  secondary: "font-semibold px-6 rounded-md text-foreground hover:bg-secondary",
};

const AiFeatures = () => {
  const t = useTranslations("aiFeatures");
  const eyebrow = t("eyebrow");
  const title = t("title");
  const description = t("description");
  const features = t<FeatureItem[]>("items");
  const cta = t<{ title: string; description: string; button: { label: string; href: string } }>("cta");

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-primary eyebrow font-semibold mb-2">{eyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-20 lg:space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={feature.id}
                className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                <div
                  className={`${isReversed ? "md:order-last" : ""} flex justify-center`}
                >
                  <Image
                    src={feature.image.src}
                    alt={feature.image.alt}
                    width={550}
                    height={450}
                    className="rounded-lg shadow-lg object-cover w-full h-auto"
                  />
                </div>
                <div className={isReversed ? "md:order-first" : ""}>
                  <p className="text-primary font-semibold mb-2">{feature.badge}</p>
                  <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground mb-6">{feature.body}</p>
                  <div className="flex flex-wrap gap-4">
                    {feature.buttons.map((button) => (
                      <Button
                        key={`${feature.id}-${button.href}`}
                        size="lg"
                        variant={buttonVariantMap[button.variant]}
                        className={buttonClassMap[button.variant]}
                        asChild
                      >
                        <Link href={button.href}>{button.label}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-center">
            <h4 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {cta.title}
            </h4>
            <p className="text-muted-foreground mb-6">{cta.description}</p>
            <Button
              size="lg"
              variant={buttonVariantMap.primary}
              className={buttonClassMap.primary}
              asChild
            >
              <Link href={cta.button.href}>{cta.button.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
