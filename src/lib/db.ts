import 'server-only';

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/db/schema';
import { env } from './env';
import { logger } from './logger';

const globalForDb = globalThis as unknown as {
  postgresPool?: Pool;
};

const shouldUseSSL =
  env.DATABASE_URL.includes('sslmode=require') ||
  env.DATABASE_URL.startsWith('postgres://') ||
  env.DATABASE_URL.startsWith('postgresql://');

const pool =
  globalForDb.postgresPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
  });

if (!globalForDb.postgresPool) {
  globalForDb.postgresPool = pool;
  pool.on('error', (error) => {
    logger.error('Postgres pool error', error);
  });
}

const globalForDrizzle = globalThis as unknown as {
  drizzleDb?: NodePgDatabase<typeof schema>;
};

export const db = globalForDrizzle.drizzleDb ?? drizzle(pool, { schema });

if (!globalForDrizzle.drizzleDb) {
  globalForDrizzle.drizzleDb = db;
}

export type Database = typeof db;

export { schema };
