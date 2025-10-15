import { relations } from 'drizzle-orm';
import {
  boolean,
  bigint,
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
  uuid,
} from 'drizzle-orm/pg-core';

import { WITHDRAW_STATUS_OPTIONS } from '@/constants/withdraw-status';

import { env } from '../lib/env';

export const userRoleEnum = pgEnum('user_role', ['mitra', 'admin']);
export const referralStatusEnum = pgEnum('referral_status', ['pending', 'approved', 'rejected', 'paid']);
export const withdrawStatusEnum = pgEnum('withdraw_status', WITHDRAW_STATUS_OPTIONS);
export const consultationStatusEnum = pgEnum('consultation_status', [
  'new',
  'in_review',
  'contacted',
  'completed',
  'cancelled',
]);

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
    description: text('description'),
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

export const partnerProfiles = pgTable(
  'partner_profiles',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    phone: varchar('phone', { length: 32 }),
    address: text('address'),
    taxNumber: varchar('tax_number', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    userUnique: uniqueIndex('partner_profiles_user_id_unique').on(table.userId),
  }),
);

export const partnerBankAccounts = pgTable(
  'partner_bank_accounts',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bankCode: varchar('bank_code', { length: 16 }).notNull(),
    bankName: text('bank_name').notNull(),
    accountName: text('account_name').notNull(),
    accountNumber: varchar('account_number', { length: 64 }).notNull(),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    userIndex: index('partner_bank_accounts_user_id_idx').on(table.userId),
  }),
);

export const partnerWithdrawRequests = pgTable(
  'partner_withdraw_requests',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    status: withdrawStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    bankSnapshot: jsonb('bank_snapshot').notNull(),
    processedBy: integer('processed_by').references(() => users.id, { onDelete: 'set null' }),
    processedAt: timestamp('processed_at', { withTimezone: false }),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    userIndex: index('partner_withdraw_requests_user_id_idx').on(table.userId),
    statusIndex: index('partner_withdraw_requests_status_idx').on(table.status),
  }),
);

export const partnerCommissionSettings = pgTable(
  'partner_commission_settings',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    defaultRate: numeric('default_rate', { precision: 6, scale: 4 }).notNull().default('0.1000'),
    customRates: jsonb('custom_rates'),
    effectiveFrom: timestamp('effective_from', { withTimezone: false }),
    createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    userUnique: uniqueIndex('partner_commission_settings_user_id_unique').on(table.userId),
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
    payoutRequestId: bigint('payout_request_id', { mode: 'number' }).references(
      () => partnerWithdrawRequests.id,
      { onDelete: 'set null' },
    ),
    paidAt: timestamp('paid_at', { withTimezone: false }),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    linkIndex: index('affiliate_referrals_link_id_idx').on(table.linkId),
    statusIndex: index('affiliate_referrals_status_idx').on(table.status),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  affiliateLinks: many(affiliateLinks),
  bankAccounts: many(partnerBankAccounts),
  withdrawRequests: many(partnerWithdrawRequests, {
    relationName: 'withdrawOwner',
  }),
  processedWithdrawRequests: many(partnerWithdrawRequests, {
    relationName: 'withdrawProcessor',
  }),
  commissionSetting: one(partnerCommissionSettings, {
    relationName: 'commissionOwner',
    fields: [users.id],
    references: [partnerCommissionSettings.userId],
  }),
  createdCommissionSettings: many(partnerCommissionSettings, {
    relationName: 'commissionCreator',
  }),
  profile: one(partnerProfiles, {
    fields: [users.id],
    references: [partnerProfiles.userId],
  }),
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
  withdrawRequest: one(partnerWithdrawRequests, {
    fields: [affiliateReferrals.payoutRequestId],
    references: [partnerWithdrawRequests.id],
  }),
}));

export const partnerProfilesRelations = relations(partnerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [partnerProfiles.userId],
    references: [users.id],
  }),
}));

export const partnerBankAccountsRelations = relations(partnerBankAccounts, ({ one }) => ({
  user: one(users, {
    fields: [partnerBankAccounts.userId],
    references: [users.id],
  }),
}));

export const partnerWithdrawRequestsRelations = relations(
  partnerWithdrawRequests,
  ({ one, many }) => ({
    user: one(users, {
      fields: [partnerWithdrawRequests.userId],
      references: [users.id],
      relationName: 'withdrawOwner',
    }),
    processedByUser: one(users, {
      fields: [partnerWithdrawRequests.processedBy],
      references: [users.id],
      relationName: 'withdrawProcessor',
    }),
    referrals: many(affiliateReferrals),
  }),
);

export const consultations = pgTable('consultations', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  email: text('email').notNull(),
  brandName: text('brand_name').notNull(),
  applicantName: text('applicant_name').notNull(),
  service: text('service').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  status: consultationStatusEnum('status').notNull().default('new'),
  assignedTo: integer('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const partnerCommissionSettingsRelations = relations(
  partnerCommissionSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [partnerCommissionSettings.userId],
      references: [users.id],
      relationName: 'commissionOwner',
    }),
    creator: one(users, {
      fields: [partnerCommissionSettings.createdBy],
      references: [users.id],
      relationName: 'commissionCreator',
    }),
  }),
);

export const consultationsRelations = relations(consultations, ({ one }) => ({
  assignee: one(users, {
    fields: [consultations.assignedTo],
    references: [users.id],
  }),
}));
