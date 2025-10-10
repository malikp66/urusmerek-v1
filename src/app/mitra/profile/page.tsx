import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerBankAccounts, partnerProfiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateMitraProfile } from "./actions";

export const revalidate = 0;

export default async function MitraProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "mitra") {
    redirect("/");
  }

  const userId = Number(user.sub);

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
        <h1 className="text-3xl font-semibold tracking-tight">Profil Mitra</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui informasi kontak dan pilih rekening utama untuk pencairan komisi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMitraProfile} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone ?? ""}
                  placeholder="Contoh: 081234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">NPWP (opsional)</Label>
                <Input
                  id="taxNumber"
                  name="taxNumber"
                  defaultValue={profile?.taxNumber ?? ""}
                  placeholder="Nomor NPWP bila tersedia"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                name="address"
                rows={4}
                placeholder="Alamat lengkap untuk keperluan administrasi"
                defaultValue={profile?.address ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBankId">Rekening Default</Label>
              <select
                id="defaultBankId"
                name="defaultBankId"
                defaultValue={bankDefaultId ? String(bankDefaultId) : ""}
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow]"
              >
                <option value="">Pilih rekening default</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={String(account.id)}>
                    {account.bankName} • {account.accountNumber}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Rekening default akan digunakan otomatis saat mengajukan withdraw baru.
              </p>
            </div>

            <Button type="submit">Simpan Perubahan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
