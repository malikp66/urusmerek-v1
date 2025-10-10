import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminPartnersList } from '@/lib/services/admin/partners';

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const perPage = Number.parseInt(searchParams.get('perPage') ?? '20', 10);
  const search = searchParams.get('search');

  try {
    const result = await getAdminPartnersList({
      search,
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? perPage : 20,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Failed to load admin mitra list', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat daftar mitra' },
      { status: 500 },
    );
  }
}
