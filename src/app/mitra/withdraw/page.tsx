import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getMitraBalance, getMitraWithdraws } from "@/app/mitra/affiliates/queries";
import { RequestWithdrawDialog } from "./_components/RequestWithdrawDialog";
import { WithdrawTable } from "./_components/WithdrawTable";

type SearchParams = Record<string, string | string[] | undefined>;

function toNumber(value: string | string[] | undefined, fallback: number) {
  if (Array.isArray(value)) {
    return toNumber(value[0], fallback);
  }
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export default async function MitraWithdrawPage({
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
  const page = toNumber(resolved.page, 1);

  const [balance, withdraws] = await Promise.all([
    getMitraBalance(userId),
    getMitraWithdraws({ userId, page, perPage: 10 }),
  ]);

  const summaryCards = [
    {
      title: "Total Komisi",
      value: `Rp ${balance.totalEarned.toLocaleString("id-ID")}`,
      caption: "Akumulasi seluruh komisi",
    },
    {
      title: "Komisi Siap Cair",
      value: `Rp ${balance.available.toLocaleString("id-ID")}`,
      caption: `${balance.approved.toLocaleString("id-ID")} approved - ${balance.withdrawPending.toLocaleString("id-ID")} pending withdraw`,
    },
    {
      title: "Komisi Dibayar",
      value: `Rp ${balance.paid.toLocaleString("id-ID")}`,
      caption: "Sudah ditransfer oleh tim kami",
    },
    {
      title: "Komisi Pending",
      value: `Rp ${balance.pending.toLocaleString("id-ID")}`,
      caption: "Menunggu verifikasi internal",
    },
  ];

  const query = {
    page: String(page),
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Withdraw Komisi</h1>
          <p className="text-sm text-muted-foreground">
            Ajukan pencairan komisi dan pantau statusnya secara real-time.
          </p>
        </div>
        <RequestWithdrawDialog availableAmount={balance.available} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {balance.available <= 0 ? (
        <Alert variant="default">
          <AlertTitle>Belum ada komisi siap cair</AlertTitle>
          <AlertDescription>
            Komisi akan muncul di sini setelah referral kamu berstatus approved. Pantau terus
            performa link di dashboard.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Riwayat Permintaan</h2>
          <p className="text-sm text-muted-foreground">
            Status diperbarui oleh tim finance. Catatan akan muncul jika dibutuhkan aksi tambahan.
          </p>
        </div>
        <WithdrawTable result={withdraws} query={query} />
      </section>
    </div>
  );
}
