import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerBankAccounts, partnerProfiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateMitraProfile } from "./actions";
import { getLocaleFromRequest, getTranslations } from "@/lib/i18n/server";
import { signOut } from "@/lib/actions/sign-out";

export const revalidate = 0;

export default async function MitraProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "mitra") {
    redirect("/");
  }

  const userId = Number(user.sub);
  const locale = getLocaleFromRequest();
  const t = getTranslations("panels.partner.profile", locale);

  const profile = await db.query.partnerProfiles.findFirst({
    where: eq(partnerProfiles.userId, userId),
  });

  const bankAccounts = await db
    .select()
    .from(partnerBankAccounts)
    .where(eq(partnerBankAccounts.userId, userId))
    .orderBy(desc(partnerBankAccounts.isDefault), desc(partnerBankAccounts.createdAt));

  const bankDefaultId = bankAccounts.find((bank) => bank.isDefault)?.id ?? undefined;

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{t("contactTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMitraProfile} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneLabel")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone ?? ""}
                  placeholder={t("phonePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">{t("taxLabel")}</Label>
                <Input
                  id="taxNumber"
                  name="taxNumber"
                  defaultValue={profile?.taxNumber ?? ""}
                  placeholder={t("taxPlaceholder")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t("addressLabel")}</Label>
              <Textarea
                id="address"
                name="address"
                rows={4}
                placeholder={t("addressPlaceholder")}
                defaultValue={profile?.address ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBankId">{t("bankLabel")}</Label>
              <select
                id="defaultBankId"
                name="defaultBankId"
                defaultValue={bankDefaultId ? String(bankDefaultId) : ""}
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
              >
                <option value="">{t("bankPlaceholder")}</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={String(account.id)}>
                    {account.bankName} • {account.accountNumber}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {t("bankHelp")}
              </p>
            </div>

            <Button type="submit">{t("save")}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Keluar dari Akun</CardTitle>
          <CardDescription>
            Akhiri sesi Anda di panel mitra dengan aman setelah selesai menggunakan akun ini.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t justify-end">
          <form action={signOut}>
            <Button type="submit" variant="destructive">
              Keluar
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
