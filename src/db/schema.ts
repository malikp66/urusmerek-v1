import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  bigserial,
} from 'drizzle-orm/pg-core';

import { env } from '../lib/env';

export const userRoleEnum = pgEnum('user_role', ['mitra', 'admin']);
export const referralStatusEnum = pgEnum('referral_status', ['pending', 'approved', 'rejected', 'paid']);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('mitra'),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex('users_email_unique').on(table.email),
  }),
);

export const affiliateLinks = pgTable(
  'affiliate_links',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 16 }).notNull(),
    targetUrl: text('target_url').notNull().default(env.APP_URL),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    codeIndex: uniqueIndex('affiliate_links_code_unique').on(table.code),
    userIndex: index('affiliate_links_user_id_idx').on(table.userId),
  }),
);

export const affiliateClicks = pgTable(
  'affiliate_clicks',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    linkId: integer('link_id')
      .notNull()
      .references(() => affiliateLinks.id, { onDelete: 'cascade' }),
    ipHash: varchar('ip_hash', { length: 64 }),
    userAgent: text('ua'),
    referer: text('referer'),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    linkIndex: index('affiliate_clicks_link_id_idx').on(table.linkId),
  }),
);

export const affiliateReferrals = pgTable(
  'affiliate_referrals',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    linkId: integer('link_id')
      .notNull()
      .references(() => affiliateLinks.id, { onDelete: 'cascade' }),
    orderId: text('order_id'),
    amount: numeric('amount', { precision: 14, scale: 2 }),
    commission: numeric('commission', { precision: 14, scale: 2 }),
    status: referralStatusEnum('status').notNull().default('pending'),
    meta: jsonb('meta'),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    linkIndex: index('affiliate_referrals_link_id_idx').on(table.linkId),
    statusIndex: index('affiliate_referrals_status_idx').on(table.status),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  affiliateLinks: many(affiliateLinks),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one, many }) => ({
  owner: one(users, {
    fields: [affiliateLinks.userId],
    references: [users.id],
  }),
  clicks: many(affiliateClicks),
  referrals: many(affiliateReferrals),
}));

export const affiliateClicksRelations = relations(affiliateClicks, ({ one }) => ({
  link: one(affiliateLinks, {
    fields: [affiliateClicks.linkId],
    references: [affiliateLinks.id],
  }),
}));

export const affiliateReferralsRelations = relations(affiliateReferrals, ({ one }) => ({
  link: one(affiliateLinks, {
    fields: [affiliateReferrals.linkId],
    references: [affiliateLinks.id],
  }),
}));
