import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db/client";
import { consultations } from "@/db/schema";

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
          "Layanan konsultasi belum siap karena konfigurasi email belum diaktifkan. Mohon hubungi tim UrusMerek.",
      },
      { status: 500 },
    );
  }

  const headerList = headers();
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
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UrusMerek <noreply@urusmerek.id>",
          to: [emailTo],
          reply_to: data.email,
          subject: "Konsultasi Merek Baru",
          html: `
          <div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111827;">
            <h2 style="font-size:18px;color:#dc2626;margin-bottom:12px;">Konsultasi Merek Baru</h2>
            <p style="margin:0 0 16px;">Ada konsultasi merek baru yang masuk melalui landing page.</p>
            <table style="border-collapse:collapse;width:100%;max-width:520px;">
              <tbody>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;width:180px;">Email</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(data.email)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">Nama Merek</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(data.brandName)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">Nama Pemohon</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(data.applicantName)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">Jasa Layanan</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(data.service)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">ID Konsultasi</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(row.id)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">Diterima</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(createdAtValue)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">IP</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(ipValue)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 10px;font-weight:600;background:#f8fafc;border:1px solid #e2e8f0;">User Agent</td>
                  <td style="padding:6px 10px;border:1px solid #e2e8f0;">${escapeHtml(userAgentValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
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
