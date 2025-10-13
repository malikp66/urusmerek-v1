import { notFound } from 'next/navigation';

import { requireAdmin } from '@/lib/auth-guards';
import {
  getWithdrawRequestById,
  type WithdrawStatus,
} from '@/lib/services/admin/withdraw';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { WithdrawStatusForm } from './_components/WithdrawStatusForm';

const STATUS_BADGE_VARIANT: Record<WithdrawStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  approved: 'secondary',
  processing: 'secondary',
  paid: 'default',
  rejected: 'destructive',
};

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default async function AdminWithdrawDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const withdrawId = Number.parseInt(params.id, 10);
  if (!Number.isFinite(withdrawId)) {
    notFound();
  }

  const withdraw = await getWithdrawRequestById(withdrawId);
  if (!withdraw) {
    notFound();
  }

  const bank = withdraw.bankSnapshot ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Withdraw #{withdraw.id}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{withdraw.userName}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{withdraw.userEmail}</span>
          <Badge variant={STATUS_BADGE_VARIANT[withdraw.status]} className="capitalize">
            {withdraw.status}
          </Badge>
          <span>
            Diajukan{' '}
            {new Date(withdraw.createdAt).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Detail Permintaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">Jumlah Diminta</p>
                <p className="text-xl font-semibold">{formatCurrency(withdraw.amount)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">Status Saat Ini</p>
                <p className="text-xl font-semibold capitalize">{withdraw.status}</p>
              </div>
            </div>
            <Separator />
            <WithdrawStatusForm
              withdrawId={withdraw.id}
              currentStatus={withdraw.status}
              currentNotes={withdraw.notes ?? ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Rekening Tujuan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">{(bank.bankName as string) ?? 'Bank tidak diketahui'}</p>
              <p className="text-xs text-muted-foreground">
                {(bank.bankCode as string) ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{(bank.accountName as string) ?? '-'}</p>
              <p className="text-xs text-muted-foreground">
                {(bank.accountNumber as string) ?? '-'}
              </p>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Catatan terbaru:</p>
              <p className="font-medium text-foreground">
                {withdraw.notes ? withdraw.notes : 'Belum ada catatan'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
