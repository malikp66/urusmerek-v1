import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db, schema } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  SESSION_MAX_AGE_SECONDS,
  setAuthCookie,
  signJwt,
  verifyPassword,
} from '@/lib/auth';
import { cacheAffiliateCode } from '@/lib/redis';
import { hashIpAddress, withRateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 60_000 } as const;

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const hashedIp = hashIpAddress(clientIp);

  const rateResult = await withRateLimit(
    { key: `mitra:login:${hashedIp}`, ...LOGIN_RATE_LIMIT },
    async () => null,
  );

  if (!rateResult.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
      },
      {
        status: 429,
        headers: { 'Retry-After': Math.ceil(rateResult.retryAfter / 1000).toString() },
      },
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

  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    const [firstError] = parsed.error.issues;
    return NextResponse.json(
      { ok: false, message: firstError?.message ?? 'Data tidak valid' },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const { password } = parsed.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      columns: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
      },
      with: {
        affiliateLinks: {
          columns: { id: true, code: true },
          limit: 1,
        },
      },
    });

    if (!user) {
      await waitRandomDelay();
      return NextResponse.json(
        { ok: false, message: 'Email atau password salah' },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      await waitRandomDelay();
      return NextResponse.json(
        { ok: false, message: 'Email atau password salah' },
        { status: 401 },
      );
    }

    const affiliateLink = user.affiliateLinks?.[0] ?? null;
    const affiliateCode = affiliateLink?.code ?? null;

    if (affiliateLink?.id && affiliateCode) {
      await cacheAffiliateCode(affiliateCode, affiliateLink.id, user.id);
    }

    const token = await signJwt({
      sub: String(user.id),
      role: 'mitra',
      expiresInSeconds: SESSION_MAX_AGE_SECONDS,
    });

    const response = NextResponse.json({
      ok: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        affiliateCode,
      },
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    logger.error('Gagal memproses login mitra', error);
    return NextResponse.json(
      { ok: false, message: 'Terjadi kesalahan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const [first] = forwarded.split(',');
    if (first) return first.trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;

  return req.headers.get('cf-connecting-ip') ?? 'unknown';
}

async function waitRandomDelay(): Promise<void> {
  const delay = 100 + Math.floor(Math.random() * 201);
  await new Promise((resolve) => setTimeout(resolve, delay));
}
