import { z } from 'zod';

if (typeof window !== 'undefined') {
  throw new Error('env should only be used in server environments');
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const fallbacks = {
  DATABASE_URL: 'postgres://placeholder:placeholder@localhost:5432/placeholder',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: 'development_jwt_secret_development_jwt_secret',
  APP_URL: 'http://localhost:3000',
} as const;

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ?? (isBuildPhase ? fallbacks.DATABASE_URL : undefined),
  REDIS_URL: process.env.REDIS_URL ?? (isBuildPhase ? fallbacks.REDIS_URL : undefined),
  JWT_SECRET: process.env.JWT_SECRET ?? (isBuildPhase ? fallbacks.JWT_SECRET : undefined),
  APP_URL: process.env.APP_URL ?? (isBuildPhase ? fallbacks.APP_URL : undefined),
  LOG_LEVEL: process.env.LOG_LEVEL,
  IP_HASH_SALT:
    process.env.IP_HASH_SALT ??
    process.env.JWT_SECRET ??
    (isBuildPhase ? fallbacks.JWT_SECRET : undefined),
} as const;

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET should be at least 32 characters long'),
    APP_URL: z.string().url(),
    LOG_LEVEL: z
      .enum(['debug', 'info', 'warn', 'error'])
      .optional()
      .default('info'),
    IP_HASH_SALT: z.string().min(16).optional(),
  })
  .transform((value) => ({
    ...value,
    LOG_LEVEL: value.LOG_LEVEL ?? 'info',
    IP_HASH_SALT: value.IP_HASH_SALT ?? value.JWT_SECRET,
  }));

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('Invalid environment variables:\n', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

const missingDuringBuild =
  isBuildPhase
    ? (['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET', 'APP_URL'] as const).filter(
        (key) => !process.env[key],
      )
    : [];

const warnOnceKey = '__NEXT_ENV_FALLBACK_WARNED__';

if (missingDuringBuild.length > 0 && process.env[warnOnceKey] !== '1') {
  console.warn(
    `[env] Missing required environment variables during build: ${missingDuringBuild.join(
      ', ',
    )}. Using safe fallbacks so the build can proceed (message may repeat per worker).`,
  );
  process.env[warnOnceKey] = '1';
}

export const env = parsed.data;
export type Env = typeof env;
