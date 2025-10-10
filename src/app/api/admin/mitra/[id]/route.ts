import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import { upsertUserCommissionSetting } from '@/lib/services/admin/commission';
import { getAdminPartnerDetail } from '@/lib/services/admin/partners';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json(
      { ok: false, message: 'ID mitra tidak valid' },
      { status: 400 },
    );
  }

  try {
    const detail = await getAdminPartnerDetail(id);
    if (!detail) {
      return NextResponse.json({ ok: false, message: 'Mitra tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: detail });
  } catch (error) {
    console.error('Failed to load admin mitra detail', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat detail mitra' },
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
    return NextResponse.json(
      { ok: false, message: 'ID mitra tidak valid' },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Payload tidak valid' }, { status: 400 });
  }

  const body = payload as Partial<{
    defaultRate: number;
    customRates: Record<string, unknown> | null;
  }>;

  if (typeof body.defaultRate !== 'number' || Number.isNaN(body.defaultRate)) {
    return NextResponse.json(
      { ok: false, message: 'defaultRate wajib berupa angka' },
      { status: 400 },
    );
  }

  try {
    await upsertUserCommissionSetting({
      userId: id,
      rate: body.defaultRate,
      customRates: body.customRates ?? null,
      adminId: Number(admin.sub),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update commission setting', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui komisi mitra' },
      { status: 500 },
    );
  }
}
