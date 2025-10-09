import "server-only";

import { SQL, sql } from "drizzle-orm";

import { db } from "@/lib/db";

const DEFAULT_PAGE_SIZE = 10;

export type AffiliateStats = {
  totalActivePartners: number;
  totalActiveLinks: number;
  clicks7d: number;
  referrals: {
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
  };
  totalAmount: number;
  totalCommission: number;
  commissionToPay: number;
};

export type AffiliateLinkRow = {
  id: number;
  code: string;
  isActive: boolean;
  partnerName: string;
  partnerEmail: string;
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
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type ReferralQueryParams = {
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
  createdAt: Date;
};

export async function getAffiliateStats(): Promise<AffiliateStats> {
  const result = await db.execute(sql`
    WITH clicks AS (
      SELECT COUNT(*)::int AS clicks_7d
      FROM affiliate_clicks c
      WHERE c.created_at > now() - interval '7 days'
    ),
    active_links AS (
      SELECT
        COUNT(*)::int AS total_links,
        COUNT(DISTINCT l.user_id)::int AS total_partners
      FROM affiliate_links l
      WHERE l.is_active = true
    ),
    referral_totals AS (
      SELECT
        COALESCE(SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END), 0)::int AS pending_count,
        COALESCE(SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END), 0)::int AS approved_count,
        COALESCE(SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END), 0)::int AS rejected_count,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN 1 ELSE 0 END), 0)::int AS paid_count,
        COALESCE(SUM(r.amount), 0)::numeric AS total_amount,
        COALESCE(SUM(r.commission), 0)::numeric AS total_commission,
        COALESCE(SUM(CASE WHEN r.status IN ('approved', 'paid') THEN r.commission ELSE 0 END), 0)::numeric AS approved_commission,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.commission ELSE 0 END), 0)::numeric AS paid_commission
      FROM affiliate_referrals r
    )
    SELECT
      al.total_partners,
      al.total_links,
      c.clicks_7d,
      rt.pending_count,
      rt.approved_count,
      rt.rejected_count,
      rt.paid_count,
      rt.total_amount,
      rt.total_commission,
      (rt.approved_commission - rt.paid_commission) AS commission_to_pay
    FROM active_links al, clicks c, referral_totals rt;
  `);

  const row = result.rows[0] ?? {
    total_partners: 0,
    total_links: 0,
    clicks_7d: 0,
    pending_count: 0,
    approved_count: 0,
    rejected_count: 0,
    paid_count: 0,
    total_amount: 0,
    total_commission: 0,
    commission_to_pay: 0,
  };

  const parseNumeric = (value: unknown) =>
    typeof value === "number" ? value : Number.parseFloat(value as string) || 0;

  return {
    totalActivePartners: Number(row.total_partners) || 0,
    totalActiveLinks: Number(row.total_links) || 0,
    clicks7d: Number(row.clicks_7d) || 0,
    referrals: {
      pending: Number(row.pending_count) || 0,
      approved: Number(row.approved_count) || 0,
      rejected: Number(row.rejected_count) || 0,
      paid: Number(row.paid_count) || 0,
    },
    totalAmount: parseNumeric(row.total_amount),
    totalCommission: parseNumeric(row.total_commission),
    commissionToPay: parseNumeric(row.commission_to_pay),
  };
}

export async function getAffiliateLinks(
  params: LinkQueryParams
): Promise<PaginatedResult<AffiliateLinkRow>> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? DEFAULT_PAGE_SIZE);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();

  const searchCondition = search
    ? sql`(l.code ILIKE ${"%" + search + "%"} OR u.email ILIKE ${"%" + search + "%"})`
    : undefined;
  const searchFilter = searchCondition ? sql`WHERE ${searchCondition}` : sql``;

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
      SELECT r.link_id, COALESCE(SUM(CASE WHEN r.status <> 'rejected' THEN r.commission ELSE 0 END), 0)::numeric AS lifetime_commission
      FROM affiliate_referrals r
      GROUP BY r.link_id
    )
    SELECT
      l.id,
      l.code,
      l.is_active,
      u.name AS partner_name,
      u.email AS partner_email,
      COALESCE(ca.clicks_7d, 0) AS clicks_7d,
      COALESCE(ra.referrals_7d, 0) AS referrals_7d,
      COALESCE(co.lifetime_commission, 0) AS lifetime_commission
    FROM affiliate_links l
    JOIN users u ON u.id = l.user_id
    LEFT JOIN clicks_agg ca ON ca.link_id = l.id
    LEFT JOIN referrals_agg ra ON ra.link_id = l.id
    LEFT JOIN commission_agg co ON co.link_id = l.id
    ${searchFilter}
    ORDER BY l.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalResult = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM affiliate_links l
    JOIN users u ON u.id = l.user_id
    ${searchFilter};
  `);

  const rows = dataQuery.rows as Array<{
    id: number;
    code: string;
    is_active: boolean;
    partner_name: string;
    partner_email: string;
    clicks_7d: number;
    referrals_7d: number;
    lifetime_commission: unknown;
  }>;

  const parseNumeric = (value: unknown) =>
    typeof value === "number" ? value : Number.parseFloat(value as string) || 0;

  const data = rows.map((row) => ({
    id: Number(row.id),
    code: row.code,
    isActive: Boolean(row.is_active),
    partnerName: row.partner_name,
    partnerEmail: row.partner_email,
    clicks7d: Number(row.clicks_7d) || 0,
    referrals7d: Number(row.referrals_7d) || 0,
    lifetimeCommission: parseNumeric(row.lifetime_commission),
  }));

  const totalItems = Number(totalResult.rows[0]?.total ?? 0) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));

  return {
    data,
    page,
    perPage,
    totalItems,
    pageCount,
  };
}

export async function getAffiliateReferrals(
  params: ReferralQueryParams
): Promise<PaginatedResult<ReferralRow>> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? DEFAULT_PAGE_SIZE);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();
  const status = params.status?.trim();

  const conditions: SQL[] = [];
  if (search) {
    conditions.push(
      sql`(l.code ILIKE ${"%" + search + "%"} OR u.email ILIKE ${"%" + search + "%"})`
    );
  }
  if (status) {
    conditions.push(sql`r.status = ${status}`);
  }

  const whereClause = conditions.length
    ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
    : sql``;

  const dataResult = await db.execute(sql`
    SELECT
      r.id,
      r.order_id,
      r.amount,
      r.commission,
      r.status,
      r.created_at,
      l.code,
      u.email
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    JOIN users u ON u.id = l.user_id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalResult = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    JOIN users u ON u.id = l.user_id
    ${whereClause};
  `);

  const parseNumeric = (value: unknown) =>
    typeof value === "number" ? value : Number.parseFloat(value as string) || 0;

  const rows = dataResult.rows as Array<{
    id: number;
    order_id: string;
    amount: unknown;
    commission: unknown;
    status: "pending" | "approved" | "rejected" | "paid";
    created_at: Date;
    code: string;
    email: string;
  }>;

  const data = rows.map((row) => ({
    id: Number(row.id),
    orderId: row.order_id,
    code: row.code,
    amount: parseNumeric(row.amount),
    commission: parseNumeric(row.commission),
    status: row.status,
    createdAt: new Date(row.created_at),
  }));

  const totalItems = Number(totalResult.rows[0]?.total ?? 0) || 0;
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));

  return {
    data,
    page,
    perPage,
    totalItems,
    pageCount,
  };
}
