import type { Metadata } from "next";

const INDONESIAN_DESCRIPTION =
  "Urus Merek adalah platform digital untuk penelusuran dan perlindungan merek usaha. Kami menyediakan fitur cek merek real-time berbasis AI, pencarian kelas barang/jasa, serta monitoring status merek dengan notifikasi otomatis. Tujuan kami adalah memastikan pendaftaran merek Anda berjalan lancar sehingga merek usaha Anda terlindungi.";

const ENGLISH_DESCRIPTION =
  "Urus Merek is a digital platform for trademark search and brand protection. We provide real-time AI-powered trademark checks, class search across goods and service categories, and status monitoring with automatic notifications. Our goal is to ensure your trademark registration proceeds smoothly so your brand is protected.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Urus Merek",
  url: "https://www.urusmerek.id/tentang-kami",
  logo: "https://www.urusmerek.id/logo.png",
  foundingDate: "2021",
  founder: [{ "@type": "Person", name: "Nama Founder" }],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@urusmerek.id",
    telephone: "+62-21-1234567",
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
      name: "Tentang Kami",
      item: "https://www.urusmerek.id/tentang-kami",
    },
  ],
};

export const metadata: Metadata = {
  title: "Tentang Urus Merek | Konsultan Pendaftaran Merek",
  description:
    "Kenali tim konsultan dan teknologi Urus Merek yang membantu ribuan bisnis melindungi merek dagang.",
  keywords: [
    "tentang urus merek",
    "profil konsultan merek",
    "perusahaan jasa pendaftaran merek",
    "tim konsultan merek berlisensi",
    "layanan hki indonesia",
  ],
  alternates: {
    canonical: "https://www.urusmerek.id/tentang-kami",
  },
  openGraph: {
    title: "Tentang Urus Merek",
    description:
      "Pelajari misi, tim, dan teknologi yang mendampingi pendaftaran merek Anda.",
    url: "https://www.urusmerek.id/tentang-kami",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Tentang Urus Merek",
    description:
      "Platform layanan pendaftaran merek terpercaya di Indonesia.",
  },
};

const COMPANY_PROFILE = [
  {
    stat: "1.200+",
    title: "Pelaku usaha terbantu",
    description:
      "Kami mendampingi UMKM hingga korporasi dalam proses penelusuran dan pendaftaran merek di seluruh Indonesia.",
  },
  {
    stat: "24/7",
    title: "Monitoring status merek",
    description:
      "Sistem pemantauan otomatis kami membantu mendeteksi perubahan status merek dan mengirim peringatan lebih cepat.",
  },
  {
    stat: "98%",
    title: "Rasio keberhasilan registrasi",
    description:
      "Kombinasi konsultan berlisensi dan otomasi dokumen memastikan administrasi rapi dan mengikuti regulasi DJKI.",
  },
];

const MISSIONS = [
  {
    title: "Melindungi hak merek pelaku usaha",
    description:
      "Memberikan akses konsultasi terkurasi agar setiap pelaku usaha mengenali kelas dan strategi perlindungan merek sejak awal.",
  },
  {
    title: "Memodernkan proses HKI",
    description:
      "Mengurangi waktu tunggu lewat otomatisasi dokumen dan pelacakan realtime yang transparan bagi klien.",
  },
  {
    title: "Mengedukasi ekosistem bisnis",
    description:
      "Menyediakan konten edukatif dan webinar rutin supaya pemilik brand memahami lanskap hukum merek di Indonesia.",
  },
];

const CEO_PROFILE = {
  name: "Nama CEO Urus Merek",
  role: "Founder & CEO",
  message:
    "Kami percaya setiap pelaku usaha berhak atas perlindungan merek yang mudah dan transparan. Tim kami terus meningkatkan teknologi agar proses ini semakin nyaman.",
  frontLabel: "Kartu Nama - Sisi Depan",
  backLabel: "Kartu Nama - Sisi Belakang",
};

