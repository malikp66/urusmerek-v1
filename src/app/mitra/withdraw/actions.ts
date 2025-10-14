"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  partnerBankAccounts,
  partnerWithdrawRequests,
  users,
} from "@/db/schema";
import { db } from "@/lib/db";
import { requireMitra } from "@/lib/auth-guards";
import { getMitraBalance } from "@/app/mitra/affiliates/queries";
import { findBankByCode } from "@/lib/constants/banks";
import { notifyWithdrawRequest } from "@/lib/notifications";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  bankCode: z.string().min(2, "Pilih bank tujuan"),
  accountName: z.string().min(3, "Nama pemilik wajib diisi").max(100),
  accountNumber: z
    .string()
    .min(4, "Nomor rekening tidak valid")
    .max(32, "Nomor rekening terlalu panjang"),
  setDefault: z.coerce.boolean().optional(),
});

export async function createWithdrawRequest(input: FormData) {
  const session = await requireMitra();
  const parsed = withdrawSchema.safeParse({
    amount: input.get("amount"),
    bankCode: input.get("bankCode"),
    accountName: input.get("accountName"),
    accountNumber: input.get("accountNumber"),
    setDefault: input.get("setDefault") === "on",
  });

  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    throw new Error(issue?.message ?? "Data pencairan tidak valid");
  }

  const bank = findBankByCode(parsed.data.bankCode);
  if (!bank) {
    throw new Error("Kode bank tidak dikenal");
  }

  const userId = Number(session.sub);
  const balance = await getMitraBalance(userId);
  const user = await db.query.users.findFirst({
    columns: {
      name: true,
      email: true,
    },
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("Data mitra tidak ditemukan");
  }

  if (parsed.data.amount < 100_000) {
    throw new Error("Minimal withdraw adalah Rp 100.000");
  }

  if (parsed.data.amount > balance.available) {
    throw new Error("Nominal melebihi saldo yang dapat dicairkan");
  }

  const existingAccount = await db.query.partnerBankAccounts.findFirst({
    where: and(
      eq(partnerBankAccounts.userId, userId),
      eq(partnerBankAccounts.bankCode, parsed.data.bankCode),
      eq(partnerBankAccounts.accountNumber, parsed.data.accountNumber)
    ),
  });

  let bankAccountId: number;

  if (existingAccount) {
    await db
      .update(partnerBankAccounts)
      .set({
        accountName: parsed.data.accountName,
        updatedAt: new Date(),
      })
      .where(eq(partnerBankAccounts.id, existingAccount.id));
    bankAccountId = existingAccount.id;
  } else {
    const [inserted] = await db
      .insert(partnerBankAccounts)
      .values({
        userId,
        bankCode: bank.code,
        bankName: bank.name,
        accountName: parsed.data.accountName,
        accountNumber: parsed.data.accountNumber,
        isDefault: parsed.data.setDefault ?? false,
      })
      .returning({ id: partnerBankAccounts.id });

    bankAccountId = inserted.id;
  }

  if (parsed.data.setDefault) {
    await db
      .update(partnerBankAccounts)
      .set({ isDefault: false })
      .where(
        and(
          eq(partnerBankAccounts.userId, userId),
          eq(partnerBankAccounts.isDefault, true)
        )
      );

    await db
      .update(partnerBankAccounts)
      .set({ isDefault: true })
      .where(eq(partnerBankAccounts.id, bankAccountId));
  }

  const [withdraw] = await db
    .insert(partnerWithdrawRequests)
    .values({
      userId,
      amount: parsed.data.amount,
      status: "pending",
      bankSnapshot: {
        bankCode: bank.code,
        bankName: bank.name,
        accountName: parsed.data.accountName,
        accountNumber: parsed.data.accountNumber,
      },
      notes: null,
    })
    .returning({
      id: partnerWithdrawRequests.id,
      createdAt: partnerWithdrawRequests.createdAt,
    });

  notifyWithdrawRequest({
    withdrawId: withdraw.id,
    amount: parsed.data.amount,
    partnerName: user.name,
    partnerEmail: user.email,
    bank: {
      bankCode: bank.code,
      bankName: bank.name,
      accountName: parsed.data.accountName,
      accountNumber: parsed.data.accountNumber,
    },
    createdAt: withdraw.createdAt,
  }).catch((error) => {
    console.error(
      "[withdraw] Failed to dispatch withdraw request notification",
      error
    );
  });

  revalidatePath("/mitra/withdraw");
  revalidatePath("/mitra/affiliates");
}
