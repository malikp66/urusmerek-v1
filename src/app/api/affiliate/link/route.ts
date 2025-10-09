import { NextResponse } from 'next/server';
import { z } from 'zod';

import { generateUniqueAffiliateCode } from '@/lib/affiliate';
import { getCurrentUser } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { cacheAffiliateCode } from '@/lib/redis';

export const runtime = 'nodejs';

const createLinkSchema = z.object({
  targetUrl: z
    .string()
    .url('URL tidak valid')
    .max(2048, 'URL terlalu panjang')
    .optional(),
});

export async function POST(req: Request) {
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

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Payload tidak valid' },
      { status: 400 },
    );
  }

  const parsed = createLinkSchema.safeParse(payload);

  if (!parsed.success) {
    const [firstError] = parsed.error.issues;
    return NextResponse.json(
      { ok: false, message: firstError?.message ?? 'Data tidak valid' },
      { status: 400 },
    );
  }

  const targetUrl = parsed.data.targetUrl?.trim() ?? env.APP_URL;

  try {
    const code = await generateUniqueAffiliateCode({ userId });
    const [link] = await db
      .insert(schema.affiliateLinks)
      .values({ userId, code, targetUrl })
      .returning({
        id: schema.affiliateLinks.id,
        code: schema.affiliateLinks.code,
        targetUrl: schema.affiliateLinks.targetUrl,
        isActive: schema.affiliateLinks.isActive,
        createdAt: schema.affiliateLinks.createdAt,
      });

    if (!link) {
      throw new Error('Gagal membuat link affiliate');
    }

    await cacheAffiliateCode(link.code, link.id, userId);

    return NextResponse.json(
      {
        ok: true,
        message: 'Link affiliate berhasil dibuat',
        data: { link },
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Failed to create affiliate link', error);
    return NextResponse.json(
      { ok: false, message: 'Terjadi kesalahan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}
