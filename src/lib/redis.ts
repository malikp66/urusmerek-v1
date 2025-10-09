import 'server-only';

import Redis from 'ioredis';

import { env } from './env';
import { logger } from './logger';

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

const isTls = env.REDIS_URL.startsWith('rediss://');

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    enableAutoPipelining: true,
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    tls: isTls ? { rejectUnauthorized: false } : undefined,
  });

if (!globalForRedis.redis) {
  globalForRedis.redis = redis;
}

redis.on('error', (error) => {
  logger.error('Redis connection error', error);
});

redis.on('connect', () => {
  logger.debug('Redis connected');
});

export const AFFILIATE_CODE_CACHE_KEY = 'affiliate:code';
export const AFFILIATE_CODE_CACHE_TTL_SECONDS = 60 * 60 * 24; // 1 day

export interface CachedAffiliateLink {
  linkId: number;
  userId: number;
}

export async function cacheAffiliateCode(
  code: string,
  linkId: number,
  userId: number,
): Promise<void> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  const value = `${linkId}|${userId}`;
  await redis.set(key, value, 'EX', AFFILIATE_CODE_CACHE_TTL_SECONDS);
}

export async function getCachedAffiliateCode(code: string): Promise<CachedAffiliateLink | null> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  const value = await redis.get(key);

  if (!value) {
    return null;
  }

  const [linkIdRaw, userIdRaw] = value.split('|', 2);
  const linkId = Number.parseInt(linkIdRaw ?? '', 10);
  const userId = Number.parseInt(userIdRaw ?? '', 10);

  if (!Number.isFinite(linkId) || !Number.isFinite(userId)) {
    await redis.del(key);
    return null;
  }

  return { linkId, userId };
}

export async function invalidateAffiliateCode(code: string): Promise<void> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  await redis.del(key);
}
