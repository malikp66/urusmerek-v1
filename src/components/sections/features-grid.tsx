"use client";

import React from "react";
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
import { SafeImage } from "@/components/ui/safe-image";
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
const SmallCard = ({ feature, className }: { feature?: SmallFeature; className?: string }) => {
  if (!feature) {
    return (
      <div
        className={cn(
          "h-full w-full rounded-xl border border-dashed border-smooth bg-white/60",
          className
        )}
      />
    );
  }

  const Icon = feature.Icon;
  return (
    <Link
      href={feature.link}
      className={cn(
        "group flex h-full w-full items-center justify-center rounded-xl border border-smooth bg-white/90 p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)] backdrop-blur-sm",
        className
      )}
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

const LargeCard = ({ feature, className }: { feature: PrimaryFeature; className?: string }) => {
  return (
    <Link
      href={feature.link}
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-xl border border-smooth bg-white shadow-sm shadow-glow-red transition-all duration-300 hover:-translate-y-[1px] hover:border-primary-strong hover:shadow-red-strong",
        className
      )}
    >
      <div className="p-0 flex-1">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <SafeImage
            src={feature.image}
            alt={feature.name}
            width={1000}
            height={700}
            priority
            className="h-full w-full object-cover"
            skeletonClassName="rounded-lg"
            containerClassName="h-full w-full"
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

  const getSmall = React.useCallback(
    (i: number) => (smallItems.length > 0 ? smallItems[i % smallItems.length] : undefined),
    [smallItems]
  );
  const firstPrimary = primaryFeatures[0];
  const secondPrimary = primaryFeatures[1];
  const thirdPrimary = primaryFeatures[2];
  const fourthPrimary = primaryFeatures[3];

  const renderGridCells = React.useCallback(
    ({
      smallCardClassName,
      largeCardClassName,
    }: {
      smallCardClassName?: string;
      largeCardClassName?: string;
    }) => {
      const renderSmall = (index: number, key: string) => (
        <div key={key} className="col-span-1">
          <SmallCard feature={getSmall(index)} className={smallCardClassName} />
        </div>
      );

      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => renderSmall(i, `r1c${i}`))}

          {renderSmall(8, "r2c1")}
          {renderSmall(9, "r2c2")}

          {firstPrimary && (
            <div className="col-span-2 row-span-2">
              <LargeCard feature={firstPrimary} className={largeCardClassName} />
            </div>
          )}
          {secondPrimary && (
            <div className="col-span-2 row-span-2">
              <LargeCard feature={secondPrimary} className={largeCardClassName} />
            </div>
          )}

          {renderSmall(10, "r2c5")}
          {renderSmall(11, "r2c6")}

          {renderSmall(12, "r3c1")}
          {renderSmall(13, "r3c2")}
          {renderSmall(14, "r3c5")}
          {renderSmall(15, "r3c6")}

          {renderSmall(16, "r4c1")}
          {renderSmall(17, "r4c2")}

          {thirdPrimary && (
            <div className="col-span-2 row-span-2">
              <LargeCard feature={thirdPrimary} className={largeCardClassName} />
            </div>
          )}
          {fourthPrimary && (
            <div className="col-span-2 row-span-2">
              <LargeCard feature={fourthPrimary} className={largeCardClassName} />
            </div>
          )}

          {renderSmall(18, "r4c5")}
          {renderSmall(19, "r4c6")}

          {renderSmall(20, "r5c1")}
          {renderSmall(21, "r5c2")}
          {renderSmall(22, "r5c5")}
          {renderSmall(23, "r5c6")}

          {Array.from({ length: 8 }).map((_, i) => renderSmall(24 + i, `r6c${i}`))}
        </>
      );
    },
    [getSmall, firstPrimary, secondPrimary, thirdPrimary, fourthPrimary]
  );

  const renderGrid = React.useCallback(
    ({
      className,
      autoRows,
      smallCardClassName,
      largeCardClassName,
    }: {
      className?: string;
      autoRows?: string;
      smallCardClassName?: string;
      largeCardClassName?: string;
    }) => (
      <div
        className={cn("grid grid-cols-8 gap-3", className)}
        style={autoRows ? { gridAutoRows: autoRows } : undefined}
      >
        {renderGridCells({ smallCardClassName, largeCardClassName })}
      </div>
    ),
    [renderGridCells]
  );

  return (
    <section
      className="relative isolate overflow-x-hidden overflow-y-visible py-20 bg-gradient-to-b from-rose-50/70 via-white to-white section-edge-mask-vars"
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
        <div className="relative mx-auto mt-16 max-w-[1510px] grid-edge-mask">
          {/* Mobile & tablet layout */}
          <div className="-mx-5 lg:hidden">
            <div className="overflow-x-auto px-5 pb-6">
              <div className="mx-auto min-w-[1080px] max-w-[1510px]">
                {renderGrid({
                  autoRows: "118px",
                  smallCardClassName: "min-h-[118px]",
                  largeCardClassName: "min-h-[236px]",
                })}
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="relative z-0 hidden lg:block">
            {renderGrid({ className: "grid-row-lg" })}
          </div>
        </div>
      </div>
    </section>
  );
}
