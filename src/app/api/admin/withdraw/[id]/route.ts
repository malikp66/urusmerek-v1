import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import {
  getWithdrawRequestById,
  updateWithdrawStatus,
  type WithdrawStatus,
} from '@/lib/services/admin/withdraw';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const withdraw = await getWithdrawRequestById(id);
    if (!withdraw) {
      return NextResponse.json({ ok: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: withdraw });
  } catch (error) {
    console.error('Failed to load withdraw detail', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat detail withdraw' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: 'ID tidak valid' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Payload tidak valid' }, { status: 400 });
  }

  const body = payload as Partial<{
    status: WithdrawStatus;
    notes: string | null;
  }>;

  if (!body.status) {
    return NextResponse.json(
      { ok: false, message: 'Status withdraw wajib diisi' },
      { status: 400 },
    );
  }

  try {
    await updateWithdrawStatus({
      id,
      status: body.status,
      notes: body.notes ?? null,
      processedBy: Number(admin.sub),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update withdraw status', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui status withdraw' },
      { status: 500 },
    );
  }
}
