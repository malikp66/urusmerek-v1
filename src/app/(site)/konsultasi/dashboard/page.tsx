import type { Metadata } from "next";
import { redirect } from "next/navigation";

const PAGE_TITLE = "Dashboard Konsultasi Dipindahkan | Urus Merek";
const PAGE_DESCRIPTION =
  "Halaman dashboard konsultasi kini tersedia di Monitoring Merek. Anda akan dialihkan secara otomatis.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConsultationDashboardRedirectPage() {
  redirect("/monitoring-merek");
}
