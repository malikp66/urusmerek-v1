"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { partnerBankAccounts, partnerProfiles } from "@/db/schema";
import { db } from "@/lib/db";
import { requireMitra } from "@/lib/auth-guards";

const profileSchema = z.object({
  phone: z.string().max(32).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  taxNumber: z.string().max(64).optional().nullable(),
  defaultBankId: z.coerce.number().int().positive().optional().nullable(),
});

export async function updateMitraProfile(formData: FormData) {
  const session = await requireMitra();
  const rawDefaultBank = formData.get("defaultBankId");
  const parsed = profileSchema.safeParse({
    phone: formData.get("phone")?.toString() || null,
    address: formData.get("address")?.toString() || null,
    taxNumber: formData.get("taxNumber")?.toString() || null,
    defaultBankId:
      rawDefaultBank && typeof rawDefaultBank === "string" && rawDefaultBank.length > 0
        ? rawDefaultBank
        : null,
  });

  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    throw new Error(issue?.message ?? "Data profil tidak valid");
  }

  const userId = Number(session.sub);

  const existingProfile = await db.query.partnerProfiles.findFirst({
    where: eq(partnerProfiles.userId, userId),
  });

  if (existingProfile) {
    await db
      .update(partnerProfiles)
      .set({
        phone: parsed.data.phone,
        address: parsed.data.address,
        taxNumber: parsed.data.taxNumber,
        updatedAt: new Date(),
      })
      .where(eq(partnerProfiles.id, existingProfile.id));
  } else {
    await db.insert(partnerProfiles).values({
      userId,
      phone: parsed.data.phone,
      address: parsed.data.address,
      taxNumber: parsed.data.taxNumber,
    });
  }

  if (parsed.data.defaultBankId) {
    await db
      .update(partnerBankAccounts)
      .set({ isDefault: false })
      .where(eq(partnerBankAccounts.userId, userId));

    await db
      .update(partnerBankAccounts)
      .set({ isDefault: true })
      .where(
        and(
          eq(partnerBankAccounts.userId, userId),
          eq(partnerBankAccounts.id, parsed.data.defaultBankId)
        )
      );
  }

  revalidatePath("/mitra/profile");
}
