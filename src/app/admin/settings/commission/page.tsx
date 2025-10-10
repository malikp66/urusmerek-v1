import { requireAdmin } from '@/lib/auth-guards';
import { getDefaultCommissionSetting } from '@/lib/services/admin/commission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DefaultCommissionForm } from './_components/DefaultCommissionForm';

export default async function AdminCommissionSettingsPage() {
  await requireAdmin();
  const setting = await getDefaultCommissionSetting();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pengaturan Komisi Default</h2>
        <p className="text-sm text-muted-foreground">
          Atur komisi dasar yang berlaku untuk seluruh mitra kecuali yang memiliki pengaturan
          khusus.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Komisi Default</CardTitle>
        </CardHeader>
        <CardContent>
          <DefaultCommissionForm defaultRate={setting?.defaultRate ?? 0.1} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Catatan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • Komisi default akan digunakan saat mitra belum memiliki pengaturan khusus.
            <br />• Pengaturan custom dapat diubah pada halaman detail mitra.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
