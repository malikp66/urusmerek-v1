const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcrypt');
const { pgEnum, pgTable, serial, text, timestamp } = require('drizzle-orm/pg-core');

const userRoleEnum = pgEnum('user_role', ['mitra', 'admin']);

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
});

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:AnzkJvBIWyvJwZWtvQMjTUeqXFgmMRnv@shuttle.proxy.rlwy.net:50889/railway?sslmode=require',
  });

  const db = drizzle(pool);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@urusmerek.id';
  const adminName = process.env.ADMIN_NAME || 'Admin UrusMerek';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Soho19soho19';

  try {
    // Acquire and immediately release a client so the pool is ready,
    // but ensure we don't hold it open and block process shutdown.
    const testClient = await pool.connect();
    testClient.release();

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    if (existingUser.length > 0) {
      await db
        .update(users)
        .set({
          name: adminName,
          passwordHash,
          role: 'admin',
        })
        .where(eq(users.email, adminEmail));

      console.log(`Updated existing admin user with email ${adminEmail}`);
    } else {
      await db.insert(users).values({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });

      console.log(`Created admin user with email ${adminEmail}`);
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
