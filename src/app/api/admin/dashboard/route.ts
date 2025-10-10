import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth-guards';
import { getAdminDashboardStats } from '@/lib/services/admin/dashboard';

export async function GET() {
  await requireAdmin();

  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ ok: true, data: stats });
  } catch (error) {
    console.error('Failed to load admin dashboard stats', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memuat statistik dashboard' },
      { status: 500 },
    );
  }
}
