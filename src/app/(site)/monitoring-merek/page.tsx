import type { Metadata } from "next";
import { cookies } from "next/headers";
import { BellRing, CheckCircle2, LineChart, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FaqSection from "@/components/sections/faq-section";
import { monitoringFaqContent } from "@/constants/faq-content";

import {
  CONSULTATION_TRACKING_COOKIE,
  extractValidConsultationIds,
} from "@/lib/consultation-tracking";
import { getConsultationsByIds } from "@/lib/services/public/consultations-dashboard";

import { MonitoringDashboardClient } from "./_components/monitoring-dashboard-client";

const INDONESIAN_SUMMARY =
  "Aktifkan notifikasi perubahan status merek dan pantau proses DJKI secara real-time tanpa perlu login tambahan.";

const ENGLISH_SUMMARY =
  "Automate DJKI status monitoring with instant alerts, consultant notes, and collaborative access for your trademark portfolio.";

const HERO_POINTS = [
  "Pantau permohonan & perpanjangan merek dalam satu tampilan terpadu.",
  "Notifikasi email dan WhatsApp setiap kali status DJKI berubah.",
  "Catatan konsultan, dokumen, dan prioritas tindak lanjut tersusun rapi.",
  "Berbagi akses dashboard dengan tim hukum atau bisnis tanpa akun tambahan.",
] as const;

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: BellRing,
    title: "Notifikasi Multi Kanal",
    description:
      "Email dan WhatsApp otomatis mengabarkan setiap perubahan status, sehingga tim selalu siap merespons.",
  },
  {
    icon: LineChart,
    title: "Timeline Terukur",
    description:
      "Visual progres menunjukkan tahap DJKI, estimasi durasi, serta bottleneck yang perlu diprioritaskan.",
  },
  {
    icon: ShieldCheck,
    title: "Mitigasi Risiko Dini",
    description:
      "Peringatan khusus membantu mendeteksi oposisi, kekurangan dokumen, atau potensi penolakan sejak dini.",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Ambil ID Monitoring",
    description:
      "Lengkapi form monitoring atau konsultasi Urus Merek untuk mendapatkan ID unik di email konfirmasi.",
  },
  {
    title: "Masukkan ke Dashboard",
    description:
      "Gunakan kombinasi email dan ID Monitoring untuk memuat data, lalu simpan di browser favorit Anda.",
  },
  {
    title: "Kawal Bersama Tim",
    description:
      "Bagikan tautan dashboard ke kolega, pantau catatan konsultan, dan tindak lanjuti setiap pembaruan secara terukur.",
  },
];


const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Monitoring Merek Urus Merek",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    priceCurrency: "IDR",
    price: "99000",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Beranda",
      item: "https://www.urusmerek.id/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Monitoring Merek",
      item: "https://www.urusmerek.id/monitoring-merek",
    },
  ],
};

export const metadata: Metadata = {
  title: "Dashboard Monitoring Status Merek | Urus Merek",
  description:
    "Pantau status permohonan merek, catatan konsultan, dan notifikasi otomatis dalam satu dashboard Monitoring Merek Urus Merek.",
  keywords: [
    "monitoring merek dagang",
    "dashboard status merek",
    "notifikasi status merek djki",
    "monitoring permohonan merek",
    "pantau perpanjangan merek",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/monitoring-merek",
  },
  openGraph: {
    title: "Monitoring Status Merek Terintegrasi",
    description:
      "Dashboard monitoring merek lengkap dengan notifikasi otomatis, catatan konsultan, dan akses kolaboratif.",
    url: "https://www.urusmerek.id/monitoring-merek",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monitoring Status Merek Urus Merek",
    description:
      "Lacak progres permohonan dan perpanjangan merek Anda secara menyeluruh dengan notifikasi multi kanal.",
  },
};

