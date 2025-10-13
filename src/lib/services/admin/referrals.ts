import "server-only";

import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { referralStatusEnum } from "@/db/schema";

export type ReferralStatus = (typeof referralStatusEnum.enumValues)[number];

export type ReferralListParams = {
  status?: ReferralStatus | "all";
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type ReferralListItem = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  linkId: number;
  linkCode: string;
  orderId: string;
  amount: number;
  commission: number;
  status: ReferralStatus;
  payoutRequestId: number | null;
  createdAt: Date | string;
  paidAt: Date | string | null;
};

export type ReferralDetail = ReferralListItem & {
  meta: Record<string, unknown> | null;
};

export type PaginatedReferralResult = {
  data: ReferralListItem[];
  page: number;
  perPage: number;
  totalItems: number;
  pageCount: number;
};

const parseNumeric = (value: unknown) =>
  typeof value === "number" ? value : Number.parseFloat(value as string) || 0;

export async function getAdminReferrals(
  params: ReferralListParams
): Promise<PaginatedReferralResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 20);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();

  const statusFilter =
    params.status && params.status !== "all"
      ? sql`AND r.status = ${params.status}`
      : sql``;

  const searchClause = search
    ? sql`AND (
          r.order_id ILIKE ${"%" + search + "%"}
          OR l.code ILIKE ${"%" + search + "%"}
          OR u.name ILIKE ${"%" + search + "%"}
          OR u.email ILIKE ${"%" + search + "%"}
        )`
    : sql``;

  const dataQuery = await db.execute(sql`
    SELECT
      r.id,
      r.order_id,
      r.amount,
      r.commission,
      r.status,
      r.payout_request_id,
      r.created_at,
      r.paid_at,
      l.id AS link_id,
      l.code AS link_code,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    JOIN users u ON u.id = l.user_id
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause}
    ORDER BY r.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    JOIN users u ON u.id = l.user_id
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause};
  `);

  const data = dataQuery.rows.map((row) => ({
    id: Number(row.id),
    userId: Number(row.user_id),
    userName: String(row.user_name ?? ""),
    userEmail: String(row.user_email ?? ""),
    linkId: Number(row.link_id),
    linkCode: String(row.link_code ?? ""),
    orderId: String(row.order_id ?? ""),
    amount: parseNumeric(row.amount),
    commission: parseNumeric(row.commission),
    status: String(row.status) as ReferralStatus,
    payoutRequestId: row.payout_request_id ? Number(row.payout_request_id) : null,
    createdAt: row.created_at as Date | string,
    paidAt: (row.paid_at as Date | string | null) ?? null,
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

export async function getReferralById(id: number): Promise<ReferralDetail | null> {
  const query = await db.execute(sql`
    SELECT
      r.id,
      r.order_id,
      r.amount,
      r.commission,
      r.status,
      r.payout_request_id,
      r.created_at,
      r.paid_at,
      r.meta,
      l.id AS link_id,
      l.code AS link_code,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM affiliate_referrals r
    JOIN affiliate_links l ON l.id = r.link_id
    JOIN users u ON u.id = l.user_id
    WHERE r.id = ${id}
    LIMIT 1;
  `);

  const row = query.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    userName: String(row.user_name ?? ""),
    userEmail: String(row.user_email ?? ""),
    linkId: Number(row.link_id),
    linkCode: String(row.link_code ?? ""),
    orderId: String(row.order_id ?? ""),
    amount: parseNumeric(row.amount),
    commission: parseNumeric(row.commission),
    status: String(row.status) as ReferralStatus,
    payoutRequestId: row.payout_request_id ? Number(row.payout_request_id) : null,
    createdAt: row.created_at as Date | string,
    paidAt: (row.paid_at as Date | string | null) ?? null,
    meta: (row.meta as Record<string, unknown> | null) ?? null,
  };
}

export type UpdateReferralStatusInput = {
  id: number;
  status: ReferralStatus;
};

export async function updateReferralStatus({ id, status }: UpdateReferralStatusInput) {
  await db.execute(sql`
    UPDATE affiliate_referrals
    SET
      status = ${status},
      paid_at = CASE
        WHEN ${status} = 'paid' THEN COALESCE(paid_at, now())
        ELSE NULL
      END
    WHERE id = ${id};
  `);
}
