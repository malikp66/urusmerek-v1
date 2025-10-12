import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { z } from "zod";

import { db } from "@/db/client";
import { consultations, affiliateReferrals } from "@/db/schema";
import {
  AFFILIATE_COOKIE_NAME,
  computeCommission,
  getLinkByCode,
} from "@/lib/affiliate";

const BodySchema = z.object({
  email: z.string().email(),
  brandName: z.string().min(2),
  applicantName: z.string().min(2),
  service: z.string().min(1),
  company_website: z.string().optional(),
});

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
      const referralCode = (await cookies()).get(AFFILIATE_COOKIE_NAME)?.value?.trim();
      if (referralCode) {
        const link = await getLinkByCode(referralCode);
        if (link) {
          const amount = 0;
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

    try {
      const emailHtml = renderConsultationEmail({
        email: data.email,
        brandName: data.brandName,
        applicantName: data.applicantName,
        service: data.service,
        id: row.id,
        createdAt: createdAtValue,
        ip: ipValue,
        userAgent: userAgentValue,
      });

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "urusmerek <admin@urusmerek.id>",
          to: [emailTo],
          reply_to: data.email,
          subject: "Konsultasi Merek Baru",
          html: emailHtml,
        }),
      });


      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(
          `Resend API responded with ${emailResponse.status}: ${errorText || emailResponse.statusText}`,
        );
      }
    } catch (error) {
      emailSent = false;
      console.error("Resend email error", error);
    }

    return NextResponse.json({ ok: true, emailSent });
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
