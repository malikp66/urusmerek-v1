import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth-guards";
import { getAdminReferrals } from "@/lib/services/admin/referrals";

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status") ?? "all";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = Number.parseInt(searchParams.get("perPage") ?? "20", 10);

  try {
    const result = await getAdminReferrals({
      search,
      status: status as any,
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? perPage : 20,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("Failed to load referral list", error);
    return NextResponse.json(
      { ok: false, message: "Gagal memuat daftar referral" },
      { status: 500 }
    );
  }
}
