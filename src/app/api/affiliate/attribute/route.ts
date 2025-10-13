import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import {
  AFFILIATE_COOKIE_NAME,
  computeCommission,
  getLinkByCode,
} from '@/lib/affiliate';
import { getCurrentUser } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { hashIpAddress } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const attributeSchema = z.object({
  order_id: z.string().trim().min(1, 'order_id wajib diisi'),
  amount: z
    .union([z.string(), z.number()])
    .transform((value) => {
      if (typeof value === 'number') {
        return value;
      }

      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    })
    .refine((value) => Number.isFinite(value) && value >= 0, 'amount tidak valid')
    .refine((value) => value <= 1_000_000_000, 'amount terlalu besar'),
  meta: z.record(z.unknown()).optional(),
});

const SIGNATURE_HEADER = 'x-affiliate-signature';

function verifyRequestSignature(rawBody: string, signature: string, secret: string): boolean {
  const normalizedSignature = signature.trim().toLowerCase();

  if (!/^[0-9a-f]+$/.test(normalizedSignature)) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const provided = Buffer.from(normalizedSignature, 'hex');

  if (provided.length !== expected.length) {
    return false;
  }

  try {
    return timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Payload tidak valid' },
      { status: 400 },
    );
  }

  if (env.AFFILIATE_ATTRIBUTE_SECRET) {
    const providedSignature = req.headers.get(SIGNATURE_HEADER);

    if (!providedSignature) {
      return NextResponse.json(
        { ok: false, message: 'Signature tidak ditemukan' },
        { status: 401 },
      );
    }

    const validSignature = verifyRequestSignature(
      rawBody,
      providedSignature,
      env.AFFILIATE_ATTRIBUTE_SECRET,
    );

    if (!validSignature) {
      logger.warn('Invalid affiliate attribution signature detected');
      return NextResponse.json(
        { ok: false, message: 'Signature tidak valid' },
        { status: 401 },
      );
    }
  }

  let payload: unknown;

  try {
    payload = rawBody.length > 0 ? JSON.parse(rawBody) : null;
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

  const cookieStore = await cookies();
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

    const orderId = parsed.data.order_id;

    const existingReferral = await db.query.affiliateReferrals.findFirst({
      where: eq(schema.affiliateReferrals.orderId, orderId),
      columns: { id: true, linkId: true },
    });

    if (existingReferral) {
      const duplicateMessage =
        existingReferral.linkId === link.id
          ? 'Order sudah pernah dikaitkan dengan affiliate ini'
          : 'Order sudah dikaitkan dengan affiliate lain';

      return NextResponse.json({
        ok: true,
        message: duplicateMessage,
        data: {
          attributed: false,
          duplicate: true,
        },
      });
    }

    const amount = parsed.data.amount;
    const commission = computeCommission(amount);

    const clientIp = extractClientIp(req);
    const ipHash = hashIpAddress(clientIp);
    const userAgent = truncateHeader(req.headers.get('user-agent'));
    const referer = truncateHeader(req.headers.get('referer'));

    const referralMeta: Record<string, unknown> = {
      ...(parsed.data.meta ?? {}),
      requestIpHash: ipHash,
      attributedAt: new Date().toISOString(),
    };

    if (userAgent) {
      referralMeta.requestUserAgent = userAgent;
    }

    if (referer) {
      referralMeta.requestReferer = referer;
    }

    await db.insert(schema.affiliateReferrals).values({
      linkId: link.id,
      orderId,
      amount: amount.toFixed(2),
      commission: commission.toFixed(2),
      status: 'pending',
      meta: referralMeta,
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

function extractClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');

  if (forwarded) {
    const [first] = forwarded.split(',');
    if (first) {
      return first.trim();
    }
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return req.headers.get('cf-connecting-ip') ?? 'unknown';
}

function truncateHeader(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.length > 512 ? value.slice(0, 512) : value;
}
