import { notFound } from 'next/navigation';

import { consultationStatusEnum } from '@/db/schema';
import { requireAdmin } from '@/lib/auth-guards';
import { getConsultationById } from '@/lib/services/admin/consultations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ConsultationStatusForm } from './_components/ConsultationStatusForm';

export default async function AdminConsultationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const consultation = await getConsultationById(params.id);
  if (!consultation) {
    notFound();
  }

  const createdAt = consultation.createdAt
    ? new Date(consultation.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '-';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Pengajuan Konsultasi</p>
          <h2 className="text-2xl font-semibold tracking-tight">{consultation.brandName}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{consultation.email}</span>
          <Badge variant="outline" className="capitalize">
            {consultation.status.replace('_', ' ')}
          </Badge>
          <span>{createdAt}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Detail Pemohon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">Nama Pemohon</p>
                <p className="text-lg font-semibold">{consultation.applicantName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase text-muted-foreground">Layanan</p>
                <p className="text-lg font-semibold">{consultation.service}</p>
              </div>
            </div>
            <Separator />
            <ConsultationStatusForm
              consultationId={consultation.id}
              currentStatus={consultation.status}
              currentNotes={consultation.notes ?? ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Catatan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Catatan Internal</p>
              <p className="mt-1 whitespace-pre-line">
                {consultation.notes && consultation.notes.length > 0
                  ? consultation.notes
                  : 'Belum ada catatan'}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase text-muted-foreground">Status Tersedia</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {consultationStatusEnum.enumValues
                  .map((status) => status.replace('_', ' '))
                  .join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
