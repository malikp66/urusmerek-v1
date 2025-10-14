"use server";

import "server-only";

import { ADMIN_NOTIFICATION_EMAIL, appUrl, sendEmail } from "@/lib/email";
import {
  escapeHtml,
  renderAdminNotificationEmail,
  renderPartnerNotificationEmail,
} from "@/lib/email-templates";

type WithdrawBankSnapshot = {
  bankName?: string;
  bankCode?: string;
  accountName?: string;
  accountNumber?: string;
};

type WithdrawRequestNotificationInput = {
  withdrawId: number;
  amount: number;
  partnerName: string;
  partnerEmail: string;
  bank: WithdrawBankSnapshot;
  createdAt: Date | string;
};

type WithdrawStatusChangeNotificationInput = {
  withdrawId: number;
  amount: number;
  partnerName: string;
  partnerEmail: string;
  bank: WithdrawBankSnapshot;
  previousStatus: string;
  currentStatus: string;
  notes: string | null;
  updatedAt: Date | string;
  processedBy: number;
};

type ReferralStatusChangeNotificationInput = {
  referralId: number;
  partnerName: string;
  partnerEmail: string;
  linkCode: string;
  orderId: string;
  amount: number;
  commission: number;
  previousStatus: string;
  currentStatus: string;
  updatedAt: Date | string;
};

const withdrawStatusLabels: Record<string, string> = {
  pending: "Menunggu review",
  approved: "Disetujui",
  processing: "Sedang diproses",
  paid: "Sudah dibayarkan",
  rejected: "Ditolak",
};

const referralStatusLabels: Record<string, string> = {
  pending: "Menunggu verifikasi",
  approved: "Komisi disetujui",
  rejected: "Ditolak",
  paid: "Sudah dibayarkan",
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatAccountNumber = (value?: string) => {
  if (!value) return "-";
  const trimmed = value.trim();
  if (trimmed.length <= 4) return trimmed;
  return `••••${trimmed.slice(-4)}`;
};

export async function notifyWithdrawRequest({
  withdrawId,
  amount,
  partnerName,
  partnerEmail,
  bank,
  createdAt,
}: WithdrawRequestNotificationInput) {
  const amountLabel = currencyFormatter.format(amount);
  const createdAtLabel = dateTimeFormatter.format(new Date(createdAt));
  const bankName = bank.bankName ?? "-";
  const bankCode = bank.bankCode ? bank.bankCode.toUpperCase() : "-";
  const accountName = bank.accountName ?? "-";
  const accountNumber = formatAccountNumber(
    typeof bank.accountNumber === "string"
      ? bank.accountNumber
      : ""
  );
  const partnerSummary = escapeHtml(`${partnerName} <${partnerEmail}>`);
  const bankSummary = `${escapeHtml(bankName)} (${escapeHtml(bankCode)})<br/>a.n ${escapeHtml(
    accountName
  )}<br/>${escapeHtml(accountNumber)}`;

  const adminHtml = renderAdminNotificationEmail({
    title: "Permintaan withdraw baru dari mitra",
    greeting: "Halo tim admin,",
    body: [
      `Ada permintaan withdraw baru dari <strong>${escapeHtml(partnerName)}</strong>.`,
      "Berikut ringkasan yang kami terima:",
    ],
    details: [
      { label: "ID Withdraw", value: escapeHtml(`#${withdrawId}`) },
      { label: "Nominal", value: escapeHtml(amountLabel) },
      { label: "Mitra", value: partnerSummary },
      { label: "Rekening tujuan", value: bankSummary },
      { label: "Diajukan pada", value: escapeHtml(createdAtLabel) },
    ],
    cta: {
      description: "Kelola permintaan ini melalui dashboard admin.",
      href: `${appUrl}/admin/withdraw/${withdrawId}`,
      label: "Buka detail withdraw",
    },
    meta: [
      { label: "Jenis", value: "Withdraw" },
      { label: "Diajukan", value: createdAtLabel },
    ],
  });

  const partnerHtml = renderPartnerNotificationEmail({
    title: "Permintaan withdraw kamu kami terima",
    greeting: `Halo ${escapeHtml(partnerName)},`,
    body: [
      "Kami sudah menerima permintaan withdraw kamu. Berikut ringkasan pengajuannya:",
    ],
    details: [
      { label: "ID Withdraw", value: escapeHtml(`#${withdrawId}`) },
      { label: "Nominal", value: escapeHtml(amountLabel) },
      { label: "Diajukan pada", value: escapeHtml(createdAtLabel) },
      { label: "Rekening tujuan", value: bankSummary },
    ],
    cta: {
      description: "Pantau status pencairan melalui dashboard kemitraan.",
      href: `${appUrl}/mitra/withdraw`,
      label: "Lihat riwayat withdraw",
    },
    meta: [
      { label: "Referensi", value: `#${withdrawId}` },
      { label: "Nominal", value: amountLabel },
    ],
  });

  try {
    await Promise.all([
      sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `[urusmerek] Withdraw baru dari ${partnerName}`,
        html: adminHtml,
      }),
      partnerEmail
        ? sendEmail({
            to: partnerEmail,
            subject: "[urusmerek] Permintaan withdraw kamu kami terima",
            html: partnerHtml,
          })
        : Promise.resolve({ ok: true }),
    ]);
  } catch (error) {
    console.error("[notifications] Failed to send withdraw request email", error);
  }
}

