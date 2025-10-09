"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, FileText, RefreshCw, BarChart3, ShieldAlert, Lock, CalendarClock,
  GitBranch, KeyRound, Headset, FolderKanban, Settings, Files, Workflow, Users,
  FileClock, MessageSquare, Briefcase, Zap, CheckSquare, GanttChartSquare,
  ClipboardList, Package, Scale, BookOpen, Clock, Tag, Globe, LayoutGrid,
  Database, Link as LinkIcon,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { MediaSkeleton } from "@/components/ui/media-skeleton";
import { cn } from "@/lib/utils";

type PrimaryFeature = {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  link: string;
};

type SmallFeature = {
  id: string;
  name: string;
  link: string;
  Icon: React.ElementType;
};

const smallIconMap: Record<string, React.ElementType> = {
  assignment: GitBranch,
  license: KeyRound,
  deadlineAlerts: CalendarClock,
  documentManagement: Files,
  workflow: Workflow,
  dataSecurity: Lock,
  auditTrail: Scale,
  caseManagement: Briefcase,
  internalNotes: MessageSquare,
  versionHistory: FileClock,
  progressSummary: BarChart3,
  tasks: CheckSquare,
  assetManagement: Package,
  knowledgeBase: BookOpen,
  archiveSearch: Search,
  timeTracking: Clock,
  labels: Tag,
  globalJurisdiction: Globe,
  dashboard: LayoutGrid,
  centralStorage: Database,
  forms: FileText,
  support: Headset,
  portfolio: FolderKanban,
  automation: Zap,
  clientList: ClipboardList,
  teamCollaboration: Users,
  settings: Settings,
};


/* === Cards === */
const SmallCard = ({ feature }: { feature?: SmallFeature }) => {
  if (!feature) {
    return <div className="h-full w-full rounded-xl border border-dashed border-smooth bg-white/60" />;
  }

  const Icon = feature.Icon;
  return (
    <Link
      href={feature.link}
      className="group h-full w-full rounded-xl border border-smooth bg-white/90 backdrop-blur-sm
                shadow-sm transition-all duration-300
                hover:-translate-y-[1px] hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]
                flex items-center justify-center text-center p-3"
    >
      <div className="flex flex-col items-center gap-1.5">
        <Icon className="h-5 w-5 text-gray-600 group-hover-stroke-primary" />
        <span className="text-xs font-medium text-gray-700 leading-tight group-hover-text-primary">
          {feature.name}
        </span>
      </div>
    </Link>
  );
};

const LargeCard = ({ feature }: { feature: PrimaryFeature }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <Link
      href={feature.link}
      className="group h-full w-full overflow-hidden rounded-xl border border-smooth bg-white
                shadow-sm shadow-glow-red transition-all duration-300
                hover:-translate-y-[1px] hover:border-primary-strong hover:shadow-red-strong
                flex flex-col"
    >
      <div className="p-0 flex-1">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <MediaSkeleton isVisible={!isLoaded} className="rounded-lg" />
          <Image
            src={feature.image}
            alt={feature.name}
            width={1000}
            height={700}
            priority
            onLoadingComplete={() => setIsLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500 ease-out",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>
    </Link>
  );
};

/* === Grid === */
export default function FeaturesGrid() {
  const t = useTranslations("featuresGrid");
  const eyebrow = t<string>("eyebrow");
  const heading = t<string>("heading");
  const description = t<string>("description");
  const cta = t<string>("cta");
  const primaryFeatures = t<PrimaryFeature[]>("primary") ?? [];
  const smallFeaturesCopy = t<{ id: string; name: string; link: string }[]>("small") ?? [];
  const smallItems = React.useMemo<SmallFeature[]>(
    () =>
      smallFeaturesCopy.map((item) => ({
        ...item,
        Icon: smallIconMap[item.id] ?? LinkIcon,
      })),
    [smallFeaturesCopy]
  );

  const getSmall = (i: number) => (smallItems.length > 0 ? smallItems[i % smallItems.length] : undefined);
  const firstPrimary = primaryFeatures[0];
  const secondPrimary = primaryFeatures[1];
  const thirdPrimary = primaryFeatures[2];
  const fourthPrimary = primaryFeatures[3];

  return (
    <section
      className="relative isolate overflow-hidden py-20 bg-gradient-to-b from-rose-50/70 via-white to-white section-edge-mask-vars"
      style={{ ['--sx1' as any]:'1%', ['--sy1' as any]:'1.5%' }}
    >
      <div className="container mx-auto px-5">
        {/* header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-base eyebrow font-semibold text-primary">{eyebrow}</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{description}</p>
          <div className="mt-10">
            <Button asChild size="lg" className="btn-brand hover:-translate-y-px">
              <Link href="/konsultasi" className="">
                {cta}
              </Link>
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div
          className="relative mx-auto mt-16 max-w-[1510px] grid-edge-mask"
        >
          {/* overlay gradasi halus */}
          {/* <div aria-hidden className="pointer-events-none absolute inset-0 z-10 grid-soft-vignette" /> */}
          <div className="relative z-0 grid grid-cols-8 gap-3 grid-row-lg">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`r1c${i}`} className="col-span-1">
                <SmallCard feature={getSmall(i)} />
              </div>
            ))}

            <div className="col-span-1"><SmallCard feature={getSmall(8)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(9)} /></div>

            {firstPrimary && (
              <div className="col-span-2 row-span-2">
                <LargeCard feature={firstPrimary} />
              </div>
            )}
            {secondPrimary && (
              <div className="col-span-2 row-span-2">
                <LargeCard feature={secondPrimary} />
              </div>
            )}

            <div className="col-span-1"><SmallCard feature={getSmall(10)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(11)} /></div>

            <div className="col-span-1"><SmallCard feature={getSmall(12)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(13)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(14)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(15)} /></div>

            <div className="col-span-1"><SmallCard feature={getSmall(16)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(17)} /></div>

            {thirdPrimary && (
              <div className="col-span-2 row-span-2">
                <LargeCard feature={thirdPrimary} />
              </div>
            )}
            {fourthPrimary && (
              <div className="col-span-2 row-span-2">
                <LargeCard feature={fourthPrimary} />
              </div>
            )}

            <div className="col-span-1"><SmallCard feature={getSmall(18)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(19)} /></div>

            <div className="col-span-1"><SmallCard feature={getSmall(20)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(21)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(22)} /></div>
            <div className="col-span-1"><SmallCard feature={getSmall(23)} /></div>

            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`r6c${i}`} className="col-span-1">
                <SmallCard feature={getSmall(24 + i)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
