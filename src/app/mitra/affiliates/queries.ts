import "server-only";

import { SQL, sql } from "drizzle-orm";

import { db } from "@/lib/db";

const DEFAULT_PAGE_SIZE = 10;

export type MitraDashboardStats = {
  clicks7d: number;
  totalLinks: number;
  activeLinks: number;
  referralsPending: number;
  referralsApproved: number;
  referralsRejected: number;
  referralsPaid: number;
  totalCommission: number;
  approvedCommission: number;
  paidCommission: number;
  withdrawPending: number;
};

export type PerformancePoint = {
  date: string;
  clicks: number;
  referrals: number;
};

export type MitraDashboardData = {
  stats: MitraDashboardStats;
  performance7d: PerformancePoint[];
  performance30d: PerformancePoint[];
};

export type MitraLinkRow = {
  id: number;
  code: string;
  targetUrl: string;
  description: string | null;
  createdAt: Date;
  isActive: boolean;
  clicks7d: number;
  referrals7d: number;
  lifetimeCommission: number;
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  perPage: number;
  totalItems: number;
  pageCount: number;
};

export type LinkQueryParams = {
  userId: number;
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type ReferralQueryParams = {
  userId: number;
  search?: string | null;
  status?: string | null;
  page?: number;
  perPage?: number;
};

export type ReferralRow = {
  id: number;
  orderId: string;
  code: string;
  amount: number;
  commission: number;
  status: "pending" | "approved" | "rejected" | "paid";
  payoutRequestId: number | null;
  createdAt: Date;
};

export type MitraBalance = {
  totalEarned: number;
  approved: number;
  paid: number;
  pending: number;
  withdrawPending: number;
  available: number;
};

export type MitraWithdrawRow = {
  id: number;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
  bankSnapshot: Record<string, unknown>;
};

export type WithdrawQueryParams = {
  userId: number;
  page?: number;
  perPage?: number;
};

const parseNumeric = (value: unknown) =>
  typeof value === "number" ? value : Number.parseFloat(value as string) || 0;

export async function getMitraDashboardData(userId: number): Promise<MitraDashboardData> {
  const statsResult = await db.execute(sql`
    WITH user_links AS (
      SELECT
        COUNT(*)::int AS total_links,
        COUNT(*) FILTER (WHERE l.is_active)::int AS active_links
      FROM affiliate_links l
      WHERE l.user_id = ${userId}
    ),
    clicks_7d AS (
      SELECT COUNT(*)::int AS clicks
      FROM affiliate_clicks c
      JOIN affiliate_links l ON l.id = c.link_id
      WHERE l.user_id = ${userId}
        AND c.created_at >= now() - interval '7 days'
    ),
    referral_totals AS (
      SELECT
        COALESCE(SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END), 0)::int AS pending_count,
        COALESCE(SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END), 0)::int AS approved_count,
        COALESCE(SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END), 0)::int AS rejected_count,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN 1 ELSE 0 END), 0)::int AS paid_count,
        COALESCE(SUM(CASE WHEN r.status <> 'rejected' THEN r.commission ELSE 0 END), 0)::numeric AS total_commission,
        COALESCE(SUM(CASE WHEN r.status IN ('approved', 'paid') THEN r.commission ELSE 0 END), 0)::numeric AS approved_commission,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.commission ELSE 0 END), 0)::numeric AS paid_commission
      FROM affiliate_referrals r
      JOIN affiliate_links l ON l.id = r.link_id
      WHERE l.user_id = ${userId}
    ),
    withdraw_totals AS (
      SELECT
        COALESCE(
          SUM(
            CASE WHEN w.status IN ('pending', 'approved', 'processing')
            THEN w.amount
            ELSE 0 END
          ),
          0
        )::numeric AS pending_amount
      FROM partner_withdraw_requests w
      WHERE w.user_id = ${userId}
    )
    SELECT
      ul.total_links,
      ul.active_links,
      c7.clicks,
      rt.pending_count,
      rt.approved_count,
      rt.rejected_count,
      rt.paid_count,
      rt.total_commission,
      rt.approved_commission,
      rt.paid_commission,
      wt.pending_amount
    FROM user_links ul, clicks_7d c7, referral_totals rt, withdraw_totals wt;
  `);

  const statsRow = statsResult.rows[0] ?? {};

  const stats: MitraDashboardStats = {
    clicks7d: Number(statsRow.clicks) || 0,
    totalLinks: Number(statsRow.total_links) || 0,
    activeLinks: Number(statsRow.active_links) || 0,
    referralsPending: Number(statsRow.pending_count) || 0,
    referralsApproved: Number(statsRow.approved_count) || 0,
    referralsRejected: Number(statsRow.rejected_count) || 0,
    referralsPaid: Number(statsRow.paid_count) || 0,
    totalCommission: parseNumeric(statsRow.total_commission),
    approvedCommission: parseNumeric(statsRow.approved_commission),
    paidCommission: parseNumeric(statsRow.paid_commission),
    withdrawPending: parseNumeric(statsRow.pending_amount),
  };

  const [performance7d, performance30d] = await Promise.all([
    getPerformanceSeries(userId, 7),
    getPerformanceSeries(userId, 30),
  ]);

  return {
    stats,
    performance7d,
    performance30d,
  };
}

async function getPerformanceSeries(userId: number, days: number): Promise<PerformancePoint[]> {
  const result = await db.execute(sql`
    WITH dates AS (
      SELECT generate_series::date AS day
      FROM generate_series(CURRENT_DATE - interval '${days - 1} days', CURRENT_DATE, interval '1 day')
    ),
    clicks AS (
      SELECT
        date_trunc('day', c.created_at)::date AS day,
        COUNT(*)::int AS total_clicks
      FROM affiliate_clicks c
      JOIN affiliate_links l ON l.id = c.link_id
      WHERE l.user_id = ${userId}
        AND c.created_at >= CURRENT_DATE - interval '${days - 1} days'
      GROUP BY day
    ),
    referrals AS (
      SELECT
        date_trunc('day', r.created_at)::date AS day,
        COUNT(*)::int AS total_referrals
      FROM affiliate_referrals r
      JOIN affiliate_links l ON l.id = r.link_id
      WHERE l.user_id = ${userId}
        AND r.created_at >= CURRENT_DATE - interval '${days - 1} days'
      GROUP BY day
    )
    SELECT
      d.day,
      COALESCE(c.total_clicks, 0) AS clicks,
      COALESCE(r.total_referrals, 0) AS referrals
    FROM dates d
    LEFT JOIN clicks c ON c.day = d.day
    LEFT JOIN referrals r ON r.day = d.day
    ORDER BY d.day;
  `);

  return result.rows.map((row) => ({
    date: (row.day as Date).toISOString().slice(0, 10),
    clicks: Number(row.clicks) || 0,
    referrals: Number(row.referrals) || 0,
  }));
}

export async function getMitraLinks({
  userId,
  search,
  page,
  perPage,
}: LinkQueryParams): Promise<PaginatedResult<MitraLinkRow>> {
  const currentPage = Math.max(1, page ?? 1);
  const pageSize = Math.max(1, perPage ?? DEFAULT_PAGE_SIZE);
  const offset = (currentPage - 1) * pageSize;
  const term = search?.trim();

  const filters: SQL[] = [sql`l.user_id = ${userId}`];
  if (term) {
    filters.push(sql`l.code ILIKE ${"%" + term + "%"}`);
  }

  const whereClause = sql`WHERE ${sql.join(filters, sql` AND `)}`;

  const dataQuery = await db.execute(sql`
    WITH clicks_agg AS (
      SELECT c.link_id, COUNT(*)::int AS clicks_7d
      FROM affiliate_clicks c
      WHERE c.created_at > now() - interval '7 days'
      GROUP BY c.link_id
    ),
    referrals_agg AS (
      SELECT r.link_id, COUNT(*)::int AS referrals_7d
      FROM affiliate_referrals r
      WHERE r.created_at > now() - interval '7 days'
      GROUP BY r.link_id
    ),
    commission_agg AS (
      SELECT
        r.link_id,
        COALESCE(SUM(CASE WHEN r.status <> 'rejected' THEN r.commission ELSE 0 END), 0)::numeric AS lifetime_commission
      FROM affiliate_referrals r
      GROUP BY r.link_id
    )
    SELECT
      l.id,
      l.code,
      l.target_url,
      l.description,
      l.created_at,
      l.is_active,
      COALESCE(ca.clicks_7d, 0) AS clicks_7d,
      COALESCE(ra.referrals_7d, 0) AS referrals_7d,
      COALESCE(co.lifetime_commission, 0) AS lifetime_commission
    FROM affiliate_links l
    LEFT JOIN clicks_agg ca ON ca.link_id = l.id
    LEFT JOIN referrals_agg ra ON ra.link_id = l.id
    LEFT JOIN commission_agg co ON co.link_id = l.id
    ${whereClause}
    ORDER BY l.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM affiliate_links l
    ${whereClause};
  `);

  const data = dataQuery.rows.map((row) => ({
    id: Number(row.id),
    code: String(row.code),
    targetUrl: String(row.target_url),
    description: row.description ? String(row.description) : null,
    createdAt: new Date(row.created_at as Date),
    isActive: Boolean(row.is_active),
    clicks7d: Number(row.clicks_7d) || 0,
    referrals7d: Number(row.referrals_7d) || 0,
    lifetimeCommission: parseNumeric(row.lifetime_commission),
  }));

  const totalItems = Number(totalQuery.rows[0]?.total ?? 0) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    data,
    page: currentPage,
    perPage: pageSize,
    totalItems,
    pageCount,
  };
}

