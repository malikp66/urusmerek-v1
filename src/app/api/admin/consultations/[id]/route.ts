import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import {
  getConsultationById,
  updateConsultation,
  type ConsultationStatus,
} from '@/lib/services/admin/consultations';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  try {
    const consultation = await getConsultationById(params.id);
    if (!consultation) {
      return NextResponse.json({ ok: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: consultation });
  } catch (error) {
    console.error('Failed to load consultation detail', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat detail konsultasi' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Payload tidak valid' }, { status: 400 });
  }

  const body = payload as Partial<{
    status: ConsultationStatus;
    notes: string | null;
    assignedTo: number | null;
  }>;

  try {
    await updateConsultation({
      id: params.id,
      status: body.status,
      notes: body.notes ?? null,
      assignedTo: body.assignedTo ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update consultation', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui konsultasi' },
      { status: 500 },
    );
  }
}
