import { Metadata } from 'next';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminDashboardStats } from '@/lib/services/admin/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ringkasan Operasional</h2>
        <p className="text-sm text-muted-foreground">
          Pantau performa mitra, konsultasi, dan status withdraw terbaru.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Mitra</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalPartners.toLocaleString('id-ID')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Link Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.activeLinks.toLocaleString('id-ID')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Konsultasi Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {stats.pendingConsultations.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Withdraw Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {stats.pendingWithdrawRequests.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status Komisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Komisi Approved</p>
                <p className="text-xs text-muted-foreground">Komisi siap untuk dicairkan</p>
              </div>
              <p className="text-right text-xl font-semibold">
                Rp {stats.commissionApproved.toLocaleString('id-ID')}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Komisi Tersalurkan</p>
                <p className="text-xs text-muted-foreground">Komisi yang sudah dibayarkan</p>
              </div>
              <p className="text-right text-xl font-semibold">
                Rp {stats.commissionPaid.toLocaleString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tindak Lanjut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Review konsultasi baru dan assign ke tim legal.
              <br />• Verifikasi permintaan withdraw sebelum jatuh tempo.
              <br />• Update komisi mitra yang memerlukan penyesuaian.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
