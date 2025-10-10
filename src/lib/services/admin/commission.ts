import 'server-only';

import { eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import { partnerCommissionSettings } from '@/db/schema';

export type CommissionSetting = {
  id: number;
  userId: number | null;
  defaultRate: number;
  customRates: Record<string, unknown> | null;
  effectiveFrom: Date | string | null;
  createdBy: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const parseNumeric = (value: unknown) =>
  typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;

function mapRow(row: typeof partnerCommissionSettings.$inferSelect): CommissionSetting {
  return {
    id: Number(row.id),
    userId: row.userId ?? null,
    defaultRate: parseNumeric(row.defaultRate),
    customRates: (row.customRates as Record<string, unknown> | null) ?? null,
    effectiveFrom: (row.effectiveFrom as Date | string | null) ?? null,
    createdBy: row.createdBy ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getDefaultCommissionSetting(): Promise<CommissionSetting | null> {
  const record = await db.query.partnerCommissionSettings.findFirst({
    where: isNull(partnerCommissionSettings.userId),
  });
  return record ? mapRow(record) : null;
}

export async function upsertDefaultCommissionSetting({
  rate,
  adminId,
}: {
  rate: number;
  adminId: number;
}) {
  const existing = await getDefaultCommissionSetting();
  if (!existing) {
    await db.insert(partnerCommissionSettings).values({
      userId: null,
      defaultRate: rate,
      createdBy: adminId,
    });
    return;
  }

  await db
    .update(partnerCommissionSettings)
    .set({
      defaultRate: rate,
      createdBy: adminId,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommissionSettings.id, existing.id));
}

export async function getUserCommissionSetting(userId: number): Promise<CommissionSetting | null> {
  const record = await db.query.partnerCommissionSettings.findFirst({
    where: eq(partnerCommissionSettings.userId, userId),
  });
  return record ? mapRow(record) : null;
}

export async function upsertUserCommissionSetting({
  userId,
  rate,
  customRates,
  adminId,
}: {
  userId: number;
  rate: number;
  customRates?: Record<string, unknown> | null;
  adminId: number;
}) {
  const existing = await getUserCommissionSetting(userId);
  if (!existing) {
    await db.insert(partnerCommissionSettings).values({
      userId,
      defaultRate: rate,
      customRates,
      createdBy: adminId,
    });
    return;
  }

  await db
    .update(partnerCommissionSettings)
    .set({
      defaultRate: rate,
      customRates: customRates ?? null,
      createdBy: adminId,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommissionSettings.id, existing.id));
}
