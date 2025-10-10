import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';

export type PartnerListParams = {
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type PartnerListRow = {
  id: number;
  name: string;
  email: string;
  createdAt: Date | string;
  totalLinks: number;
  activeLinks: number;
  totalCommission: number;
  approvedCommission: number;
  paidCommission: number;
  totalWithdrawn: number;
  pendingWithdraw: number;
};

export type PaginatedPartnerResult = {
  data: PartnerListRow[];
  page: number;
  perPage: number;
  totalItems: number;
  pageCount: number;
};

export async function getAdminPartnersList(
  params: PartnerListParams,
): Promise<PaginatedPartnerResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 20);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();

  const searchClause = search
    ? sql`AND (u.name ILIKE ${'%' + search + '%'} OR u.email ILIKE ${'%' + search + '%'})`
    : sql``;

  const dataQuery = await db.execute(sql`
    WITH link_stats AS (
      SELECT
        l.user_id,
        COUNT(*)::int AS total_links,
        COUNT(*) FILTER (WHERE l.is_active)::int AS active_links
      FROM affiliate_links l
      GROUP BY l.user_id
    ),
    referral_stats AS (
      SELECT
        l.user_id,
        COALESCE(SUM(r.commission), 0)::numeric AS total_commission,
        COALESCE(
          SUM(CASE WHEN r.status IN ('approved', 'paid') THEN r.commission ELSE 0 END),
          0
        )::numeric AS approved_commission,
        COALESCE(
          SUM(CASE WHEN r.status = 'paid' THEN r.commission ELSE 0 END),
          0
        )::numeric AS paid_commission
      FROM affiliate_links l
      LEFT JOIN affiliate_referrals r ON r.link_id = l.id
      GROUP BY l.user_id
    ),
    withdraw_stats AS (
      SELECT
        w.user_id,
        COALESCE(
          SUM(CASE WHEN w.status = 'paid' THEN w.amount ELSE 0 END),
          0
        )::numeric AS total_withdrawn,
        COALESCE(
          SUM(CASE WHEN w.status IN ('pending', 'approved', 'processing') THEN w.amount ELSE 0 END),
          0
        )::numeric AS pending_withdraw
      FROM partner_withdraw_requests w
      GROUP BY w.user_id
    )
    SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      COALESCE(ls.total_links, 0) AS total_links,
      COALESCE(ls.active_links, 0) AS active_links,
      COALESCE(rs.total_commission, 0) AS total_commission,
      COALESCE(rs.approved_commission, 0) AS approved_commission,
      COALESCE(rs.paid_commission, 0) AS paid_commission,
      COALESCE(ws.total_withdrawn, 0) AS total_withdrawn,
      COALESCE(ws.pending_withdraw, 0) AS pending_withdraw
    FROM users u
    LEFT JOIN link_stats ls ON ls.user_id = u.id
    LEFT JOIN referral_stats rs ON rs.user_id = u.id
    LEFT JOIN withdraw_stats ws ON ws.user_id = u.id
    WHERE u.role = 'mitra'
    ${searchClause}
    ORDER BY u.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM users u
    WHERE u.role = 'mitra'
    ${searchClause};
  `);

  const parseNumeric = (value: unknown) =>
    typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

  const data = (dataQuery.rows as Array<Record<string, unknown>>).map((row) => ({
    id: Number(row.id),
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    createdAt: row.created_at as Date | string,
    totalLinks: Number(row.total_links) || 0,
    activeLinks: Number(row.active_links) || 0,
    totalCommission: parseNumeric(row.total_commission),
    approvedCommission: parseNumeric(row.approved_commission),
    paidCommission: parseNumeric(row.paid_commission),
    totalWithdrawn: parseNumeric(row.total_withdrawn),
    pendingWithdraw: parseNumeric(row.pending_withdraw),
  }));

  const totalItems = Number((totalQuery.rows[0] as { total: number }).total) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));

  return {
    data,
    page,
    perPage,
    totalItems,
    pageCount,
  };
}

export type PartnerDetail = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
  profile: {
    phone: string | null;
    address: string | null;
    taxNumber: string | null;
  } | null;
  bankAccounts: Array<{
    id: number;
    bankCode: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    isDefault: boolean;
  }>;
  commission: {
    defaultRate: number;
    customRates: Record<string, unknown> | null;
  } | null;
  stats: {
    totalLinks: number;
    activeLinks: number;
    totalCommission: number;
    approvedCommission: number;
    paidCommission: number;
    totalWithdrawn: number;
    pendingWithdraw: number;
  };
  links: Array<{
    id: number;
    code: string;
    isActive: boolean;
    createdAt: Date | string;
    lifetimeCommission: number;
    clicks: number;
    referrals: number;
  }>;
  withdraws: Array<{
    id: number;
    amount: number;
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
};

