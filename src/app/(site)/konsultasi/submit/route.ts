import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { z } from "zod";

import { db } from "@/db/client";
import { consultations, affiliateReferrals } from "@/db/schema";
import {
  AFFILIATE_COMMISSION_RATE,
  AFFILIATE_COOKIE_NAME,
  computeCommission,
  getLinkByCode,
} from "@/lib/affiliate";
import {
  appendConsultationToCookie,
  CONSULTATION_TRACKING_COOKIE,
} from "@/lib/consultation-tracking";
import { renderAdminNotificationEmail } from "@/lib/email-templates";
import { appUrl } from "@/lib/email";

const BodySchema = z.object({
  email: z.string().email(),
  brandName: z.string().min(2),
  applicantName: z.string().min(2),
  service: z.string().min(1),
  company_website: z.string().optional(),
});

const SERVICE_PRICING: Record<string, number> = {
  "Pendaftaran Merek": 4_500_000,
  "Perpanjangan Merek": 3_500_000,
  "Cetak Sertifikat Merek": 1_000_000,
  "Perubahan Nama/Alamat": 3_500_000,
  "Pengalihan Hak Merek": 6_000_000,
  "Tanggapan Usul Tolak": 2_500_000,
  "Surat Keberatan": 2_500_000,
  "Perjanjian Lisensi": 3_500_000,
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// --- tambahkan di atas export async function POST ---
function renderConsultationEmail(params: {
  email: string;
  brandName: string;
  applicantName: string;
  service: string;
  id: string;
  createdAt: string;
  ip: string;
  userAgent: string;
}) {
  const {
    email, brandName, applicantName, service, id, createdAt, ip, userAgent,
  } = params;

  // warna & spacing konsisten dengan brand dan contoh visual
  const red = "#DC2626";
  const gray900 = "#111827";
  const gray600 = "#4B5563";
  const gray200 = "#E5E7EB";
  const bg = "#F8FAFC";

  // tip: semua style inline agar kompatibel dengan Gmail/Outlook
  return `
  <div style="margin:0;padding:0;background:${bg};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;background:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.06);overflow:hidden;">
            <!-- Top gradient bar -->
            <tr>
              <td style="height:8px;background:linear-gradient(135deg,#ef4444,${red});"></td>
            </tr>

            <!-- Letterhead header -->
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <table width="100%" role="presentation">
                  <tr>
                    <td align="left" style="font-family:Inter,Arial,Helvetica,sans-serif;">
                      <div style="display:inline-block;padding:8px 0 0 0;">
                        <div style="font-weight:800;font-size:22px;line-height:1;color:${red};letter-spacing:0.5px;">UMJ</div>
                        <div style="font-size:12px;color:${gray600};margin-top:2px;">urusmerek.id</div>
                      </div>
                    </td>
                    <td align="right" style="font-family:Inter,Arial,Helvetica,sans-serif;color:${gray600};font-size:12px;">
                      <div>ID Konsultasi: <span style="font-weight:600;color:${gray900}">${escapeHtml(id)}</span></div>
                      <div>Diterima: <span style="color:${gray900}">${escapeHtml(createdAt)}</span></div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title To: Name -->
            <tr>
              <td style="padding:12px 32px 0 32px;">
                <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;color:${gray600};margin:0 0 4px 0;">From</div>
                <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-weight:700;font-size:18px;color:${red};margin:0 0 16px 0;">
                  ${escapeHtml(email || "-")}
                </div>
              </td>
            </tr>

            <!-- Intro paragraph (singkat seperti contoh gambar) -->
            <tr>
              <td style="padding:0 32px 8px 32px;">
                <p style="margin:0 0 12px 0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${gray900}">
                  Ada konsultasi merek baru masuk dari landing page urusmerek.id. Detail singkat tertera di bawah ini. Tim dapat langsung menindaklanjuti dan menghubungi pemohon melalui alamat email yang tercantum.
                </p>
              </td>
            </tr>

            <!-- Data table (rapi seperti body surat) -->
            <tr>
              <td style="padding:0 32px 16px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;">
                  <tbody>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};width:210px;font-weight:600;color:${gray900}">Email</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(email)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};font-weight:600;color:${gray900}">Nama Merek</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(brandName)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};font-weight:600;color:${gray900}">Nama Pemohon</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(applicantName)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};font-weight:600;color:${gray900}">Jasa Layanan</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(service)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};font-weight:600;color:${gray900}">IP</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(ip || "-")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;background:#F9FAFB;border:1px solid ${gray200};font-weight:600;color:${gray900}">User Agent</td>
                      <td style="padding:8px 12px;border:1px solid ${gray200};color:${gray900}">${escapeHtml(userAgent || "-")}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Footer: qr + socials + WA pill -->
            <tr>
              <td style="padding:20px 24px 24px 24px;">
                <table role="presentation" width="100%">
                  <tr>
                    <!-- QR -->
                    <td align="left" style="width:120px;padding:8px;">
                      <div style="width:92px;height:92px;border:1px solid ${gray200};border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:Inter,Arial,sans-serif;font-size:12px;color:${gray600};">
                        QR
                      </div>
                    </td>

                    <!-- handles -->
                    <td align="left" style="padding:8px;">
                      <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:12px;color:${gray600};line-height:1.7">
                        <div>📧 <span style="color:${gray900};font-weight:600">yessikurniawan@urusmerek.id</span></div>
                        <div>📷 @urusmerek.id &nbsp; 🔗 urusmerek.id</div>
                      </div>
                    </td>

                    <!-- WA pill -->
                    <td align="right" style="padding:8px;">
                      <p style="text-decoration:none;display:inline-block;background:${red};color:#fff;font-family:Inter,Arial,Helvetica,sans-serif;font-weight:700;font-size:14px;padding:10px 16px;border-radius:999px;">
                        ☎︎ 0811–2119–718
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

          <!-- tiny legal -->
          <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:11px;color:${gray600};margin-top:12px;max-width:640px;">
            Email ini otomatis dari sistem urusmerek.id. Mohon balas langsung untuk menindaklanjuti pemohon.
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}

const CONSULTATION_STATUS_LABELS: Record<string, string> = {
  new: "Permintaan baru",
  in_review: "Sedang ditinjau",
  contacted: "Sudah dihubungi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function renderConsultationClientEmail(params: {
  email: string;
  brandName: string;
  applicantName: string;
  service: string;
  id: string;
  createdAt: string;
  dashboardUrl: string;
  status?: string;
}) {
  const {
    email,
    brandName,
    applicantName,
    service,
    id,
    createdAt,
    dashboardUrl,
    status = "new",
  } = params;

  const createdAtLabel = new Date(createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const greeting =
    applicantName && applicantName.trim().length > 0
      ? `Halo ${escapeHtml(applicantName)},`
      : "Halo,";
  const statusLabel = CONSULTATION_STATUS_LABELS[status] ?? status;
  const idMarkup = `<strong style="font-family:'JetBrains Mono','Fira Code',Consolas,monospace;letter-spacing:0.02em;">${escapeHtml(
    id,
  )}</strong>`;
  const dashboardLink = dashboardUrl.endsWith("/")
    ? dashboardUrl.slice(0, -1)
    : dashboardUrl;

  return renderAdminNotificationEmail({
    badgeLabel: "Konsultasi Merek",
    title: "Permintaan konsultasi kamu sudah kami terima",
    greeting,
    body: [
      "Terima kasih sudah menghubungi tim Urus Merek. Kami sudah menerima detail konsultasimu dan sedang menjadwalkan tindak lanjut.",
      `Catat ID konsultasi berikut: ${idMarkup}. ID ini berguna untuk memantau progres dan mencatat interaksi bersama konsultan kami.`,
      "Dashboard konsultasi menampilkan status terbaru, catatan konsultan, serta langkah lanjutan yang kami rekomendasikan.",
    ],
    details: [
      { label: "ID Konsultasi", value: idMarkup },
      { label: "Nama merek", value: escapeHtml(brandName) || "-" },
      { label: "Pemohon", value: escapeHtml(applicantName) || "-" },
      { label: "Layanan", value: escapeHtml(service) || "-" },
      { label: "Status awal", value: escapeHtml(statusLabel) },
    ],
    cta: {
      label: "Buka dashboard konsultasi",
      href: dashboardLink,
      description: `Masukkan ID ${escapeHtml(id)} bila diminta untuk menampilkan data.`,
    },
    footer: [
      "Simpan email ini agar ID konsultasi tetap mudah ditemukan ketika ingin memantau progres di kemudian hari.",
      "Jika kamu membutuhkan bantuan cepat, balas email ini atau hubungi kami melalui WhatsApp di 0812-3456-7890.",
    ],
    meta: [
      { label: "Email", value: email },
      { label: "Diterima", value: createdAtLabel },
    ],
  });
}

async function sendResendEmail(
  apiKey: string,
  payload: {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string | string[];
  },
) {
  const { to, subject, html, replyTo } = payload;

  const recipients = Array.isArray(to) ? to : [to];
  if (recipients.length === 0) {
    throw new Error("Missing email recipients");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "urusmerek <admin@urusmerek.id>",
      to: recipients,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Resend API responded with ${response.status}: ${errorText || response.statusText}`,
    );
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  let data: z.infer<typeof BodySchema>;

  try {
    data = BodySchema.parse(raw ? JSON.parse(raw) : {});
  } catch (error) {
    console.error("Invalid request payload", error);
    return NextResponse.json(
      { ok: false, message: "Data yang dikirim tidak valid." },
      { status: 400 },
    );
  }

  if (data.company_website && data.company_website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;

  if (!resendApiKey || !emailTo) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Layanan konsultasi belum siap karena konfigurasi email belum diaktifkan. Mohon hubungi tim urusmerek.",
      },
      { status: 500 },
    );
  }

  const headerList = await headers();
  const cookieStore = await cookies();
  const forwardedFor = headerList.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",").map((item) => item.trim())[0] ?? "";
  const userAgent = headerList.get("user-agent") ?? "";

  try {
    const [row] = await db
      .insert(consultations)
      .values({
        email: data.email,
        brandName: data.brandName,
        applicantName: data.applicantName,
        service: data.service,
        ip,
        userAgent,
      })
      .returning({ id: consultations.id, createdAt: consultations.createdAt });

    // attribute consultation to affiliate link when referral cookie exists
    try {
      const referralCode = cookieStore.get(AFFILIATE_COOKIE_NAME)?.value?.trim();
      if (referralCode) {
        const link = await getLinkByCode(referralCode);
        if (link) {
          const amount = SERVICE_PRICING[data.service] ?? 0;
          const commission = computeCommission(amount);
          await db.insert(affiliateReferrals).values({
            linkId: link.id,
            orderId: row.id,
            amount: amount.toFixed(2),
            commission: commission.toFixed(2),
            status: "pending",
            meta: {
              source: "consultation",
              consultationId: row.id,
              email: data.email,
              service: data.service,
              servicePrice: amount,
              commissionRate: AFFILIATE_COMMISSION_RATE,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to attribute consultation referral", error);
    }

    let emailSent = true;
    const createdAtValue =
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : typeof row.createdAt === "string"
          ? row.createdAt
          : "-";
    const ipValue = ip || "-";
    const userAgentValue = userAgent || "-";

    const normalizedAppUrl = appUrl.endsWith("/")
      ? appUrl.slice(0, -1)
      : appUrl;
    const dashboardUrl = `${normalizedAppUrl}/konsultasi/dashboard`;

    const adminEmailHtml = renderConsultationEmail({
      email: data.email,
      brandName: data.brandName,
      applicantName: data.applicantName,
      service: data.service,
      id: row.id,
      createdAt: createdAtValue,
      ip: ipValue,
      userAgent: userAgentValue,
    });

    const clientEmailHtml = renderConsultationClientEmail({
      email: data.email,
      brandName: data.brandName,
      applicantName: data.applicantName,
      service: data.service,
      id: row.id,
      createdAt: createdAtValue,
      dashboardUrl,
      status: "new",
    });

    const emailPayloads = [
      {
        to: emailTo,
        subject: "Konsultasi Merek Baru",
        html: adminEmailHtml,
        replyTo: data.email,
      },
      {
        to: data.email,
        subject: "Ringkasan konsultasi merek kamu",
        html: clientEmailHtml,
        replyTo: emailTo,
      },
    ] as const;

    const emailResults = await Promise.allSettled(
      emailPayloads.map((payload) => sendResendEmail(resendApiKey, payload)),
    );

    for (const result of emailResults) {
      if (result.status === "rejected") {
        emailSent = false;
        console.error("Resend email error", result.reason);
      }
    }

    const trackingCookie = appendConsultationToCookie(
      cookieStore.get(CONSULTATION_TRACKING_COOKIE)?.value,
      row.id,
    );

    const response = NextResponse.json({
      ok: true,
      emailSent,
      consultationId: row.id,
      trackedIds: [row.id],
    });

    if (trackingCookie.value) {
      response.cookies.set({
        name: CONSULTATION_TRACKING_COOKIE,
        value: trackingCookie.value,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    response.cookies.delete(AFFILIATE_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("Failed to store consultation", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Tidak dapat menyimpan konsultasi saat ini. Silakan coba lagi beberapa saat lagi.",
      },
      { status: 500 },
    );
  }
}
