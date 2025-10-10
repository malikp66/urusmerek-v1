import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';

export type AdminDashboardStats = {
  totalPartners: number;
  activeLinks: number;
  pendingConsultations: number;
  pendingWithdrawRequests: number;
  commissionApproved: number;
  commissionPaid: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const result = await db.execute(sql`
    SELECT
      (SELECT COUNT(*)::int FROM users u WHERE u.role = 'mitra') AS total_partners,
      (SELECT COUNT(*)::int FROM affiliate_links l WHERE l.is_active = true) AS active_links,
      (
        SELECT COUNT(*)::int
        FROM consultations c
        WHERE c.status IN ('new', 'in_review')
      ) AS pending_consultations,
      (
        SELECT COUNT(*)::int
        FROM partner_withdraw_requests w
        WHERE w.status IN ('pending', 'approved', 'processing')
      ) AS pending_withdraw_requests,
      (
        SELECT COALESCE(SUM(r.commission), 0)::numeric
        FROM affiliate_referrals r
        WHERE r.status IN ('approved', 'paid')
      ) AS commission_approved,
      (
        SELECT COALESCE(SUM(r.commission), 0)::numeric
        FROM affiliate_referrals r
        WHERE r.status = 'paid'
      ) AS commission_paid;
  `);

  const row = result.rows[0] ?? {};

  const parseNumeric = (value: unknown) =>
    typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

  return {
    totalPartners: Number(row.total_partners) || 0,
    activeLinks: Number(row.active_links) || 0,
    pendingConsultations: Number(row.pending_consultations) || 0,
    pendingWithdrawRequests: Number(row.pending_withdraw_requests) || 0,
    commissionApproved: parseNumeric(row.commission_approved),
    commissionPaid: parseNumeric(row.commission_paid),
  };
}
