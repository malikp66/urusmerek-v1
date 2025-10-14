import { NextResponse } from "next/server";

import { referralStatusEnum } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-guards";
import {
  getReferralById,
  updateReferralStatus,
  type ReferralStatus,
} from "@/lib/services/admin/referrals";
import { notifyReferralStatusChange } from "@/lib/notifications";

const STATUS_SET = new Set(referralStatusEnum.enumValues);

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id: rawId } = await context.params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const referral = await getReferralById(id);
    if (!referral) {
      return NextResponse.json(
        { ok: false, message: "Data referral tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: referral });
  } catch (error) {
    console.error("Failed to load referral detail", error);
    return NextResponse.json(
      { ok: false, message: "Gagal memuat detail referral" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id: rawId } = await context.params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "ID tidak valid" }, { status: 400 });
  }

  const existing = await getReferralById(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Data referral tidak ditemukan" },
      { status: 404 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Payload tidak valid" },
      { status: 400 }
    );
  }

  const body = payload as Partial<{ status: ReferralStatus }>;
  const status = body.status;

  if (!status || !STATUS_SET.has(status)) {
    return NextResponse.json(
      { ok: false, message: "Status referral tidak valid" },
      { status: 400 }
    );
  }

  try {
    await updateReferralStatus({ id, status });
    const updated = await getReferralById(id);
    if (updated) {
      notifyReferralStatusChange({
        referralId: updated.id,
        partnerName: updated.userName,
        partnerEmail: updated.userEmail,
        linkCode: updated.linkCode,
        orderId: updated.orderId,
        amount: updated.amount,
        commission: updated.commission,
        previousStatus: existing.status,
        currentStatus: updated.status,
        updatedAt: new Date(),
      }).catch((error) => {
        console.error(
          "[notifications] Failed sending referral status notification",
          error
        );
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update referral status", error);
    return NextResponse.json(
      { ok: false, message: "Gagal memperbarui status referral" },
      { status: 500 }
    );
  }
}
