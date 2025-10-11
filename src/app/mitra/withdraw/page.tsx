import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getMitraBalance, getMitraWithdraws } from "@/app/mitra/affiliates/queries";
import { RequestWithdrawDialog } from "./_components/RequestWithdrawDialog";
import { WithdrawTable } from "./_components/WithdrawTable";
import { getLocaleFromRequest, getTranslations } from "@/lib/i18n/server";

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

  const locale = await getLocaleFromRequest();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = await getTranslations("panels.partner.withdraw", locale);
  const [balance, withdraws] = await Promise.all([
    getMitraBalance(userId),
    getMitraWithdraws({ userId, page, perPage: 10 }),
  ]);

  const cardLabels = t<any>("cards");
  const summaryCards = [
    {
      title: cardLabels.total.title,
      value: `Rp ${balance.totalEarned.toLocaleString(intlLocale)}`,
      caption: cardLabels.total.caption,
    },
    {
      title: cardLabels.available.title,
      value: `Rp ${balance.available.toLocaleString(intlLocale)}`,
      caption: cardLabels.available.caption
        .replace("{approved}", balance.approved.toLocaleString(intlLocale))
        .replace("{pending}", balance.withdrawPending.toLocaleString(intlLocale)),
    },
    {
      title: cardLabels.paid.title,
      value: `Rp ${balance.paid.toLocaleString(intlLocale)}`,
      caption: cardLabels.paid.caption,
    },
    {
      title: cardLabels.pending.title,
      value: `Rp ${balance.pending.toLocaleString(intlLocale)}`,
      caption: cardLabels.pending.caption,
    },
  ];

  const query = {
    page: String(page),
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <RequestWithdrawDialog availableAmount={balance.available} locale={locale} />
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
          <AlertTitle>{t("emptyAlert.title")}</AlertTitle>
          <AlertDescription>{t("emptyAlert.description")}</AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{t("history.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("history.description")}</p>
        </div>
        <WithdrawTable result={withdraws} query={query} locale={locale} />
      </section>
    </div>
  );
}