export default async function MonitoringMerekPage() {
  const cookieStore = cookies();
  const trackedCookie = cookieStore.get(CONSULTATION_TRACKING_COOKIE)?.value;
  const trackedIds = extractValidConsultationIds(trackedCookie);
  const dashboardData = await getConsultationsByIds(trackedIds);
  const hasTrackingCookie = Boolean(trackedCookie);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-white py-20">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 size-[480px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 size-[360px] translate-x-1/4 translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl" />
          </div>
          <div className="container relative z-[1] mx-auto px-6 lg:px-10">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/60 px-4 py-1 text-sm font-medium text-rose-600 backdrop-blur">
                Monitoring Status Merek
              </span>
              <h1 className="mt-6 text-4xl font-semibold text-slate-900 sm:text-5xl">
                Dashboard Monitoring Status Merek Urus Merek
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {INDONESIAN_SUMMARY}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {HERO_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white/70 px-4 py-3 text-sm leading-relaxed text-slate-700 backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 text-rose-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#monitoring-dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200/60 transition hover:bg-rose-700"
                >
                  Lihat dashboard langsung
                </a>
                <a
                  href="/konsultasi"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  Ajukan konsultasi
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold text-slate-900">
                Kenapa monitoring merek penting?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Perubahan status DJKI dapat muncul kapan saja. Dengan dashboard Monitoring Merek,
                Anda mendapatkan peringatan dini, histori lengkap, dan arahan konsultan untuk setiap
                aksi yang perlu diambil.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-100/60"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/60 bg-white py-16">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2">
              <article className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-900">Bahasa Indonesia</h2>
                <p className="text-base leading-relaxed text-slate-600">
                  Lindungi proses pendaftaran merek Anda dengan pemantauan status yang terhubung
                  langsung ke data resmi DJKI. Setiap perubahan penting muncul otomatis beserta
                  rekomendasi konsultan sehingga tim bisa bertindak sebelum tenggat terlewat.
                </p>
                <p className="text-base leading-relaxed text-slate-600">
                  Dashboard memperlihatkan tahap perjalanan permohonan, catatan tindak lanjut,
                  serta dokumen yang dibutuhkan. Anda juga dapat menjadwalkan ringkasan mingguan
                  agar seluruh pemangku kepentingan selalu mendapat update terbaru.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-slate-600">
                  <li>Progres setiap merek lengkap dengan status DJKI dan estimasi tahap berikutnya.</li>
                  <li>Peringatan dini saat ditemukan oposisi, kekurangan dokumen, atau potensi penolakan.</li>
                  <li>Riwayat aktivitas yang siap untuk audit internal maupun dokumentasi tindak lanjut.</li>
                </ul>
                <p className="text-base leading-relaxed text-slate-600">
                  Dengan visibilitas penuh terhadap setiap langkah, Anda bisa memastikan perlindungan
                  merek berjalan tanpa hambatan.
                </p>
              </article>

              <article className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-900">English</h2>
                <p className="text-base leading-relaxed text-slate-600">
                  Safeguard every trademark application with always-on monitoring that connects to
                  official DJKI data. Instant alerts highlight critical status updates so your team
                  can react before deadlines or risks escalate.
                </p>
                <p className="text-base leading-relaxed text-slate-600">
                  The dashboard provides a full journey timeline, consultant notes, and required
                  documentation. Weekly digests keep stakeholders aligned and ensure nothing slips
                  through the cracks.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-slate-600">
                  <li>A consolidated progress view with DJKI status, comments, and next milestones.</li>
                  <li>Early warnings for oppositions, missing requirements, or potential refusals.</li>
                  <li>An auditable history of every action, ready for internal reviews and reporting.</li>
                </ul>
                <p className="text-base leading-relaxed text-slate-600">
                  With end-to-end visibility, your brand team can collaborate seamlessly and keep
                  every trademark asset protected.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 lg:p-14">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold text-slate-900">
                  Tiga langkah memulai monitoring merek
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Ikuti alur singkat di bawah ini untuk mengaktifkan dashboard monitoring dan
                  membagikannya ke tim Anda.
                </p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/60"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-rose-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="monitoring-dashboard" className="mt-24">
        <MonitoringDashboardClient
          initialData={dashboardData}
          trackedIds={trackedIds}
          hasTrackingCookie={hasTrackingCookie}
        />
      </section>

      <FaqSection {...monitoringFaqContent} />
    </>
  );
}