export async function getAdminPartnerDetail(userId: number): Promise<PartnerDetail | null> {
  const user = await db.query.users.findFirst({
    where: sql`users.id = ${userId}`,
    with: {
      profile: true,
      bankAccounts: true,
      commissionSetting: true,
    },
  });

  if (!user) {
    return null;
  }

  const statsQuery = await db.execute(sql`
    WITH link_stats AS (
      SELECT
        l.user_id,
        COUNT(*)::int AS total_links,
        COUNT(*) FILTER (WHERE l.is_active)::int AS active_links
      FROM affiliate_links l
      WHERE l.user_id = ${userId}
      GROUP BY l.user_id
    ),
    referral_stats AS (
      SELECT
        l.user_id,
        COALESCE(SUM(r.commission), 0)::numeric AS total_commission,
        COALESCE(
          SUM(CASE WHEN r.status IN ('approved', 'paid') THEN r.commission ELSE 0 END),
          0
        )::numeric AS approved_commission,
        COALESCE(
          SUM(CASE WHEN r.status = 'paid' THEN r.commission ELSE 0 END),
          0
        )::numeric AS paid_commission
      FROM affiliate_links l
      LEFT JOIN affiliate_referrals r ON r.link_id = l.id
      WHERE l.user_id = ${userId}
      GROUP BY l.user_id
    ),
    withdraw_stats AS (
      SELECT
        w.user_id,
        COALESCE(
          SUM(CASE WHEN w.status = 'paid' THEN w.amount ELSE 0 END),
          0
        )::numeric AS total_withdrawn,
        COALESCE(
          SUM(CASE WHEN w.status IN ('pending', 'approved', 'processing') THEN w.amount ELSE 0 END),
          0
        )::numeric AS pending_withdraw
      FROM partner_withdraw_requests w
      WHERE w.user_id = ${userId}
      GROUP BY w.user_id
    )
    SELECT
      COALESCE(ls.total_links, 0) AS total_links,
      COALESCE(ls.active_links, 0) AS active_links,
      COALESCE(rs.total_commission, 0) AS total_commission,
      COALESCE(rs.approved_commission, 0) AS approved_commission,
      COALESCE(rs.paid_commission, 0) AS paid_commission,
      COALESCE(ws.total_withdrawn, 0) AS total_withdrawn,
      COALESCE(ws.pending_withdraw, 0) AS pending_withdraw
    FROM link_stats ls
    FULL OUTER JOIN referral_stats rs ON rs.user_id = ls.user_id
    FULL OUTER JOIN withdraw_stats ws ON ws.user_id = COALESCE(ls.user_id, rs.user_id);
  `);

  const statsRow = statsQuery.rows[0] ?? {};
  const parseNumeric = (value: unknown) =>
    typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

  const linksQuery = await db.execute(sql`
    WITH clicks AS (
      SELECT c.link_id, COUNT(*)::int AS total_clicks
      FROM affiliate_clicks c
      GROUP BY c.link_id
    ),
    referrals AS (
      SELECT r.link_id, COUNT(*)::int AS total_referrals
      FROM affiliate_referrals r
      GROUP BY r.link_id
    ),
    commissions AS (
      SELECT
        r.link_id,
        COALESCE(SUM(CASE WHEN r.status <> 'rejected' THEN r.commission ELSE 0 END), 0)::numeric AS lifetime_commission
      FROM affiliate_referrals r
      GROUP BY r.link_id
    )
    SELECT
      l.id,
      l.code,
      l.is_active,
      l.created_at,
      COALESCE(c.total_clicks, 0) AS total_clicks,
      COALESCE(r.total_referrals, 0) AS total_referrals,
      COALESCE(co.lifetime_commission, 0) AS lifetime_commission
    FROM affiliate_links l
    LEFT JOIN clicks c ON c.link_id = l.id
    LEFT JOIN referrals r ON r.link_id = l.id
    LEFT JOIN commissions co ON co.link_id = l.id
    WHERE l.user_id = ${userId}
    ORDER BY l.created_at DESC;
  `);

  const withdrawQuery = await db.execute(sql`
    SELECT
      w.id,
      w.amount,
      w.status,
      w.created_at,
      w.updated_at
    FROM partner_withdraw_requests w
    WHERE w.user_id = ${userId}
    ORDER BY w.created_at DESC
    LIMIT 20;
  `);

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    profile: user.profile
      ? {
          phone: user.profile.phone,
          address: user.profile.address,
          taxNumber: user.profile.taxNumber,
        }
      : null,
    bankAccounts: (user.bankAccounts ?? []).map((account) => ({
      id: account.id,
      bankCode: account.bankCode,
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      isDefault: account.isDefault,
    })),
    commission: user.commissionSetting
      ? {
          defaultRate: parseNumeric(user.commissionSetting.defaultRate),
          customRates: (user.commissionSetting.customRates as Record<string, unknown> | null) ?? null,
        }
      : null,
    stats: {
      totalLinks: Number(statsRow.total_links) || 0,
      activeLinks: Number(statsRow.active_links) || 0,
      totalCommission: parseNumeric(statsRow.total_commission),
      approvedCommission: parseNumeric(statsRow.approved_commission),
      paidCommission: parseNumeric(statsRow.paid_commission),
      totalWithdrawn: parseNumeric(statsRow.total_withdrawn),
      pendingWithdraw: parseNumeric(statsRow.pending_withdraw),
    },
    links: linksQuery.rows.map((row) => ({
      id: Number(row.id),
      code: String(row.code),
      isActive: Boolean(row.is_active),
      createdAt: row.created_at as Date | string,
      lifetimeCommission: parseNumeric(row.lifetime_commission),
      clicks: Number(row.total_clicks) || 0,
      referrals: Number(row.total_referrals) || 0,
    })),
    withdraws: withdrawQuery.rows.map((row) => ({
      id: Number(row.id),
      amount: parseNumeric(row.amount),
      status: String(row.status),
      createdAt: row.created_at as Date | string,
      updatedAt: row.updated_at as Date | string,
    })),
  };
}
