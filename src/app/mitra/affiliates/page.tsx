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

function PerformanceSection({ dashboard }: { dashboard: MitraDashboardData }) {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Performa Referral</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pantau tren klik dan referral dalam 7 dan 30 hari terakhir.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="7d" className="space-y-4">
          <TabsList>
            <TabsTrigger value="7d">7 Hari</TabsTrigger>
            <TabsTrigger value="30d">30 Hari</TabsTrigger>
          </TabsList>
          <TabsContent value="7d">
            <PerformanceChart data={dashboard.performance7d} />
          </TabsContent>
          <TabsContent value="30d">
            <PerformanceChart data={dashboard.performance30d} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function DashboardStats({
  dashboard,
  balance,
}: {
  dashboard: MitraDashboardData;
  balance: MitraBalance;
}) {
  const { stats } = dashboard;
  const totalLeads =
    stats.referralsPending +
    stats.referralsApproved +
    stats.referralsPaid +
    stats.referralsRejected;

  const statCards = [
    {
      title: "Klik 7 Hari Terakhir",
      value: stats.clicks7d.toLocaleString("id-ID"),
      caption: `${totalLeads.toLocaleString("id-ID")} referral seumur hidup`,
    },
    {
      title: "Total Lead",
      value: totalLeads.toLocaleString("id-ID"),
      caption: `${stats.referralsApproved.toLocaleString(
        "id-ID"
      )} menunggu pencairan`,
    },
    {
      title: "Komisi Terkumpul",
      value: `Rp ${stats.totalCommission.toLocaleString("id-ID")}`,
      caption: `Paid ${stats.paidCommission.toLocaleString("id-ID")}`,
    },
    {
      title: "Komisi Siap Cair",
      value: `Rp ${balance.available.toLocaleString("id-ID")}`,
      caption: `Approved ${stats.approvedCommission.toLocaleString("id-ID")}`,
    },
    {
      title: "Withdraw Pending",
      value: `Rp ${stats.withdrawPending.toLocaleString("id-ID")}`,
      caption:
        stats.withdrawPending > 0
          ? "Menunggu verifikasi tim Kami"
          : "Belum ada permintaan",
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard Mitra</h1>
          <p className="text-sm text-muted-foreground">
            Pantau performa link, referral terbaru, dan komisi yang siap dicairkan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateLinkDialog />
          <Button variant="outline" asChild>
            <a href="/mitra/withdraw">Kelola Withdraw</a>
          </Button>
        </div>
      </div>

      <DashboardStats dashboard={dashboard} balance={balance} />

      <PerformanceSection dashboard={dashboard} />

      {hasApprovedToWithdraw ? (
        <Alert>
          <AlertTitle>Ada komisi yang siap dicairkan!</AlertTitle>
          <AlertDescription>
            Kamu memiliki komisi approved yang belum diajukan withdraw. Buka tab withdraw
            untuk mengajukan pencairan.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
            <form className="grid gap-3 md:col-span-3 md:grid-cols-4" action="/mitra/affiliates">
              <input type="hidden" name="linkPage" value="1" />
              <input type="hidden" name="refPage" value="1" />
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" htmlFor="search">
                  Pencarian Link
                </label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder="Cari kode link"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="status">
                  Status Referral
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={status ?? ""}
                  className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex items-end gap-2 md:col-span-2">
                <Button type="submit">Terapkan</Button>
                <Button variant="ghost" type="reset" asChild>
                  <a href="/mitra/affiliates">Reset</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Link Referral</h2>
              <p className="text-sm text-muted-foreground">
                Perbarui status link dan pantau performa klik serta komisi.
              </p>
            </div>
            <Suspense fallback={<TableSkeleton />}>
              <LinksTable {...params} />
            </Suspense>
          </div>

          <div id="referrals" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Riwayat Referral</h2>
              <p className="text-sm text-muted-foreground">
                Lihat riwayat referral dan status pencairan komisinya.
              </p>
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
