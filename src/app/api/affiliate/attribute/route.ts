import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AFFILIATE_COOKIE_NAME,
  computeCommission,
  getLinkByCode,
} from '@/lib/affiliate';
import { getCurrentUser } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const attributeSchema = z.object({
  order_id: z.string().min(1, 'order_id wajib diisi'),
  amount: z
    .union([z.string(), z.number()])
    .transform((value) => {
      if (typeof value === 'number') {
        return value;
      }

      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    })
    .refine((value) => Number.isFinite(value) && value >= 0, 'amount tidak valid'),
  meta: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Payload tidak valid' },
      { status: 400 },
    );
  }

  const parsed = attributeSchema.safeParse(payload);

  if (!parsed.success) {
    const [firstError] = parsed.error.issues;
    return NextResponse.json(
      { ok: false, message: firstError?.message ?? 'Data tidak valid' },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const referralCode = cookieStore.get(AFFILIATE_COOKIE_NAME)?.value;

  if (!referralCode) {
    return NextResponse.json({
      ok: true,
      message: 'Tidak ada referral aktif',
      data: { attributed: false },
    });
  }

  try {
    const link = await getLinkByCode(referralCode);

    if (!link) {
      return NextResponse.json({
        ok: true,
        message: 'Kode referral tidak ditemukan atau tidak aktif',
        data: { attributed: false },
      });
    }

    const session = await getCurrentUser(req);
    const sessionUserId = session ? Number.parseInt(session.sub, 10) : Number.NaN;

    if (Number.isFinite(sessionUserId) && sessionUserId === link.userId) {
      return NextResponse.json({
        ok: true,
        message: 'Referral diabaikan karena menggunakan link milik sendiri',
        data: { attributed: false },
      });
    }

    const amount = parsed.data.amount;
    const commission = computeCommission(amount);

    await db.insert(schema.affiliateReferrals).values({
      linkId: link.id,
      orderId: parsed.data.order_id,
      amount: amount.toFixed(2),
      commission: commission.toFixed(2),
      status: 'pending',
      meta: parsed.data.meta,
    });

    return NextResponse.json({
      ok: true,
      message: 'Order berhasil diatribusi',
      data: {
        attributed: true,
        commission,
      },
    });
  } catch (error) {
    logger.error('Failed to attribute order', error);
    return NextResponse.json(
      { ok: false, message: 'Terjadi kesalahan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}