export async function notifyWithdrawStatusChange({
  withdrawId,
  amount,
  partnerName,
  partnerEmail,
  bank,
  previousStatus,
  currentStatus,
  notes,
  updatedAt,
  processedBy,
}: WithdrawStatusChangeNotificationInput) {
  const amountLabel = currencyFormatter.format(amount);
  const previousLabel =
    withdrawStatusLabels[previousStatus] ?? previousStatus;
  const currentLabel =
    withdrawStatusLabels[currentStatus] ?? currentStatus;
  const updatedAtLabel = dateTimeFormatter.format(new Date(updatedAt));
  const accountName = bank.accountName ?? "-";
  const accountNumber = formatAccountNumber(
    typeof bank.accountNumber === "string"
      ? bank.accountNumber
      : ""
  );
  const bankName = bank.bankName ?? "-";
  const bankCode = bank.bankCode ? bank.bankCode.toUpperCase() : "-";

  const bankSummary = `${escapeHtml(bankName)} (${escapeHtml(bankCode)})<br/>a.n ${escapeHtml(
    accountName
  )}<br/>${escapeHtml(accountNumber)}`;
  const notesValue = notes
    ? escapeHtml(notes).replace(/\r?\n/g, "<br/>")
    : null;

  const partnerHtml = renderPartnerNotificationEmail({
    title: "Status withdraw kamu diperbarui",
    greeting: `Halo ${escapeHtml(partnerName)},`,
    body: [
      `Status permintaan withdraw <strong>#${withdrawId}</strong> berubah dari <strong>${escapeHtml(
        previousLabel
      )}</strong> menjadi <strong>${escapeHtml(currentLabel)}</strong>.`,
      "Berikut pembaruan lengkapnya:",
    ],
    details: [
      { label: "Nominal", value: escapeHtml(amountLabel) },
      { label: "Rekening tujuan", value: bankSummary },
      ...(notesValue
        ? [
            {
              label: "Catatan dari admin",
              value: notesValue,
            },
          ]
        : []),
      { label: "Diperbarui pada", value: escapeHtml(updatedAtLabel) },
    ],
    cta: {
      description:
        "Lihat detail lengkap di dashboard kemitraan dan pantau progres pencairan.",
      href: `${appUrl}/mitra/withdraw`,
      label: "Buka riwayat withdraw",
    },
    meta: [
      { label: "Referensi", value: `#${withdrawId}` },
      { label: "Status", value: currentLabel },
    ],
  });

  const adminHtml = renderAdminNotificationEmail({
    title: "Pembaruan status withdraw mitra",
    greeting: "Halo tim admin,",
    body: [
      `Status withdraw <strong>#${withdrawId}</strong> milik <strong>${escapeHtml(
        partnerName
      )}</strong> diperbarui oleh Admin #${processedBy}.`,
      "Detail terbaru tersaji di bawah ini:",
    ],
    details: [
      { label: "Status sebelum", value: escapeHtml(previousLabel) },
      { label: "Status sekarang", value: escapeHtml(currentLabel) },
      { label: "Nominal", value: escapeHtml(amountLabel) },
      {
        label: "Mitra",
        value: `${escapeHtml(partnerName)} &lt;${escapeHtml(partnerEmail)}&gt;`,
      },
      { label: "Rekening tujuan", value: bankSummary },
      ...(notesValue
        ? [
            {
              label: "Catatan admin",
              value: notesValue,
            },
          ]
        : []),
      { label: "Diperbarui pada", value: escapeHtml(updatedAtLabel) },
    ],
    cta: {
      description: "Kelola tindak lanjutnya melalui dashboard admin.",
      href: `${appUrl}/admin/withdraw/${withdrawId}`,
      label: "Kelola withdraw",
    },
    meta: [
      { label: "ID Withdraw", value: `#${withdrawId}` },
      { label: "Status", value: currentLabel },
    ],
  });

  try {
    await Promise.all([
      partnerEmail
        ? sendEmail({
            to: partnerEmail,
            subject: `[urusmerek] Status withdraw #${withdrawId} sekarang ${currentLabel}`,
            html: partnerHtml,
          })
        : Promise.resolve({ ok: true }),
      sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `[urusmerek] Withdraw #${withdrawId} diperbarui`,
        html: adminHtml,
      }),
    ]);
  } catch (error) {
    console.error(
      "[notifications] Failed to send withdraw status email",
      error
    );
  }
}

