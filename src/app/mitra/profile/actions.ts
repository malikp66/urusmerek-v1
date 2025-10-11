"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { partnerBankAccounts, partnerProfiles } from "@/db/schema";
import { db } from "@/lib/db";
import { requireMitra } from "@/lib/auth-guards";
import { findBankByCode } from "@/lib/constants/banks";

const profileSchema = z.object({
  phone: z.string().max(32).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  taxNumber: z.string().max(64).optional().nullable(),
  defaultBankId: z.coerce.number().int().positive().optional().nullable(),
});

const bankAccountSchema = z.object({
  bankCode: z.string().min(2, "Pilih bank tujuan"),
  accountName: z.string().min(3, "Nama pemilik wajib diisi").max(100),
  accountNumber: z.string().min(4, "Nomor rekening tidak valid").max(32),
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

export async function createBankAccount(formData: FormData) {
  const session = await requireMitra();
  const parsed = bankAccountSchema.safeParse({
    bankCode: formData.get("bankCode"),
    accountName: formData.get("accountName"),
    accountNumber: formData.get("accountNumber"),
  });

  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    throw new Error(issue?.message ?? "Data rekening tidak valid");
  }

  const bank = findBankByCode(parsed.data.bankCode);
  if (!bank) {
    throw new Error("Kode bank tidak dikenali");
  }

  const userId = Number(session.sub);

  const existingAccount = await db.query.partnerBankAccounts.findFirst({
    where: and(
      eq(partnerBankAccounts.userId, userId),
      eq(partnerBankAccounts.bankCode, bank.code),
      eq(partnerBankAccounts.accountNumber, parsed.data.accountNumber)
    ),
  });

  if (existingAccount) {
    await db
      .update(partnerBankAccounts)
      .set({
        accountName: parsed.data.accountName,
        bankName: bank.name,
        updatedAt: new Date(),
      })
      .where(eq(partnerBankAccounts.id, existingAccount.id));
    revalidatePath("/mitra/profile");
    return { id: existingAccount.id, updated: true };
  }

  const [inserted] = await db
    .insert(partnerBankAccounts)
    .values({
      userId,
      bankCode: bank.code,
      bankName: bank.name,
      accountName: parsed.data.accountName,
      accountNumber: parsed.data.accountNumber,
      isDefault: false,
    })
    .returning({ id: partnerBankAccounts.id });

  revalidatePath("/mitra/profile");
  return { id: inserted.id, created: true };
}
