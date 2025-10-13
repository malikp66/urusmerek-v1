import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';

import {
  AFFILIATE_CLICK_DEBOUNCE_MS,
  AFFILIATE_COOKIE_MAX_AGE_SECONDS,
  AFFILIATE_COOKIE_NAME,
  getLinkByCode,
} from '@/lib/affiliate';
import { db, schema } from '@/lib/db';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { hashIpAddress, withRateLimit, AFFILIATE_CLICK_RATE_LIMIT } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  context: { params: Promise<{ code?: string }> },
) {
  const { code } = await context.params;
  const normalizedCode = (code ?? '').trim();

  if (!normalizedCode) {
    return NextResponse.redirect(env.APP_URL, { status: 302 });
  }

  let link: Awaited<ReturnType<typeof getLinkByCode>> = null;

  try {
    link = await getLinkByCode(normalizedCode);
  } catch (error) {
    logger.error('Failed to resolve affiliate link', error);
  }

  if (!link) {
    return NextResponse.redirect(env.APP_URL, { status: 302 });
  }

  const redirectUrl = link.targetUrl || env.APP_URL;
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  response.cookies.set({
    name: AFFILIATE_COOKIE_NAME,
    value: link.code,
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
    path: '/',
  });

  const clientIp = getClientIp(req);
  const ipHash = hashIpAddress(clientIp);

  try {
    const rateKey = `affiliate:click:${link.id}:${ipHash}`;
    const rateResult = await withRateLimit(
      { key: rateKey, ...AFFILIATE_CLICK_RATE_LIMIT },
      async () => null,
    );

    let shouldInsert = rateResult.success;

    if (shouldInsert) {
      const recentClick = await db
        .select({ createdAt: schema.affiliateClicks.createdAt })
        .from(schema.affiliateClicks)
        .where(
          and(
            eq(schema.affiliateClicks.linkId, link.id),
            eq(schema.affiliateClicks.ipHash, ipHash),
          ),
        )
        .orderBy(desc(schema.affiliateClicks.createdAt))
        .limit(1);

      const latestCreatedAt = recentClick[0]?.createdAt;

      if (latestCreatedAt) {
        const lastClickAt = new Date(latestCreatedAt).getTime();
        const now = Date.now();

        if (now - lastClickAt < AFFILIATE_CLICK_DEBOUNCE_MS) {
          shouldInsert = false;
        }
      }
    }

    if (shouldInsert) {
      const userAgent = truncateHeader(req.headers.get('user-agent'));
      const referer = truncateHeader(req.headers.get('referer'));

      await db.insert(schema.affiliateClicks).values({
        linkId: link.id,
        ipHash,
        userAgent: userAgent ?? undefined,
        referer: referer ?? undefined,
      });
    }
  } catch (error) {
    logger.error('Failed to record affiliate click', error);
  }

  return response;
}

function getClientIp(req: Request): string {
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

function truncateHeader(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.length > 512 ? value.slice(0, 512) : value;
}
