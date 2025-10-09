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

export async function cacheAffiliateCode(code: string, mitraId: number): Promise<void> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  await redis.set(key, String(mitraId), 'EX', AFFILIATE_CODE_CACHE_TTL_SECONDS);
}

export async function getAffiliateCodeMitraId(code: string): Promise<number | null> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  const value = await redis.get(key);
  return value ? Number.parseInt(value, 10) : null;
}

export async function invalidateAffiliateCode(code: string): Promise<void> {
  const key = `${AFFILIATE_CODE_CACHE_KEY}:${code.toLowerCase()}`;
  await redis.del(key);
}
