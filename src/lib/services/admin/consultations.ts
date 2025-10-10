import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { consultationStatusEnum } from '@/db/schema';

export type ConsultationStatus = (typeof consultationStatusEnum.enumValues)[number];

export type ConsultationListParams = {
  status?: ConsultationStatus | 'all';
  search?: string | null;
  page?: number;
  perPage?: number;
};

export type ConsultationListItem = {
  id: string;
  email: string;
  brandName: string;
  applicantName: string;
  service: string;
  status: ConsultationStatus;
  notes: string | null;
  assignedTo: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PaginatedConsultationResult = {
  data: ConsultationListItem[];
  page: number;
  perPage: number;
  totalItems: number;
  pageCount: number;
};

export async function getAdminConsultations(
  params: ConsultationListParams,
): Promise<PaginatedConsultationResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 20);
  const offset = (page - 1) * perPage;
  const search = params.search?.trim();
  const statusFilter =
    params.status && params.status !== 'all'
      ? sql`AND c.status = ${params.status}`
      : sql``;
  const searchClause = search
    ? sql`AND (
        c.email ILIKE ${'%' + search + '%'} OR
        c.brand_name ILIKE ${'%' + search + '%'} OR
        c.applicant_name ILIKE ${'%' + search + '%'}
      )`
    : sql``;

  const dataQuery = await db.execute(sql`
    SELECT
      c.id,
      c.email,
      c.brand_name,
      c.applicant_name,
      c.service,
      c.status,
      c.notes,
      c.assigned_to,
      c.created_at,
      c.updated_at
    FROM consultations c
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause}
    ORDER BY c.created_at DESC
    LIMIT ${perPage} OFFSET ${offset};
  `);

  const totalQuery = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM consultations c
    WHERE 1 = 1
    ${statusFilter}
    ${searchClause};
  `);

  const data = (dataQuery.rows as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    email: String(row.email ?? ''),
    brandName: String(row.brand_name ?? ''),
    applicantName: String(row.applicant_name ?? ''),
    service: String(row.service ?? ''),
    status: String(row.status) as ConsultationStatus,
    notes: row.notes ? String(row.notes) : null,
    assignedTo: row.assigned_to ? Number(row.assigned_to) : null,
    createdAt: row.created_at as Date | string,
    updatedAt: row.updated_at as Date | string,
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

export async function getConsultationById(id: string): Promise<ConsultationListItem | null> {
  const query = await db.execute(sql`
    SELECT
      c.id,
      c.email,
      c.brand_name,
      c.applicant_name,
      c.service,
      c.status,
      c.notes,
      c.assigned_to,
      c.created_at,
      c.updated_at
    FROM consultations c
    WHERE c.id = ${id}
    LIMIT 1;
  `);

  const row = query.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    email: String(row.email ?? ''),
    brandName: String(row.brand_name ?? ''),
    applicantName: String(row.applicant_name ?? ''),
    service: String(row.service ?? ''),
    status: String(row.status) as ConsultationStatus,
    notes: row.notes ? String(row.notes) : null,
    assignedTo: row.assigned_to ? Number(row.assigned_to) : null,
    createdAt: row.created_at as Date | string,
    updatedAt: row.updated_at as Date | string,
  };
}

export type UpdateConsultationInput = {
  id: string;
  status?: ConsultationStatus;
  notes?: string | null;
  assignedTo?: number | null;
};

export async function updateConsultation({
  id,
  status,
  notes,
  assignedTo,
}: UpdateConsultationInput) {
  await db.execute(sql`
    UPDATE consultations
    SET
      status = COALESCE(${status ?? null}, status),
      notes = COALESCE(${notes ?? null}, notes),
      assigned_to = COALESCE(${assignedTo ?? null}, assigned_to),
      updated_at = now()
    WHERE id = ${id};
  `);
}