export async function notifyReferralStatusChange({
  referralId,
  partnerName,
  partnerEmail,
  linkCode,
  orderId,
  amount,
  commission,
  previousStatus,
  currentStatus,
  updatedAt,
}: ReferralStatusChangeNotificationInput) {
  if (!partnerEmail) {
    return;
  }

  const amountLabel = currencyFormatter.format(amount);
  const commissionLabel = currencyFormatter.format(commission);
  const previousLabel =
    referralStatusLabels[previousStatus] ?? previousStatus;
  const currentLabel =
    referralStatusLabels[currentStatus] ?? currentStatus;
  const updatedAtLabel = dateTimeFormatter.format(new Date(updatedAt));

  const partnerHtml = renderPartnerNotificationEmail({
    title: "Status komisi mitra diperbarui",
    greeting: `Halo ${escapeHtml(partnerName)},`,
    body: [
      `Status komisi untuk referral <strong>#${referralId}</strong> berubah dari <strong>${escapeHtml(
        previousLabel
      )}</strong> menjadi <strong>${escapeHtml(currentLabel)}</strong>.`,
      "Detail pembaruannya dapat kamu tinjau di bawah ini:",
    ],
    details: [
      { label: "ID Order / Referensi", value: escapeHtml(orderId || "-") },
      { label: "Kode link", value: escapeHtml(`#${linkCode}`) },
      { label: "Nominal transaksi", value: escapeHtml(amountLabel) },
      { label: "Komisi", value: escapeHtml(commissionLabel) },
      { label: "Diperbarui pada", value: escapeHtml(updatedAtLabel) },
    ],
    cta: {
      description:
        "Pantau performa komisi kamu di dashboard kemitraan.",
      href: `${appUrl}/mitra/affiliates#referrals`,
      label: "Buka dashboard mitra",
    },
    meta: [
      { label: "Referensi", value: `#${referralId}` },
      { label: "Status", value: currentLabel },
    ],
  });

  try {
    await sendEmail({
      to: partnerEmail,
      subject: `[urusmerek] Status komisi #${referralId} sekarang ${currentLabel}`,
      html: partnerHtml,
    });
  } catch (error) {
    console.error(
      "[notifications] Failed to send referral status email",
      error
    );
  }
}
