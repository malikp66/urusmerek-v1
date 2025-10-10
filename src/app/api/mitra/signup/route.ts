import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { generateUniqueAffiliateCode } from '@/lib/affiliate';
import { db, schema } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  SESSION_MAX_AGE_SECONDS,
  hashPassword,
  setAuthCookie,
  signJwt,
} from '@/lib/auth';
import { cacheAffiliateCode } from '@/lib/redis';
import { hashIpAddress, withRateLimit } from '@/lib/rate-limit';

const signupSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

const SIGNUP_RATE_LIMIT = { limit: 3, windowMs: 60_000 } as const;

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const hashedIp = hashIpAddress(clientIp);
  const rateResult = await withRateLimit(
    { key: `mitra:signup:${hashedIp}`, ...SIGNUP_RATE_LIMIT },
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

  const parsed = signupSchema.safeParse(payload);

  if (!parsed.success) {
    const [firstError] = parsed.error.issues;
    return NextResponse.json(
      { ok: false, message: firstError?.message ?? 'Data tidak valid' },
      { status: 400 },
    );
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const { password } = parsed.data;

  try {
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      columns: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: 'Email sudah terdaftar' },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(schema.users)
      .values({ name, email, passwordHash, role: 'mitra' })
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
      });

    if (!user) {
      throw new Error('Gagal membuat akun mitra');
    }

    const affiliateLink = await createDefaultAffiliateLink(user.id, name);

    if (affiliateLink) {
      await cacheAffiliateCode(affiliateLink.code, affiliateLink.id, user.id);
    }

    const token = await signJwt({
      sub: String(user.id),
      role: 'mitra',
      expiresInSeconds: SESSION_MAX_AGE_SECONDS,
    });

    const response = NextResponse.json(
      {
        ok: true,
        message: 'Pendaftaran mitra berhasil',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          affiliateCode: affiliateLink?.code ?? null,
        },
      },
      { status: 201 },
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    logger.error('Gagal memproses signup mitra', error);
    return NextResponse.json(
      { ok: false, message: 'Terjadi kesalahan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}

async function createDefaultAffiliateLink(userId: number, name: string) {
  const code = await generateUniqueAffiliateCode({ userId, name });

  if (!code) {
    return null;
  }

  const [link] = await db
    .insert(schema.affiliateLinks)
    .values({ userId, code })
    .returning({
      id: schema.affiliateLinks.id,
      code: schema.affiliateLinks.code,
    });

  return link ?? null;
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
