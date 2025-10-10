import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminConsultations } from '@/lib/services/admin/consultations';

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const perPage = Number.parseInt(searchParams.get('perPage') ?? '20', 10);
  const status = searchParams.get('status') ?? 'all';
  const search = searchParams.get('search');

  try {
    const result = await getAdminConsultations({
      status: status === 'all' ? 'all' : (status as any),
      search,
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? perPage : 20,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Failed to load consultations list', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat konsultasi' },
      { status: 500 },
    );
  }
}
