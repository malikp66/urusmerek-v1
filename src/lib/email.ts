import "server-only";

import { env } from "@/lib/env";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = process.env.EMAIL_FROM ?? "urusmerek <admin@urusmerek.id>";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.EMAIL_TO ?? "yessikurniawan@urusmerek.id";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string | string[];
};

type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string };

const toArray = (value: string | string[]): string[] =>
  Array.isArray(value) ? value : [value];

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not configured. Email delivery skipped."
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const recipients = toArray(to).filter(Boolean);

  if (recipients.length === 0) {
    console.warn("[email] sendEmail called without recipients");
    return { ok: false, error: "Missing recipients" };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: recipients,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[email] Resend API error",
        response.status,
        errorText || response.statusText
      );
      return {
        ok: false,
        error: errorText || response.statusText,
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[email] Failed to send email", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unknown email transport error",
    };
  }
}

export const appUrl = env.APP_URL;
