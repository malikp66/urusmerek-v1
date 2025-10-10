import { notFound } from 'next/navigation';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminPartnerDetail } from '@/lib/services/admin/partners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CommissionSettingForm } from './_components/CommissionSettingForm';

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default async function AdminPartnerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const partnerId = Number.parseInt(params.id, 10);
  if (!Number.isFinite(partnerId)) {
    notFound();
  }

  const detail = await getAdminPartnerDetail(partnerId);
  if (!detail) {
    notFound();
  }

  const createdAt = detail.createdAt ? new Date(detail.createdAt) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Mitra</p>
          <h2 className="text-2xl font-semibold tracking-tight">{detail.name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{detail.email}</span>
          <Badge variant="outline" className="capitalize">
            {detail.role}
          </Badge>
          {createdAt ? (
            <span>
              Bergabung {createdAt.toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Komisi Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrency(detail.stats.approvedCommission)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Komisi Dibayar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrency(detail.stats.paidCommission)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Withdraw Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrency(detail.stats.pendingWithdraw)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pengaturan Komisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CommissionSettingForm
              partnerId={detail.id}
              defaultRate={detail.commission?.defaultRate ?? 0.1}
              customRates={detail.commission?.customRates ?? null}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Rekening Mitra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detail.bankAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Mitra belum menambahkan informasi rekening.
              </p>
            ) : (
              detail.bankAccounts.map((account) => (
                <div key={account.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {account.bankName} • {account.bankCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {account.accountName} — {account.accountNumber}
                      </p>
                    </div>
                    {account.isDefault ? (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="links" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="links">Link Referral</TabsTrigger>
          <TabsTrigger value="withdraw">Riwayat Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Link Aktif</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Klik</TableHead>
                    <TableHead>Referral</TableHead>
                    <TableHead>Komisi Lifetime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.links.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Belum ada link.
                      </TableCell>
                    </TableRow>
                  ) : (
                    detail.links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{link.code}</span>
                            <span className="text-xs text-muted-foreground">
                              Dibuat{' '}
                              {new Date(link.createdAt).toLocaleDateString('id-ID', {
                                dateStyle: 'medium',
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {link.isActive ? (
                            <Badge variant="secondary">Aktif</Badge>
                          ) : (
                            <Badge variant="destructive">Nonaktif</Badge>
                          )}
                        </TableCell>
                        <TableCell>{link.clicks.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{link.referrals.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{formatCurrency(link.lifetimeCommission)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Riwayat Withdraw</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Terakhir Diperbarui</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.withdraws.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Belum ada riwayat withdraw.
                      </TableCell>
                    </TableRow>
                  ) : (
                    detail.withdraws.map((withdraw) => (
                      <TableRow key={withdraw.id}>
                        <TableCell>#{withdraw.id}</TableCell>
                        <TableCell>{formatCurrency(withdraw.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {withdraw.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(withdraw.updatedAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Riwayat menampilkan 20 transaksi terakhir. Gunakan API atau export data untuk
    detail lengkap.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