export async function getMitraReferrals({
  userId,
  search,
  status,
  page,
  perPage,
}: ReferralQueryParams): Promise<PaginatedResult<ReferralRow>> {
  const currentPage = Math.max(1, page ?? 1);
  const pageSize = Math.max(1, perPage ?? DEFAULT_PAGE_SIZE);
  const offset = (currentPage - 1) * pageSize;
  const term = search?.trim();
  const statusFilter = status?.trim();

  const filters: SQL[] = [sql`l.user_id = ${userId}`];
  if (term) {
    filters.push(sql`(l.code ILIKE ${"%" + term + "%"} OR r.order_id ILIKE ${"%" + term + "%"})`);
  }
  if (statusFilter) {
    filters.push(sql`r.status = ${statusFilter}`);
  }

  const whereClause = sql`WHERE ${sql.join(filters, sql` AND `)}`;

  const dataResult = await db.execute(sql`
    SELECT
      r.id,
      r.order_id,
      r.amount,
      r.commission,
      r.status,
      r.payout_request_id,
      r.created_at,
      l.code
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `);

  const totalResult = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    ${whereClause};
  `);

  const data = dataResult.rows.map((row) => ({
    id: Number(row.id),
    orderId: String(row.order_id ?? ""),
    code: String(row.code ?? ""),
    amount: parseNumeric(row.amount),
    commission: parseNumeric(row.commission),
    status: row.status as ReferralRow["status"],
    payoutRequestId: row.payout_request_id ? Number(row.payout_request_id) : null,
    createdAt: new Date(row.created_at as Date),
  }));

  const totalItems = Number(totalResult.rows[0]?.total ?? 0) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    data,
    page: currentPage,
    perPage: pageSize,
    totalItems,
    pageCount,
  };
}

export async function getMitraBalance(userId: number): Promise<MitraBalance> {
  const result = await db.execute(sql`
    WITH referral_totals AS (
      SELECT
        COALESCE(SUM(CASE WHEN r.status <> 'rejected' THEN r.commission ELSE 0 END), 0)::numeric AS total_commission,
        COALESCE(SUM(CASE WHEN r.status = 'approved' THEN r.commission ELSE 0 END), 0)::numeric AS approved_commission,
        COALESCE(SUM(CASE WHEN r.status = 'pending' THEN r.commission ELSE 0 END), 0)::numeric AS pending_commission,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.commission ELSE 0 END), 0)::numeric AS paid_commission
      FROM affiliate_referrals r
      JOIN affiliate_links l ON l.id = r.link_id
      WHERE l.user_id = ${userId}
    ),
    withdraw_totals AS (
      SELECT
        COALESCE(
          SUM(
            CASE WHEN w.status IN ('pending', 'approved', 'processing')
            THEN w.amount
            ELSE 0 END
          ),
          0
        )::numeric AS pending_amount
      FROM partner_withdraw_requests w
      WHERE w.user_id = ${userId}
    )
    SELECT
      rt.total_commission,
      rt.approved_commission,
      rt.pending_commission,
      rt.paid_commission,
      wt.pending_amount
    FROM referral_totals rt, withdraw_totals wt;
  `);

  const row = result.rows[0] ?? {};
  const totalEarned = parseNumeric(row.total_commission);
  const approved = parseNumeric(row.approved_commission);
  const pending = parseNumeric(row.pending_commission);
  const paid = parseNumeric(row.paid_commission);
  const withdrawPending = parseNumeric(row.pending_amount);
  const available = Math.max(0, approved - withdrawPending);

  return {
    totalEarned,
    approved,
    paid,
    pending,
    withdrawPending,
    available,
  };
}

export async function getMitraWithdraws({
  userId,
  page,
  perPage,
}: WithdrawQueryParams): Promise<PaginatedResult<MitraWithdrawRow>> {
  const currentPage = Math.max(1, page ?? 1);
  const pageSize = Math.max(1, perPage ?? DEFAULT_PAGE_SIZE);
  const offset = (currentPage - 1) * pageSize;

  const dataQuery = await db.execute(sql`
    SELECT
      w.id,
      w.amount,
      w.status,
      w.created_at,
      w.updated_at,
      w.notes,
      w.bank_snapshot
    FROM partner_withdraw_requests w
    WHERE w.user_id = ${userId}
    ORDER BY w.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM partner_withdraw_requests w
    WHERE w.user_id = ${userId};
  `);

  const data = dataQuery.rows.map((row) => ({
    id: Number(row.id),
    amount: parseNumeric(row.amount),
    status: String(row.status),
    createdAt: new Date(row.created_at as Date),
    updatedAt: new Date(row.updated_at as Date),
    notes: row.notes ? String(row.notes) : null,
    bankSnapshot: (row.bank_snapshot as Record<string, unknown>) ?? {},
  }));

  const totalItems = Number(totalQuery.rows[0]?.total ?? 0) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    data,
    page: currentPage,
    perPage: pageSize,
    totalItems,
    pageCount,
  };
}
