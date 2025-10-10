import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AffTable } from "@/components/mitra/AffTable";
import { RefTable } from "@/components/mitra/RefTable";
import {
  AffiliateStats,
  getAffiliateLinks,
  getAffiliateReferrals,
  getAffiliateStats,
} from "./queries";

export const revalidate = 30;

type SearchParams = Record<string, string | string[] | undefined>;

type Params = {
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

async function StatsCards() {
  const stats = await getAffiliateStats();
  return <StatsGrid stats={stats} />;
}

type StatsGridProps = {
  stats: AffiliateStats;
};

function StatsGrid({ stats }: StatsGridProps) {
  const totalReferrals =
    stats.referrals.pending +
    stats.referrals.approved +
    stats.referrals.rejected +
    stats.referrals.paid;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Mitra Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {stats.totalActivePartners.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Link Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {stats.totalActiveLinks.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Klik 7 Hari Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {stats.clicks7d.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground">
            Total referral lifetime: {totalReferrals.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Referral per Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold">
              {stats.referrals.pending.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="text-lg font-semibold">
              {stats.referrals.approved.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="text-lg font-semibold">
              {stats.referrals.rejected.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-lg font-semibold">
              {stats.referrals.paid.toLocaleString("id-ID")}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="xl:col-span-5 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Commission to-pay
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <p className="text-3xl font-semibold">
            Rp {stats.commissionToPay.toLocaleString("id-ID")}
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Total Amount: Rp {stats.totalAmount.toLocaleString("id-ID")}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Total Commission: Rp {stats.totalCommission.toLocaleString("id-ID")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border bg-muted/50 p-6"
        >
          <div className="mb-4 h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

async function LinksTable({
  search,
  linkPage,
  status,
  refPage,
}: Params) {
  const links = await getAffiliateLinks({ search, page: linkPage });
  const query = {
    search: search ?? undefined,
    status: status ?? undefined,
    linkPage: String(linkPage),
    refPage: String(refPage),
  };
  return <AffTable result={links} query={query} />;
}

async function ReferralsTable({
  search,
  status,
  refPage,
  linkPage,
}: Params) {
  const referrals = await getAffiliateReferrals({
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

export default async function MitraDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const user = await getCurrentUser();
  if (!user || user.role !== "mitra") {
    redirect("/");
  }

  const search = toStringValue(resolvedSearchParams.search);
  const status = toStringValue(resolvedSearchParams.status);
  const linkPage = toNumber(toStringValue(resolvedSearchParams.linkPage), 1);
  const refPage = toNumber(toStringValue(resolvedSearchParams.refPage), 1);

  const params: Params = {
    search,
    status,
    linkPage,
    refPage,
  };

  return (
    <div className="container space-y-10 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard Mitra</h1>
        <p className="text-sm text-muted-foreground">
          Pantau performa mitra, link, dan referral terbaru.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>

      <section className="space-y-6">
        <div className="rounded-xl border bg-card p-4">
          <form className="grid gap-4 md:grid-cols-4" action="/mitra/affiliates">
            <input type="hidden" name="linkPage" value="1" />
            <input type="hidden" name="refPage" value="1" />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium" htmlFor="search">
                Pencarian (kode / email)
              </label>
              <Input
                id="search"
                name="search"
                defaultValue={search ?? ""}
                placeholder="Cari kode atau email mitra"
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
            <div className="flex items-end gap-2">
              <Button type="submit">Terapkan</Button>
              <Button variant="ghost" type="reset" asChild>
                <a href="/mitra/affiliates">Reset</a>
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Link Mitra</h2>
              <p className="text-sm text-muted-foreground">
                Statistik klik dan komisi untuk setiap link aktif.
              </p>
            </div>
            <Suspense fallback={<TableSkeleton />}>
              <LinksTable {...params} />
            </Suspense>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Referrals</h2>
              <p className="text-sm text-muted-foreground">
                Kelola status referral dan komisi pembayaran.
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
