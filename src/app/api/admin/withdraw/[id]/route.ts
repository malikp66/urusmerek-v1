import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import {
  getWithdrawRequestById,
  updateWithdrawStatus,
  type WithdrawStatus,
} from '@/lib/services/admin/withdraw';
import { notifyWithdrawStatusChange } from '@/lib/notifications';

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

  const existing = await getWithdrawRequestById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, message: 'Data tidak ditemukan' }, { status: 404 });
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

    const updated = await getWithdrawRequestById(id);
    if (updated) {
      const snapshot = (updated.bankSnapshot ?? {}) as Record<string, unknown>;
      notifyWithdrawStatusChange({
        withdrawId: updated.id,
        amount: updated.amount,
        partnerName: updated.userName,
        partnerEmail: updated.userEmail,
        bank: {
          bankName: typeof snapshot.bankName === 'string' ? snapshot.bankName : undefined,
          bankCode: typeof snapshot.bankCode === 'string' ? snapshot.bankCode : undefined,
          accountName: typeof snapshot.accountName === 'string' ? snapshot.accountName : undefined,
          accountNumber:
            typeof snapshot.accountNumber === 'string' ? snapshot.accountNumber : undefined,
        },
        previousStatus: existing.status,
        currentStatus: updated.status,
        notes: body.notes ?? updated.notes ?? null,
        updatedAt: updated.updatedAt,
        processedBy: Number(admin.sub),
      }).catch((error) => {
        console.error(
          '[notifications] Failed sending withdraw status change notification',
          error,
        );
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update withdraw status', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui status withdraw' },
      { status: 500 },
    );
  }
}