export default function TentangKamiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <section className="relative overflow-hidden bg-[#130404] py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7f1d1d] via-[#2f0c0c] to-[#0b0303]" />
        <div className="absolute inset-y-0 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(220,38,38,0.22)] blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 lg:flex-row lg:items-center lg:px-10">
          <header className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
              Tentang Urus Merek
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Pendamping digital untuk registrasi dan perlindungan merek yang lancar
            </h1>
            <p className="text-lg text-white/80">
              Kami menggabungkan keahlian konsultan HKI berlisensi dengan otomasi yang akurat, sehingga brand Anda bisa fokus bertumbuh tanpa khawatir sengketa merek.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-white/70">
              <div className="rounded-full border border-white/15 px-4 py-1 backdrop-blur">
                Konsultan HKI berlisensi
              </div>
              <div className="rounded-full border border-white/15 px-4 py-1 backdrop-blur">
                Penelusuran AI realtime
              </div>
              <div className="rounded-full border border-white/15 px-4 py-1 backdrop-blur">
                Monitoring status otomatis
              </div>
            </div>
          </header>
          <div className="grid w-full max-w-xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_42px_-18px_rgba(220,38,38,0.6)] backdrop-blur lg:max-w-lg">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                Bahasa Indonesia
              </p>
              <p className="text-base leading-relaxed text-white/80">
                {INDONESIAN_DESCRIPTION}
              </p>
            </div>
            <div className="h-px bg-white/10" />
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                English
              </p>
              <p className="text-base leading-relaxed text-white/75">
                {ENGLISH_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="apa-itu-urusmerek"
        className="relative border-y border-border/40 bg-background py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Apa itu UrusMerek.id?
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              UrusMerek.id adalah solusi end-to-end untuk penelusuran, pengajuan, dan monitoring merek dagang di Indonesia. Platform ini dirancang untuk memangkas proses manual yang rumit sekaligus memberikan transparansi penuh kepada pemilik brand.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm transition hover:-translate-y-1 hover:border-[rgba(220,38,38,0.6)] hover:shadow-lg">
                <h3 className="text-lg font-semibold text-foreground">
                  Penelusuran Pintar
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Engine pencarian kami membandingkan data DJKI dan database internasional untuk meminimalkan risiko penolakan.
                </p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm transition hover:-translate-y-1 hover:border-[rgba(220,38,38,0.6)] hover:shadow-lg">
                <h3 className="text-lg font-semibold text-foreground">
                  Pendampingan Konsultan
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tiap proses dipandu konsultan berlisensi yang menyiapkan dokumen, memantau status, dan memberi rekomendasi strategis.
                </p>
              </div>
            </div>
          </div>
          <aside className="grid gap-6 rounded-3xl border border-border/40 bg-muted/10 p-8 shadow-inner">
            <h3 className="text-lg font-semibold tracking-wide text-foreground/90">
              Kenapa bisnis mempercayai kami
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                Integrasi langsung ke dashboard DJKI untuk pemantauan status terbaru.
              </li>
              <li>
                Automasi penyusunan dokumen legal sehingga pengajuan lebih rapi dan cepat.
              </li>
              <li>
                Transparansi biaya dan laporan berkala yang dapat diakses tim internal Anda.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section
        id="profil-perusahaan"
        className="bg-[#fef2f2] py-24 dark:bg-[#160606]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:px-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Profil Perusahaan UrusMerek.id
            </h2>
            <p className="text-base text-muted-foreground">
              Kami tumbuh bersama ekosistem bisnis di Indonesia lewat layanan perlindungan merek yang dapat diskalakan, terukur, dan responsif terhadap kebutuhan regulasi terbaru.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANY_PROFILE.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-white/90 p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[rgba(220,38,38,0.65)] hover:shadow-2xl dark:bg-[rgba(28,11,11,0.7)]"
              >
                <div className="absolute -top-20 -right-28 h-48 w-48 rounded-full bg-[rgba(220,38,38,0.22)] opacity-0 blur-3xl transition group-hover:opacity-100" />
                <p className="text-4xl font-semibold text-red-600 dark:text-red-400">
                  {item.stat}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="misi" className="relative py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Misi UrusMerek.id
            </h2>
            <p className="text-base text-muted-foreground">
              Fokus kami sederhana: memastikan hak merek Anda aman sejak tahap penelusuran sampai pasca-sertifikat.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {MISSIONS.map((mission) => (
              <article
                key={mission.title}
                className="rounded-3xl border border-border/40 bg-gradient-to-b from-white to-[#fee2e2] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[rgba(220,38,38,0.6)] hover:shadow-xl dark:from-[#1a0808] dark:to-[#0f0404]"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {mission.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {mission.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="perkenalan-ceo"
        className="relative overflow-hidden border-t border-border/40 bg-[#140303] py-24 text-white"
      >
        <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.32),transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-center lg:px-10">
          <div className="space-y-6 lg:w-1/2">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Bertemu dengan CEO kami
            </h2>
            <p className="text-base leading-relaxed text-white/75">
              Kepemimpinan UrusMerek.id berfokus pada inovasi produk HKI digital dan keberlanjutan layanan. Tim kami bekerja lintas disiplin untuk menghadirkan perlindungan merek yang terasa personal namun tetap efisien.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 shadow-[0_0_45px_-18px_rgba(220,38,38,0.58)]">
              {CEO_PROFILE.message}
            </div>
          </div>
          <div className="flex justify-center lg:w-1/2">
            <div className="group relative h-[420px] w-full max-w-sm perspective-[1400px]">
              <div className="relative h-full w-full rounded-[32px] border border-white/15 bg-gradient-to-br from-[rgba(220,38,38,0.35)] via-[rgba(124,29,29,0.28)] to-[#170707] p-[2px] shadow-[0_25px_60px_-25px_rgba(220,38,38,0.78)] transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-reduce:duration-0 motion-reduce:[transform-style:flat] motion-reduce:hover:transform-none group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 rounded-[30px] bg-[#140303]" />
                <div className="relative flex h-full w-full flex-col justify-between rounded-[30px] bg-gradient-to-br from-[#280e0e] via-[#1a0505] to-[#280e0e] p-8 [backface-visibility:hidden]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                      {CEO_PROFILE.frontLabel}
                    </p>
                    <p className="mt-6 text-3xl font-semibold text-white">
                      {CEO_PROFILE.name}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      {CEO_PROFILE.role}
                    </p>
                  </div>
                  <div className="flex items-end justify-between text-white/60">
                    <span className="text-xs uppercase tracking-[0.4em]">
                      UrusMerek.id
                    </span>
                    <span className="text-xs font-semibold">
                      HKI Trusted Partner
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-[30px] bg-gradient-to-br from-[rgba(220,38,38,0.75)] via-[rgba(185,28,28,0.55)] to-[#1a0505] p-8 text-white/80 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                      {CEO_PROFILE.backLabel}
                    </p>
                    <span className="rounded-full border border-white/30 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/60">
                      Kontak
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-white/70">
                    <p>Email: hello@urusmerek.id</p>
                    <p>Telepon: +62-21-1234567</p>
                    <p>Alamat: Jakarta, Indonesia</p>
                  </div>
                  <div className="text-xs uppercase tracking-[0.4em] text-white/60">
                    Siap diskusi strategis merek Anda
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
