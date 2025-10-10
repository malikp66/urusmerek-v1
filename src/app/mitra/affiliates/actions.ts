"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { affiliateLinks } from "@/db/schema";
import { db } from "@/lib/db";
import { requireMitra } from "@/lib/auth-guards";
import { generateUniqueAffiliateCode } from "@/lib/affiliate";

const toggleSchema = z.object({
  linkId: z.number().int().positive(),
  isActive: z.boolean(),
});

const createSchema = z.object({
  targetUrl: z.string().url("URL tujuan tidak valid").max(2048),
  description: z.string().max(160, "Keterangan maksimal 160 karakter").optional(),
});

const updateSchema = z.object({
  linkId: z.number().int().positive(),
  targetUrl: z.string().url("URL tujuan tidak valid").max(2048),
  description: z.string().max(160, "Keterangan maksimal 160 karakter").optional(),
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

export async function createAffiliateLink(input: { targetUrl: string; description?: string }) {
  const session = await requireMitra();
  const payload = createSchema.parse(input);

  const targetUrl = payload.targetUrl.trim();
  const description = payload.description?.trim();

  const code = await generateUniqueAffiliateCode({
    userId: Number(session.sub),
  });

  await db.insert(affiliateLinks).values({
    userId: Number(session.sub),
    code,
    targetUrl,
    description: description ? description : null,
    isActive: true,
  });

  revalidatePath("/mitra/affiliates");
  return { code };
}

export async function updateAffiliateLink(input: {
  linkId: number;
  targetUrl: string;
  description?: string;
}) {
  const session = await requireMitra();
  const payload = updateSchema.parse(input);

  const result = await db
    .update(affiliateLinks)
    .set({
      targetUrl: payload.targetUrl.trim(),
      description: payload.description?.trim() || null,
    })
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
