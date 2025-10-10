import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import {
  getDefaultCommissionSetting,
  upsertDefaultCommissionSetting,
} from '@/lib/services/admin/commission';

export async function GET() {
  await requireAdmin();

  try {
    const setting = await getDefaultCommissionSetting();
    return NextResponse.json({ ok: true, data: setting });
  } catch (error) {
    console.error('Failed to load commission setting', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat pengaturan komisi' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Payload tidak valid' }, { status: 400 });
  }

  const body = payload as Partial<{ defaultRate: number }>;
  if (typeof body.defaultRate !== 'number' || Number.isNaN(body.defaultRate)) {
    return NextResponse.json(
      { ok: false, message: 'defaultRate wajib berupa angka' },
      { status: 400 },
    );
  }

  try {
    await upsertDefaultCommissionSetting({
      rate: body.defaultRate,
      adminId: Number(admin.sub),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update default commission', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui pengaturan komisi' },
      { status: 500 },
    );
  }
}
