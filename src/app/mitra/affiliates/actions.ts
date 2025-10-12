"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { affiliateLinks } from "@/db/schema";
import { db } from "@/lib/db";
import { requireMitra } from "@/lib/auth-guards";
import { generateUniqueAffiliateCode } from "@/lib/affiliate";
import { env } from "@/lib/env";

const toggleSchema = z.object({
  linkId: z.number().int().positive(),
  isActive: z.boolean(),
});

const deleteSchema = z.object({
  linkId: z.number().int().positive(),
});

export async function toggleAffiliateLink(input: {
  linkId: number;
  isActive: boolean;
}) {
  const session = await requireMitra();
  const payload = toggleSchema.parse(input);

  const result = await db
    .update(affiliateLinks)
    .set({ isActive: payload.isActive })
    .where(
      and(
        eq(affiliateLinks.id, payload.linkId),
        eq(affiliateLinks.userId, Number(session.sub))
      )
    )
    .returning({ id: affiliateLinks.id });

  if (result.length === 0) {
    throw new Error("Link tidak ditemukan");
  }

  revalidatePath("/mitra/affiliates");
}

export async function createAffiliateLink() {
  const session = await requireMitra();

  const code = await generateUniqueAffiliateCode({
    userId: Number(session.sub),
  });

  await db.insert(affiliateLinks).values({
    userId: Number(session.sub),
    code,
    targetUrl: env.APP_URL,
    description: null,
    isActive: true,
  });

  revalidatePath("/mitra/affiliates");
  return { code };
}

export async function deleteAffiliateLink(input: { linkId: number }) {
  const session = await requireMitra();
  const payload = deleteSchema.parse(input);

  const result = await db
    .delete(affiliateLinks)
    .where(
      and(
        eq(affiliateLinks.id, payload.linkId),
        eq(affiliateLinks.userId, Number(session.sub))
      )
    )
    .returning({ id: affiliateLinks.id });

  if (result.length === 0) {
    throw new Error("Link tidak ditemukan");
  }

  revalidatePath("/mitra/affiliates");
}
