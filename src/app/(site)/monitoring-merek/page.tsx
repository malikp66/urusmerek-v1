import type { Metadata } from "next";

const INDONESIAN_SUMMARY =
  "Tools monitoring status merek untuk mitigasi risiko penolakan. Aktifkan notifikasi otomatis dan pantau perubahan status merek Anda.";

const ENGLISH_SUMMARY =
  "A trademark status monitoring tool that mitigates refusal risks with automatic notifications and real-time status tracking.";

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
  title: "Monitoring Status Merek Dagang Otomatis | Urus Merek",
  description:
    "Aktifkan notifikasi perubahan status merek dan pantau proses DJKI secara real-time.",
  keywords: [
    "monitoring merek dagang",
    "pantau status merek",
    "notifikasi status merek",
    "monitoring permohonan merek djki",
    "dashboard monitoring merek",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/monitoring-merek",
  },
  openGraph: {
    title: "Monitoring Status Merek Dagang Otomatis",
    description:
      "Dashboard pemantauan status merek plus notifikasi email & WhatsApp.",
    url: "https://www.urusmerek.id/monitoring-merek",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monitoring Merek Dagang Otomatis",
    description:
      "Lacak proses pendaftaran dan perpanjangan merek Anda secara menyeluruh.",
  },
};

export default function MonitoringMerekPage() {
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
      <section className="relative py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <header className="mb-12 max-w-3xl">
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Monitoring Merek</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {INDONESIAN_SUMMARY}
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Lindungi proses pendaftaran merek Anda dengan pemantauan status yang selalu siaga. Urus Merek menghubungkan data resmi DJKI dan menginformasikan perubahan status secara cepat sehingga Anda dapat mengambil tindakan sebelum tenggat terlewat.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Notifikasi otomatis dapat diatur untuk setiap tahap penting, mulai dari pemeriksaan formalitas hingga pengumuman substantif. Anda juga menerima ringkasan mingguan yang merangkum progres setiap permohonan.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
                <li>Dashboard progres yang menampilkan status terbaru, catatan konsultan, dan estimasi waktu tahap berikutnya.</li>
                <li>Peringatan dini apabila ditemukan sanggahan, kekurangan dokumen, atau potensi penolakan.</li>
                <li>Riwayat aktivitas lengkap untuk audit internal serta dokumentasi tindak lanjut.</li>
              </ul>
              <p className="text-base leading-relaxed text-muted-foreground">
                Dengan visibilitas penuh terhadap setiap langkah, tim Anda dapat menyiapkan respon yang tepat dan menjaga kelancaran perlindungan merek.
              </p>
            </article>

            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">English</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Safeguard your trademark applications with always-on monitoring. Urus Merek connects to official DJKI data and flags status changes instantly, giving you time to act before deadlines pass.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Configure automatic notifications for every critical milestone, from formality checks through substantive examination. Weekly summaries keep stakeholders aligned on the progress of each filing.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
                <li>A progress dashboard that highlights the latest status, consultant notes, and estimated timelines.</li>
                <li>Early warnings for oppositions, missing documents, or potential refusals.</li>
                <li>A complete activity history for internal audits and follow-up documentation.</li>
              </ul>
              <p className="text-base leading-relaxed text-muted-foreground">
                With end-to-end visibility, your team can respond quickly and keep every trademark asset protected.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
