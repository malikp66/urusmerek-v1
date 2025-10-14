import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guards";
import { getReferralById } from "@/lib/services/admin/referrals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLocaleFromRequest, getTranslations } from "@/lib/i18n/server";
import { ReferralStatusForm } from "./_components/ReferralStatusForm";

function formatCurrency(value: number, locale: "id-ID" | "en-US") {
  return `Rp ${value.toLocaleString(locale)}`;
}

export default async function AdminReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await requireAdmin();

  const referralId = Number.parseInt(id, 10);
  if (!Number.isFinite(referralId)) {
    notFound();
  }

  const referral = await getReferralById(referralId);
  if (!referral) {
    notFound();
  }

  const locale = await getLocaleFromRequest();
  const intlLocale = locale === "en" ? "en-US" : "id-ID";
  const t = await getTranslations("panels.admin.referrals.detail", locale);
  const createdAt = referral.createdAt ? new Date(referral.createdAt) : null;
  const paidAt = referral.paidAt ? new Date(referral.paidAt) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("subtitle").replace("{id}", String(referral.id))}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{t("codeLabel").replace("{code}", referral.linkCode)}</span>
          <Badge variant="outline" className="capitalize">
            {referral.status}
          </Badge>
          {createdAt ? (
            <span>
              {t("createdAt")}{" "}
              {createdAt.toLocaleString(intlLocale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          ) : null}
          {paidAt ? (
            <span>
              {t("paidAt")}{" "}
              {paidAt.toLocaleString(intlLocale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t("detailCard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">{t("detailCard.order")}</p>
                <p className="text-base font-semibold">{referral.orderId || "-"}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">{t("detailCard.partner")}</p>
                <p className="text-base font-semibold">{referral.userName}</p>
                <p className="text-xs text-muted-foreground">{referral.userEmail}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {t("detailCard.amount")}
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(referral.amount, intlLocale)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {t("detailCard.commission")}
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(referral.commission, intlLocale)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">{t("detailCard.payout")}</p>
                <p className="text-sm text-muted-foreground">
                  {referral.payoutRequestId
                    ? t("detailCard.payoutValue").replace(
                        "{id}",
                        String(referral.payoutRequestId)
                      )
                    : t("detailCard.payoutEmpty")}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">{t("detailCard.linkId")}</p>
                <p className="text-sm text-muted-foreground">#{referral.linkId}</p>
              </div>
            </div>

            {referral.meta ? (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium">{t("detailCard.metaTitle")}</p>
                  <dl className="grid gap-2 text-sm">
                    {Object.entries(referral.meta).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[120px,1fr] gap-3">
                        <dt className="text-muted-foreground">{key}</dt>
                        <dd className="break-words text-foreground">
                          {typeof value === "string"
                            ? value
                            : JSON.stringify(value, null, 2)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t("statusCard.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferralStatusForm referralId={referral.id} currentStatus={referral.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
