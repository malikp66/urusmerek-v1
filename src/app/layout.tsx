import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import MaintenanceGate from "@/components/maintenance/maintenance-gate";

const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export const metadata: Metadata = {
  title: "UrusMerek.id - Mitra Terpercaya untuk Perlindungan Merek",
  description:
    "Jasa pendaftaran, perpanjangan, dan perlindungan merek resmi di Indonesia.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isMaintenanceMode) {
    return (
      <html lang="en">
        <body className="antialiased bg-white">
          <MaintenanceGate />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="antialiased">
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
      </body>
    </html>
  );
}