import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { withdrawStatusEnum } from '@/db/schema';

export type WithdrawStatus = (typeof withdrawStatusEnum.enumValues)[number];

export type WithdrawListParams = {
  status?: WithdrawStatus | 'all';
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type WithdrawListItem = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  status: WithdrawStatus;
  notes: string | null;
  bankSnapshot: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
  processedAt: Date | string | null;
  processedBy: number | null;
};

export type PaginatedWithdrawResult = {
  data: WithdrawListItem[];
  page: number;
  perPage: number;
  totalItems: number;
  pageCount: number;
};

export async function getAdminWithdrawRequests(
  params: WithdrawListParams,
): Promise<PaginatedWithdrawResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 20);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();
  const statusFilter =
    params.status && params.status !== 'all'
      ? sql`AND w.status = ${params.status}`
      : sql``;
  const searchClause = search
    ? sql`AND (u.name ILIKE ${'%' + search + '%'} OR u.email ILIKE ${
        '%' + search + '%'
      })`
    : sql``;

  const dataQuery = await db.execute(sql`
    SELECT
      w.id,
      w.user_id,
      u.name AS user_name,
      u.email AS user_email,
      w.amount,
      w.status,
      w.notes,
      w.bank_snapshot,
      w.created_at,
      w.updated_at,
      w.processed_at,
      w.processed_by
    FROM partner_withdraw_requests w
    JOIN users u ON u.id = w.user_id
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause}
    ORDER BY w.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM partner_withdraw_requests w
    JOIN users u ON u.id = w.user_id
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause};
  `);

  const parseNumeric = (value: unknown) =>
    typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

  const data = (dataQuery.rows as Array<Record<string, unknown>>).map((row) => ({
    id: Number(row.id),
    userId: Number(row.user_id),
    userName: String(row.user_name ?? ''),
    userEmail: String(row.user_email ?? ''),
    amount: parseNumeric(row.amount),
    status: String(row.status) as WithdrawStatus,
    notes: row.notes ? String(row.notes) : null,
    bankSnapshot: (row.bank_snapshot as Record<string, unknown>) ?? {},
    createdAt: row.created_at as Date | string,
    updatedAt: row.updated_at as Date | string,
    processedAt: (row.processed_at as Date | string | null) ?? null,
    processedBy: row.processed_by ? Number(row.processed_by) : null,
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

export async function getWithdrawRequestById(id: number): Promise<WithdrawListItem | null> {
  const query = await db.execute(sql`
    SELECT
      w.id,
      w.user_id,
      u.name AS user_name,
      u.email AS user_email,
      w.amount,
      w.status,
      w.notes,
      w.bank_snapshot,
      w.created_at,
      w.updated_at,
      w.processed_at,
      w.processed_by
    FROM partner_withdraw_requests w
    JOIN users u ON u.id = w.user_id
    WHERE w.id = ${id}
    LIMIT 1;
  `);

  const row = query.rows[0];
  if (!row) {
    return null;
  }

  const parseNumeric = (value: unknown) =>
    typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    userName: String(row.user_name ?? ''),
    userEmail: String(row.user_email ?? ''),
    amount: parseNumeric(row.amount),
    status: String(row.status) as WithdrawStatus,
    notes: row.notes ? String(row.notes) : null,
    bankSnapshot: (row.bank_snapshot as Record<string, unknown>) ?? {},
    createdAt: row.created_at as Date | string,
    updatedAt: row.updated_at as Date | string,
    processedAt: (row.processed_at as Date | string | null) ?? null,
    processedBy: row.processed_by ? Number(row.processed_by) : null,
  };
}

export type UpdateWithdrawStatusInput = {
  id: number;
  status: WithdrawStatus;
  notes?: string | null;
  processedBy: number;
};

export async function updateWithdrawStatus({
  id,
  status,
  notes,
  processedBy,
}: UpdateWithdrawStatusInput) {
  await db.execute(sql`
    UPDATE partner_withdraw_requests
    SET
      status = ${status},
      notes = ${notes ?? null},
      processed_by = ${processedBy},
      processed_at = CASE
        WHEN ${status} = 'paid' THEN now()
        ELSE processed_at
      END,
      updated_at = now()
    WHERE id = ${id};
  `);
}
