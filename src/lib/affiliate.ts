import 'server-only';

import { createHash } from 'node:crypto';

import { eq } from 'drizzle-orm';

import { db, schema } from './db';
import { cacheAffiliateCode, getCachedAffiliateCode, invalidateAffiliateCode } from './redis';

export const AFFILIATE_CODE_LENGTH = 8;
export const AFFILIATE_COMMISSION_RATE = 0.1;
export const AFFILIATE_COOKIE_NAME = 'af_ref';
export const AFFILIATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const AFFILIATE_CLICK_DEBOUNCE_MS = 10_000; // 10 seconds

export interface AffiliateLinkRecord {
  id: number;
  userId: number;
  code: string;
  targetUrl: string;
  isActive: boolean;
}

interface GenerateAffiliateCodeParams {
  userId?: number;
  name?: string | null;
  attempt?: number;
}

interface UniqueAffiliateCodeParams {
  userId: number;
  name?: string | null;
  maxAttempts?: number;
}

export function generateAffiliateCode({
  userId,
  name,
  attempt = 0,
}: GenerateAffiliateCodeParams): string {
  const base = userId
    ? userId.toString(36).toUpperCase()
    : (name ?? '')
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();

  const trimmed = (base || 'AFFILIATE').slice(0, AFFILIATE_CODE_LENGTH - 2);
  const checksumSeed = `${trimmed}|${userId ?? ''}|${name ?? ''}|${attempt}`;
  const checksum = createHash('sha256').update(checksumSeed).digest('hex').slice(0, 2).toUpperCase();
  const candidate = `${trimmed}${checksum}`;

  if (candidate.length >= AFFILIATE_CODE_LENGTH) {
    return candidate.slice(0, AFFILIATE_CODE_LENGTH);
  }

  return candidate.padEnd(AFFILIATE_CODE_LENGTH, 'X');
}

export async function generateUniqueAffiliateCode({
  userId,
  name,
  maxAttempts = 10,
}: UniqueAffiliateCodeParams): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generateAffiliateCode({ userId, name, attempt });
    const existing = await db.query.affiliateLinks.findFirst({
      where: eq(schema.affiliateLinks.code, candidate),
      columns: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error('Gagal menghasilkan kode affiliate unik');
}

export async function getLinkByCode(code: string): Promise<AffiliateLinkRecord | null> {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  const cached = await getCachedAffiliateCode(normalized);

  if (cached) {
    const link = await db.query.affiliateLinks.findFirst({
      where: eq(schema.affiliateLinks.id, cached.linkId),
      columns: {
        id: true,
        userId: true,
        code: true,
        targetUrl: true,
        isActive: true,
      },
    });

    if (link && link.isActive && link.code.toUpperCase() === normalized) {
      await cacheAffiliateCode(normalized, link.id, link.userId);
      return { ...link, code: normalized };
    }

    await invalidateAffiliateCode(normalized);
  }

  const link = await db.query.affiliateLinks.findFirst({
    where: eq(schema.affiliateLinks.code, normalized),
    columns: {
      id: true,
      userId: true,
      code: true,
      targetUrl: true,
      isActive: true,
    },
  });

  if (!link || !link.isActive) {
    if (link) {
      await invalidateAffiliateCode(normalized);
    }

    return null;
  }

  await cacheAffiliateCode(normalized, link.id, link.userId);

  return { ...link, code: normalized };
}

export function computeCommission(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Math.round(amount * AFFILIATE_COMMISSION_RATE * 100) / 100;
}
