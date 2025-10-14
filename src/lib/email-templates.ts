import "server-only";

const COLORS = {
  brand: "#DC2626",
  partner: "#047857",
  background: "#F8FAFC",
  white: "#FFFFFF",
  gray900: "#111827",
  gray700: "#374151",
  gray600: "#4B5563",
  gray500: "#6B7280",
  gray200: "#E5E7EB",
  gray100: "#F3F4F6",
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

type EmailMetaItem = {
  label: string;
  value: string;
};

type EmailDetailItem = {
  label: string;
  value: string;
};

type EmailCta = {
  label: string;
  href: string;
  description?: string;
};

type BaseNotificationEmailOptions = {
  title: string;
  greeting?: string;
  body?: string[];
  details?: EmailDetailItem[];
  footer?: string[];
  cta?: EmailCta;
  meta?: EmailMetaItem[];
  badgeLabel?: string;
};

type NotificationScope = "admin" | "mitra";

type NotificationEmailOptions = BaseNotificationEmailOptions & {
  scope: NotificationScope;
};

const scopeConfig: Record<NotificationScope, { badgeColor: string; badgeBg: string; defaultBadge: string }> =
  {
    admin: {
      badgeColor: COLORS.brand,
      badgeBg: "rgba(220,38,38,0.12)",
      defaultBadge: "Notifikasi Admin",
    },
    mitra: {
      badgeColor: COLORS.partner,
      badgeBg: "rgba(4,120,87,0.12)",
      defaultBadge: "Notifikasi Mitra",
    },
  };

const renderParagraphs = (items: string[]) =>
  items
    .filter(Boolean)
    .map(
      (value) =>
        `<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:${COLORS.gray900};">${value}</p>`
    )
    .join("");

const renderMeta = (items: EmailMetaItem[]) => {
  if (items.length === 0) return "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;font-size:12px;color:${COLORS.gray600};line-height:1.5;">
      ${items
        .map(
          ({ label, value }) => `
        <tr>
          <td style="padding:2px 0;font-weight:600;color:${COLORS.gray900};white-space:nowrap;">${escapeHtml(
            label
          )}:</td>
          <td style="padding:2px 0 2px 8px;color:${COLORS.gray600};">${escapeHtml(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;
};

const renderDetailsTable = (items: EmailDetailItem[]) => {
  if (items.length === 0) return "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-size:14px;margin-top:8px;">
      <tbody>
        ${items
          .map((item, index) => {
            const background = index % 2 === 0 ? COLORS.gray100 : COLORS.white;
            return `
              <tr>
                <td style="padding:10px 14px;background:${background};border:1px solid ${COLORS.gray200};border-right:none;width:220px;font-weight:600;color:${COLORS.gray900};text-transform:uppercase;letter-spacing:0.04em;font-size:11px;">
                  ${escapeHtml(item.label)}
                </td>
                <td style="padding:10px 14px;background:${background};border:1px solid ${COLORS.gray200};border-left:none;color:${COLORS.gray700};">
                  ${item.value}
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
};

const renderCta = (cta?: EmailCta) => {
  if (!cta) return "";

  return `
    <div style="margin-top:24px;">
      ${
        cta.description
          ? `<p style="margin:0 0 12px 0;font-size:14px;color:${COLORS.gray600};line-height:1.6;">${cta.description}</p>`
          : ""
      }
      <a
        href="${cta.href}"
        style="display:inline-block;padding:12px 20px;background:${COLORS.brand};color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;border-radius:6px;"
      >
        ${cta.label}
      </a>
    </div>
  `;
};

const renderFooter = (items: string[]) => {
  if (items.length === 0) return "";
  return `
    <div style="margin-top:20px;">
      ${items
        .map(
          (value) =>
            `<p style="margin:0 0 10px 0;font-size:13px;line-height:1.5;color:${COLORS.gray600};">${value}</p>`
        )
        .join("")}
    </div>
  `;
};

const renderNotificationEmail = ({
  scope,
  title,
  greeting,
  body = [],
  details = [],
  footer = [],
  cta,
  meta = [],
  badgeLabel,
}: NotificationEmailOptions) => {
  const { badgeBg, badgeColor, defaultBadge } = scopeConfig[scope];
  const greetingBlock = greeting
    ? `<div style="font-size:14px;font-weight:600;color:${COLORS.gray600};margin-bottom:10px;">${greeting}</div>`
    : "";

  return `
    <div style="margin:0;padding:0;background:${COLORS.background};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${COLORS.background};padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;background:${COLORS.white};border-radius:12px;box-shadow:0 10px 28px rgba(15,23,42,0.12);overflow:hidden;">
              <tr>
                <td style="height:10px;background:linear-gradient(135deg,#ef4444,${COLORS.brand});"></td>
              </tr>

              <tr>
                <td style="padding:28px 32px 18px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:'Inter',Arial,Helvetica,sans-serif;">
                        <div style="font-weight:800;font-size:20px;letter-spacing:0.4px;color:${COLORS.brand};">UMJ</div>
                        <div style="font-size:12px;color:${COLORS.gray500};margin-top:4px;">urusmerek.id</div>
                      </td>
                      <td style="font-family:'Inter',Arial,Helvetica,sans-serif;" align="right">
                        <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:${badgeBg};color:${badgeColor};font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">
                          ${escapeHtml(badgeLabel ?? defaultBadge)}
                        </div>
                        ${renderMeta(meta)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <div style="font-family:'Inter',Arial,Helvetica,sans-serif;font-weight:700;font-size:22px;line-height:1.3;color:${COLORS.gray900};margin:0 0 12px 0;">
                    ${title}
                  </div>
                  ${greetingBlock}
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;font-family:'Inter','Segoe UI',Arial,sans-serif;">
                  ${renderParagraphs(body)}
                </td>
              </tr>

              ${
                details.length
                  ? `
              <tr>
                <td style="padding:4px 32px 12px 32px;font-family:'Inter','Segoe UI',Arial,sans-serif;">
                  ${renderDetailsTable(details)}
                </td>
              </tr>
              `
                  : ""
              }

              <tr>
                <td style="padding:0 32px;font-family:'Inter','Segoe UI',Arial,sans-serif;">
                  ${renderCta(cta)}
                  ${renderFooter(footer)}
                  <div style="margin-top:28px;font-size:13px;color:${COLORS.gray600};line-height:1.5;">
                    Salam hangat,<br/>
                    <strong style="color:${COLORS.brand}">Tim urusmerek.id</strong>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="height:24px;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export const renderAdminNotificationEmail = (
  options: BaseNotificationEmailOptions
) => renderNotificationEmail({ ...options, scope: "admin" });

export const renderPartnerNotificationEmail = (
  options: BaseNotificationEmailOptions
) => renderNotificationEmail({ ...options, scope: "mitra" });
