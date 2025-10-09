import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

import { getCurrentUser } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const session = await getCurrentUser(req);

  if (!session || session.role !== 'mitra') {
    return NextResponse.json(
      { ok: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  const userId = Number.parseInt(session.sub, 10);

  if (!Number.isFinite(userId)) {
    return NextResponse.json(
      { ok: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const links = await db
      .select({
        id: schema.affiliateLinks.id,
        code: schema.affiliateLinks.code,
        targetUrl: schema.affiliateLinks.targetUrl,
        isActive: schema.affiliateLinks.isActive,
        createdAt: schema.affiliateLinks.createdAt,
      })
      .from(schema.affiliateLinks)
      .where(eq(schema.affiliateLinks.userId, userId))
      .orderBy(desc(schema.affiliateLinks.createdAt));

    return NextResponse.json({
      ok: true,
      data: {
        links,
      },
    });
  } catch (error) {
    logger.error('Failed to load affiliate links', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal mengambil data affiliate' },
      { status: 500 },
    );
  }
}
