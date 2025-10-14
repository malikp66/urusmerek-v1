import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AffTable } from "@/components/mitra/AffTable";
import { RefTable } from "@/components/mitra/RefTable";
import {
  MitraDashboardData,
  MitraBalance,
  PaginatedResult,
  ReferralRow,
  getMitraBalance,
  getMitraDashboardData,
  getMitraLinks,
  getMitraReferrals,
} from "./queries";
import { CreateLinkDialog } from "./_components/CreateLinkDialog";
import { PerformanceChart } from "./_components/PerformanceChart";
import { getLocaleFromRequest, getTranslations } from "@/lib/i18n/server";

export const revalidate = 30;

type SearchParams = Record<string, string | string[] | undefined>;

type Params = {
  userId: number;
  search?: string | null;
  status?: string | null;
  linkPage: number;
  refPage: number;
};

function toStringValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? null;
}

function toNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

async function LinksTable({ userId, search, linkPage, status, refPage }: Params) {
  const links = await getMitraLinks({ userId, search, page: linkPage });
  const query = {
    search: search ?? undefined,
    status: status ?? undefined,
    linkPage: String(linkPage),
    refPage: String(refPage),
  };
  return <AffTable result={links} query={query} />;
}

async function ReferralsTable({ userId, search, status, refPage, linkPage }: Params) {
  const referrals = await getMitraReferrals({
    userId,
    search,
    status,
    page: refPage,
  });
  const query = {
    search: search ?? undefined,
    status: status ?? undefined,
    linkPage: String(linkPage),
    refPage: String(refPage),
  };
  return <RefTable result={referrals} query={query} />;
}

async function PerformanceSection({
  dashboard,
  locale,
}: {
  dashboard: MitraDashboardData;
  locale: "id" | "en";
}) {
  const t = await getTranslations("panels.partner.dashboard", locale);
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">{t("performance.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("performance.description")}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="7d" className="space-y-4">
          <TabsList>
            <TabsTrigger value="7d">{t("performance.tabs.sevenDays")}</TabsTrigger>
            <TabsTrigger value="30d">{t("performance.tabs.thirtyDays")}</TabsTrigger>
          </TabsList>
          <TabsContent value="7d">
            <PerformanceChart data={dashboard.performance7d} locale={locale} />
          </TabsContent>
          <TabsContent value="30d">
            <PerformanceChart data={dashboard.performance30d} locale={locale} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

async function DashboardStats({
  dashboard,
  balance,
  locale,
}: {
  dashboard: MitraDashboardData;
  balance: MitraBalance;
  locale: "id" | "en";
}) {
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = await getTranslations("panels.partner.dashboard", locale);
  const { stats } = dashboard;
  const totalLeads =
    stats.referralsPending +
    stats.referralsApproved +
    stats.referralsPaid +
    stats.referralsRejected;

  const statLabels = t<{
    clicks7d: { title: string; caption: string };
    totalLeads: { title: string; caption: string };
    totalCommission: { title: string; caption: string };
    readyToWithdraw: { title: string; caption: string };
    withdrawPending: { title: string; captionPending: string; captionEmpty: string };
  }>("stats");
  const statCards = [
    {
      title: statLabels.clicks7d.title,
      value: stats.clicks7d.toLocaleString(intlLocale),
      caption: statLabels.clicks7d.caption.replace(
        "{total}",
        totalLeads.toLocaleString(intlLocale)
      ),
    },
    {
      title: statLabels.totalLeads.title,
      value: totalLeads.toLocaleString(intlLocale),
      caption: statLabels.totalLeads.caption.replace(
        "{approved}",
        stats.referralsApproved.toLocaleString(intlLocale)
      ),
    },
    {
      title: statLabels.totalCommission.title,
      value: `Rp ${stats.totalCommission.toLocaleString(intlLocale)}`,
      caption: statLabels.totalCommission.caption.replace(
        "{amount}",
        stats.paidCommission.toLocaleString(intlLocale)
      ),
    },
    {
      title: statLabels.readyToWithdraw.title,
      value: `Rp ${balance.available.toLocaleString(intlLocale)}`,
      caption: statLabels.readyToWithdraw.caption.replace(
        "{amount}",
        stats.approvedCommission.toLocaleString(intlLocale)
      ),
    },
    {
      title: statLabels.withdrawPending.title,
      value: `Rp ${stats.withdrawPending.toLocaleString(intlLocale)}`,
      caption:
        stats.withdrawPending > 0
          ? statLabels.withdrawPending.captionPending
          : statLabels.withdrawPending.captionEmpty,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {statCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-semibold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function MitraDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;

  const user = await getCurrentUser();
  if (!user || user.role !== "mitra") {
    redirect("/");
  }

  const locale = await getLocaleFromRequest();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = await getTranslations("panels.partner.dashboard", locale);
  const userId = Number(user.sub);
  const search = toStringValue(resolved.search);
  const status = toStringValue(resolved.status);
  const linkPage = toNumber(toStringValue(resolved.linkPage), 1);
  const refPage = toNumber(toStringValue(resolved.refPage), 1);

  const [dashboard, balance] = await Promise.all([
    getMitraDashboardData(userId),
    getMitraBalance(userId),
  ]);

  const params: Params = {
    userId,
    search,
    status,
    linkPage,
    refPage,
  };

  const hasApprovedToWithdraw =
    dashboard.stats.approvedCommission - dashboard.stats.withdrawPending > 0;

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CreateLinkDialog />
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href="/mitra/withdraw">{t("manageWithdraw")}</a>
          </Button>
        </div>
      </div>

      <DashboardStats dashboard={dashboard} balance={balance} locale={locale} />

      <PerformanceSection dashboard={dashboard} locale={locale} />

      {hasApprovedToWithdraw ? (
        <Alert>
          <AlertTitle>{t("alerts.ready.title")}</AlertTitle>
          <AlertDescription>{t("alerts.ready.description")}</AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
            <form
              className="grid gap-3 md:col-span-3 md:grid-cols-4"
              action="/mitra/affiliates"
            >
              <input type="hidden" name="linkPage" value="1" />
              <input type="hidden" name="refPage" value="1" />
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" htmlFor="search">
                  {t("filters.searchLabel")}
                </label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder={t("filters.searchPlaceholder")}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="status">
                  {t("filters.statusLabel")}
                </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={status ?? ""}
                    className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
                  >
                  {Object.entries(t<Record<string, string>>("filters.statusOptions")).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                    </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:items-end">
                <Button type="submit" className="w-full md:w-auto">
                  {t("filters.apply")}
                </Button>
                <Button variant="ghost" type="reset" asChild className="w-full md:w-auto">
                  <a href="/mitra/affiliates">{t("filters.reset")}</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t("sections.links.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("sections.links.description")}</p>
            </div>
            <Suspense fallback={<TableSkeleton />}>
              <LinksTable {...params} />
            </Suspense>
          </div>

          <div id="referrals" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t("sections.referrals.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("sections.referrals.description")}</p>
            </div>
            <Suspense fallback={<TableSkeleton />}>
              <ReferralsTable {...params} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse rounded-xl border bg-muted/50 p-6">
        <div className="h-32 rounded bg-muted" />
      </div>
      <div className="animate-pulse rounded-lg bg-muted/50 p-4">
        <div className="h-4 w-48 rounded bg-muted" />
      </div>
    </div>
  );
}
