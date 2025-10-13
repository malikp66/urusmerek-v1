import { NextResponse } from "next/server";

import { referralStatusEnum } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-guards";
import {
  getReferralById,
  updateReferralStatus,
  type ReferralStatus,
} from "@/lib/services/admin/referrals";

const STATUS_SET = new Set(referralStatusEnum.enumValues);

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const id = Number.parseInt(params.id, 10);
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
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "ID tidak valid" }, { status: 400 });
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
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update referral status", error);
    return NextResponse.json(
      { ok: false, message: "Gagal memperbarui status referral" },
      { status: 500 }
    );
  }
}
