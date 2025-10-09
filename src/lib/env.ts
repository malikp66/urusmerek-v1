import { z } from 'zod';

if (typeof window !== 'undefined') {
  throw new Error('env should only be used in server environments');
}

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

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  APP_URL: process.env.APP_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  IP_HASH_SALT: process.env.IP_HASH_SALT,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export type Env = typeof env;
