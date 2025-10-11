"use client";

import React, { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Search, FileText, FolderKanban } from "lucide-react";

import { useTranslations } from "@/lib/i18n/context";
import { SafeImage } from "@/components/ui/safe-image";

type ToggleItem = {
  id: string;
  label: string;
};

type CardImage = {
  src: string;
  alt: string;
};

type CardContent = {
  id: string;
  title: string;
  description: string;
  image?: CardImage;
  toggles?: string[];
};

const iconMap = {
  search: Search,
  filing: FileText,
  management: FolderKanban,
};

type IconKey = keyof typeof iconMap;

type ToggleFeatureProps = {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onToggle: () => void;
  controlId: string;
};

const ToggleFeature = ({ icon: Icon, label, checked, onToggle, controlId }: ToggleFeatureProps) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
    <div className="flex items-center">
      <Icon className={`h-5 w-5 transition-colors ${checked ? "text-primary" : "text-gray-500"}`} />
      <span className="ml-3 font-medium text-gray-800">{label}</span>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onToggle}
      id={controlId}
      aria-label={label}
    />
  </div>
);

const FlexibilityFeatures = () => {
  const t = useTranslations("flexibility");
  const heading = t("heading");
  const description = t("description");
  const cards = t<CardContent[]>("cards");
  const toggleItems = t<ToggleItem[]>("toggles");

  const toggleMap = useMemo(() => {
    return toggleItems.reduce<Record<string, ToggleItem>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [toggleItems]);

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    if (toggleItems.length === 0) {
      return {};
    }
    return toggleItems.reduce<Record<string, boolean>>((acc, item, index) => {
      acc[item.id] = index !== 1;
      return acc;
    }, {});
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">{description}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id} className="rounded-xl border border-gray-200 bg-white p-8">
              <h3 className="text-2xl font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-base text-gray-600">{card.description}</p>
              {card.image ? (
                <div className="mt-8">
                  <SafeImage
                    src={card.image.src}
                    alt={card.image.alt}
                    width={508}
                    height={287}
                    className="w-full rounded-lg object-cover"
                    skeletonClassName="rounded-lg"
                  />
                </div>
              ) : null}
              {card.toggles ? (
                <div className="mt-8 space-y-4">
                  {card.toggles.map((toggleId) => {
                    const item = toggleMap[toggleId];
                    if (!item) return null;
                    const Icon = iconMap[toggleId as IconKey] ?? Search;
                    const checked = toggles[toggleId] ?? false;
                    return (
                      <ToggleFeature
                        key={toggleId}
                        icon={Icon}
                        label={item.label}
                        checked={checked}
                        onToggle={() => handleToggle(toggleId)}
                        controlId={`flex-toggle-${toggleId}`}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlexibilityFeatures;
