import 'server-only';

import { sql } from 'drizzle-orm';

import { CONSULTATION_STATUS_OPTIONS } from '@/constants/consultation-status';
import { db } from '@/lib/db';

export type ConsultationStatus = (typeof CONSULTATION_STATUS_OPTIONS)[number];

export type PublicConsultation = {
  id: string;
  email: string;
  brandName: string;
  applicantName: string;
  service: string;
  status: ConsultationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConsultationDashboardSummary = {
  total: number;
  lastUpdatedAt: string | null;
  statusCounts: Record<ConsultationStatus, number>;
  serviceCounts: Array<{ service: string; count: number }>;
  recentUpdates: Array<{
    id: string;
    brandName: string;
    status: ConsultationStatus;
    updatedAt: string;
    notes: string | null;
  }>;
};

export type ConsultationDashboardData = {
  consultations: PublicConsultation[];
  summary: ConsultationDashboardSummary;
};

function baseStatusCounts(): Record<ConsultationStatus, number> {
  return CONSULTATION_STATUS_OPTIONS.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<ConsultationStatus, number>,
  );
}

export async function getConsultationsByIds(ids: string[]): Promise<ConsultationDashboardData> {
  if (ids.length === 0) {
    const emptySummary: ConsultationDashboardSummary = {
      total: 0,
      lastUpdatedAt: null,
      statusCounts: baseStatusCounts(),
      serviceCounts: [],
      recentUpdates: [],
    };

    return { consultations: [], summary: emptySummary };
  }

  const dataQuery = await db.execute(sql`
    SELECT
      c.id,
      c.email,
      c.brand_name,
      c.applicant_name,
      c.service,
      c.status,
      c.notes,
      c.created_at,
      c.updated_at
    FROM consultations c
    WHERE c.id = ANY(${sql.array(ids, 'uuid')})
    ORDER BY c.created_at DESC;
  `);

  const consultations = (dataQuery.rows as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    email: String(row.email ?? ''),
    brandName: String(row.brand_name ?? ''),
    applicantName: String(row.applicant_name ?? ''),
    service: String(row.service ?? ''),
    status: String(row.status) as ConsultationStatus,
    notes: row.notes ? String(row.notes) : null,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at ?? ''),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : String(row.updated_at ?? ''),
  }));

  const statusCounts = consultations.reduce((acc, consultation) => {
    acc[consultation.status] = (acc[consultation.status] ?? 0) + 1;
    return acc;
  }, baseStatusCounts());

  const serviceCountMap = consultations.reduce((acc, consultation) => {
    const key = consultation.service || 'Lainnya';
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const serviceCounts = Array.from(serviceCountMap.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  const lastUpdatedAt =
    consultations.reduce<string | null>((latest, consultation) => {
      if (!consultation.updatedAt) return latest;
      if (!latest) return consultation.updatedAt;
      return new Date(consultation.updatedAt) > new Date(latest)
        ? consultation.updatedAt
        : latest;
    }, null) ?? null;

  const recentUpdates = [...consultations]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime(),
    )
    .slice(0, 8)
    .map((consultation) => ({
      id: consultation.id,
      brandName: consultation.brandName,
      status: consultation.status,
      updatedAt: consultation.updatedAt || consultation.createdAt,
      notes: consultation.notes,
    }));

  return {
    consultations,
    summary: {
      total: consultations.length,
      lastUpdatedAt,
      statusCounts,
      serviceCounts,
      recentUpdates,
    },
  };
}

export async function getConsultationIdsForEmail(email: string) {
  const query = await db.execute(sql`
    SELECT c.id
    FROM consultations c
    WHERE LOWER(c.email) = LOWER(${email})
    ORDER BY c.created_at DESC;
  `);

  return (query.rows as Array<{ id: string }>).map((row) => String(row.id));
}

export async function consultationBelongsToEmail(params: {
  email: string;
  consultationId: string;
}) {
  const query = await db.execute(sql`
    SELECT 1
    FROM consultations c
    WHERE c.id = ${params.consultationId} AND LOWER(c.email) = LOWER(${params.email})
    LIMIT 1;
  `);

  return query.rows.length > 0;
}

