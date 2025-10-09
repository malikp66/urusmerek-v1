"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { affiliateLinks, affiliateReferrals } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const referralSchema = z.object({
  referralId: z.number().int().positive(),
  status: z.enum(["pending", "approved", "rejected", "paid"]),
});

const toggleSchema = z.object({
  linkId: z.number().int().positive(),
  isActive: z.boolean(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function updateReferralStatus(input: {
  referralId: number;
  status: "pending" | "approved" | "rejected" | "paid";
}) {
  await requireAdmin();
  const payload = referralSchema.parse(input);

  await db
    .update(affiliateReferrals)
    .set({ status: payload.status })
    .where(eq(affiliateReferrals.id, payload.referralId));

  revalidatePath("/admin/affiliates");
}

export async function toggleAffiliateLink(input: {
  linkId: number;
  isActive: boolean;
}) {
  await requireAdmin();
  const payload = toggleSchema.parse(input);

  await db
    .update(affiliateLinks)
    .set({ isActive: payload.isActive })
    .where(eq(affiliateLinks.id, payload.linkId));

  revalidatePath("/admin/affiliates");
}
