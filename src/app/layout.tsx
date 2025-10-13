import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import MaintenanceGate from "@/components/maintenance/maintenance-gate";
import Providers from "@/components/Providers";
import { getLocaleFromRequest } from "@/lib/i18n/server";

const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.urusmerek.id"),
  title: {
    default: "Jasa Pengurusan Merek Cepat & Terpercaya | Urus Merek",
    template: "%s | Urus Merek",
  },
  description:
    "Daftarkan merek usaha dengan tim ahli Urus Merek. Cek merek, pilih kelas, dan ajukan ke DJKI lebih cepat.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Jasa Pengurusan Merek Dagang Terintegrasi",
    description:
      "Solusi cek merek, penyusunan dokumen, dan pendaftaran DJKI dalam satu platform.",
    url: "https://www.urusmerek.id/",
    siteName: "Urus Merek",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pengurusan Merek Cepat",
    description:
      "Platform terpadu untuk cek merek, pilih kelas, dan daftar ke DJKI.",
    images: ["https://www.urusmerek.id/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromRequest();
  if (isMaintenanceMode) {
    return (
      <html lang={locale}>
        <body className="antialiased bg-white">
          <MaintenanceGate />
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <body className="antialiased">
        <Providers initialLocale={locale}>
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
          <VisualEditsMessenger />
        </Providers>
      </body>
    </html>
  );
}
