import 'server-only';

import { createHash } from 'node:crypto';

import { env } from './env';
import { redis } from './redis';

export interface RateLimitContext {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitSuccess<T> {
  success: true;
  remaining: number;
  resetAt: number;
  value: T;
}

export interface RateLimitFailure {
  success: false;
  retryAfter: number;
  resetAt: number;
}

export type RateLimitResult<T> = RateLimitSuccess<T> | RateLimitFailure;

const RATE_LIMIT_PREFIX = 'rate-limit:';

export const LOGIN_RATE_LIMIT = { limit: 1, windowMs: 3_000 } as const;
export const AFFILIATE_CLICK_RATE_LIMIT = { limit: 1, windowMs: 3_000 } as const;

async function hitRateLimit(key: string, limit: number, windowMs: number) {
  const redisKey = `${RATE_LIMIT_PREFIX}${key}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  await redis.zremrangebyscore(redisKey, 0, windowStart);
  const current = await redis.zcard(redisKey);

  if (current >= limit) {
    const [oldestMember] = await redis.zrange(redisKey, 0, 0);
    const oldestScoreValue = oldestMember ? await redis.zscore(redisKey, oldestMember) : null;
    const oldestScore = oldestScoreValue ? Number.parseFloat(oldestScoreValue) : now;
    const resetAt = oldestScore + windowMs;

    return {
      allowed: false as const,
      retryAfter: Math.max(resetAt - now, 0),
      resetAt,
    };
  }

  const member = `${now}-${Math.random().toString(36).slice(2, 10)}`;
  await redis.zadd(redisKey, now, member);
  await redis.pexpire(redisKey, windowMs);

  const remaining = limit - (current + 1);

  return {
    allowed: true as const,
    remaining,
    resetAt: now + windowMs,
  };
}

export function hashIpAddress(ip: string): string {
  return createHash('sha256').update(`${ip}|${env.IP_HASH_SALT}`).digest('hex');
}

export async function withRateLimit<T>(
  { key, limit, windowMs }: RateLimitContext,
  task: () => Promise<T>,
): Promise<RateLimitResult<T>> {
  const outcome = await hitRateLimit(key, limit, windowMs);

  if (!outcome.allowed) {
    return {
      success: false,
      retryAfter: outcome.retryAfter,
      resetAt: outcome.resetAt,
    };
  }

  const value = await task();

  return {
    success: true,
    remaining: outcome.remaining,
    resetAt: outcome.resetAt,
    value,
  };
}
