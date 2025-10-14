"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ShieldQuestion,
  Workflow,
  Wallet2,
  Users2,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = {
  value: string;
  question: string;
  answer: ReactNode;
};

type FaqCategory = {
  id: string;
  title: string;
  summary: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: {
    gradient: string;
    icon: string;
  };
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    id: "pendaftaran",
    title: "Kategori 1 - Pendaftaran Merek",
    summary:
      "Kenali dasar-dasar layanan pendaftaran merek resmi di urusmerek.id.",
    icon: ShieldQuestion,
    accent: {
      gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
      icon: "bg-rose-100/70 text-rose-500",
    },
    items: [
      {
        value: "pendaftaran-1",
        question: "Apa itu urusmerek.id?",
        answer: (
          <p>
            urusmerek.id adalah biro jasa kekayaan intelektual berbasis
            teknologi yang membantu pemilik bisnis di Indonesia untuk
            mendaftarkan, memperpanjang, dan melindungi merek mereka.
            Seluruh proses dilakukan secara resmi melalui DJKI Kemenkumham
            dengan pendampingan Ahli Merek berpengalaman.
          </p>
        ),
      },
      {
        value: "pendaftaran-2",
        question:
          "Apakah pendaftaran melalui urusmerek.id resmi tercatat di Kemenkumham?",
        answer: (
          <p>
            Ya. Setelah dokumen lengkap, permohonan Anda diajukan langsung ke
            DJKI Kemenkumham. Bukti resmi permohonan dikirimkan pada hari yang
            sama sehingga Anda dapat memantau setiap tahapannya.
          </p>
        ),
      },
      {
        value: "pendaftaran-3",
        question:
          "Berapa biaya jasa pendaftaran merek di urusmerek.id dan apa saja yang termasuk?",
        answer: (
          <div className="space-y-4">
            <p>
              Biaya jasa pendaftaran merek adalah Rp4.500.000, dan telah
              mencakup komponen utama berikut:
            </p>
            <ul className="space-y-2 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm list-disc list-inside">
              <li>Biaya resmi PNBP dari Kemenkumham.</li>
              <li>Jasa pengurusan menyeluruh oleh tim ahli.</li>
              <li>Akses pemantauan status permohonan secara real time.</li>
            </ul>
            <p>
              Pendampingan tetap berlanjut hingga merek Anda resmi terdaftar
              dan sertifikat diterbitkan.
            </p>
          </div>
        ),
      },
      {
        value: "pendaftaran-4",
        question:
          "Apakah urusmerek.id melayani pelanggan dari seluruh Indonesia?",
        answer: (
          <p>
            Tentu. Seluruh proses dapat dilakukan secara digital. Anda cukup
            mengirim data dan dokumen yang diperlukan, tim kami mengurus
            pengajuan hingga selesai tanpa perlu bertatap muka.
          </p>
        ),
      },
      {
        value: "pendaftaran-5",
        question: "Apakah pengajuan merek bisa ditolak?",
        answer: (
          <p>
            Bisa, terutama bila tidak dilakukan analisis nama dan kelas merek
            secara tepat. urusmerek.id menyediakan konsultasi pra-daftar gratis
            dan strategi Anti-Tolak dari Ahli Merek profesional untuk
            meningkatkan peluang merek Anda lolos.
          </p>
        ),
      },
      {
        value: "pendaftaran-6",
        question: "Dokumen apa saja yang perlu dipersiapkan sebelum mendaftar?",
        answer: (
          <div className="space-y-3">
            <p>
              Untuk mempercepat proses, siapkan dokumen berikut dalam format
              digital:
            </p>
            <ul className="space-y-2 rounded-2xl border border-primary/10 bg-white/70 p-4 text-sm list-disc list-inside">
              <li>KTP/KITAS pemohon atau akta pendirian beserta NPWP badan.</li>
              <li>Logo dan nama merek versi final (format PNG/SVG).</li>
              <li>
                Daftar barang/jasa yang akan dilindungi sesuai kelas Nice
                Classification.
              </li>
              <li>Surat kuasa bila diwakilkan kepada konsultan kami.</li>
            </ul>
            <p>
              Tim kami akan membantu validasi dan menerjemahkan daftar barang
              agar sesuai standar DJKI.
            </p>
          </div>
        ),
      },
      {
        value: "pendaftaran-7",
        question:
          "Apakah bisa mendaftarkan lebih dari satu kelas merek sekaligus?",
        answer: (
          <p>
            Bisa. Anda dapat mengajukan beberapa kelas dalam satu kali proses.
            Tim kami akan menghitung estimasi biaya resmi per kelas dan
            memberikan rekomendasi strategi kelas prioritas agar investasi tetap
            efisien.
          </p>
        ),
      },
    ],
  },
  {
    id: "layanan-proses",
    title: "Kategori 2 - Layanan & Proses",
    summary:
      "Pelajari detail layanan serta alur pendampingan yang disediakan.",
    icon: Workflow,
    accent: {
      gradient: "from-amber-100/70 via-orange-50/60 to-transparent",
      icon: "bg-amber-100/70 text-amber-500",
    },
    items: [
      {
        value: "layanan-proses-1",
        question: "Berapa lama proses pendaftaran merek berlangsung?",
        answer: (
          <p>
            Setelah dokumen lengkap, kami memproses pengajuan dalam satu hari
            kerja hingga bukti permohonan resmi terbit dari Kemenkumham.
            Tahapan pemeriksaan substantif selanjutnya mengikuti ketentuan DJKI.
          </p>
        ),
      },
      {
        value: "layanan-proses-2",
        question: "Apa saja layanan yang tersedia di urusmerek.id?",
        answer: (
          <div className="space-y-3">
            <p>Kami siap membantu kebutuhan perlindungan merek berikut:</p>
            <ul className="space-y-2 rounded-2xl border border-amber-100/70 bg-white/70 p-4 text-sm list-disc list-inside">
              {[
                "Pendaftaran Merek Baru.",
                "Perpanjangan Merek dan pencetakan sertifikat.",
                "Perubahan nama atau alamat pemilik dan pengalihan hak.",
                "Pendampingan tanggapan usul tolak & penyusunan keberatan.",
                "Perjanjian lisensi dan penyusunan dokumen kemitraan.",
              ].map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        value: "layanan-proses-3",
        question: "Apakah urusmerek.id membantu setelah merek terdaftar?",
        answer: (
          <p>
            Ya. Kami menyediakan layanan pasca-pendaftaran seperti perpanjangan,
            pencetakan sertifikat, penyusunan lisensi, hingga konsultasi
            strategi pengembangan portofolio merek.
          </p>
        ),
      },
      {
        value: "layanan-proses-4",
        question: "Apakah ada layanan cepat (One Day Service)?",
        answer: (
          <p>
            Ada. Paket Starter menghadirkan layanan One Day Service, di mana
            permohonan diajukan ke DJKI pada hari yang sama setelah data
            diverifikasi dan disetujui.
          </p>
        ),
      },
      {
        value: "layanan-proses-5",
        question: "Bagaimana saya tahu status permohonan merek saya?",
        answer: (
          <p>
            Anda menerima pembaruan berkala melalui email dan WhatsApp mulai
            dari pengajuan hingga sertifikat terbit. Semua status juga kami
            pantau melalui dashboard internal sehingga respon cepat dapat
            diberikan bila ada instruksi dari DJKI.
          </p>
        ),
      },
      {
        value: "layanan-proses-6",
        question:
          "Apakah urusmerek.id melakukan pemeriksaan merek sebelum diajukan?",
        answer: (
          <p>
            Ya. Kami menjalankan audit nama dan pencarian kesamaan (clearance
            search) untuk menilai risiko penolakan. Hasil analisis dan rekomendasi
            kelas prioritas dibahas bersama Anda sebelum permohonan dikirim.
          </p>
        ),
      },
      {
        value: "layanan-proses-7",
        question: "Bisakah saya memantau progres melalui dashboard klien?",
        answer: (
          <p>
            Bisa. Anda memperoleh akses ke client portal urusmerek.id yang
            menampilkan status tiap permohonan, riwayat dokumen, dan catatan
            tindakan. Notifikasi otomatis dikirim bila ada perubahan penting.
          </p>
        ),
      },
    ],
  },
  {
    id: "harga-pembayaran",
    title: "Kategori 3 - Harga & Pembayaran",
    summary: "Detail biaya, promo, dan tata cara pembayaran layanan.",
    icon: Wallet2,
    accent: {
      gradient: "from-emerald-100/70 via-green-50/60 to-transparent",
      icon: "bg-emerald-100/70 text-emerald-600",
    },
    items: [
      {
        value: "harga-pembayaran-1",
        question: "Apakah biaya Rp4.500.000 sudah termasuk semua?",
        answer: (
          <p>
            Ya. Biaya tersebut mencakup PNBP resmi pemerintah, jasa pengurusan
            penuh, serta pendampingan oleh Ahli Merek hingga proses selesai tanpa
            biaya tersembunyi.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-2",
        question: "Apakah ada potongan harga atau promo?",
        answer: (
          <p>
            Ada. Mitra Program urusmerek.id memperoleh diskon Rp100.000 untuk
            setiap pendaftaran merek. Kami juga menghadirkan promo musiman yang
            diumumkan melalui website dan kanal komunikasi resmi.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-3",
        question: "Bagaimana metode pembayarannya?",
        answer: (
          <p>
            Pembayaran dapat dilakukan melalui transfer bank, virtual account,
            atau e-wallet resmi urusmerek.id. Semua transaksi tercatat secara
            transparan dan Anda menerima invoice elektronik.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-4",
        question: "Apakah ada garansi uang kembali?",
        answer: (
          <p>
            Jika permohonan tidak dapat diproses karena alasan administratif,
            seperti dokumen tidak memenuhi syarat DJKI, kami menawarkan
            pengembalian sebagian biaya sesuai ketentuan layanan.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-5",
        question: "Apakah tersedia opsi cicilan atau split payment?",
        answer: (
          <p>
            Ya. Untuk paket Corporate, Anda dapat memilih pembayaran bertahap:
            60% di muka saat dokumen dinyatakan lengkap dan 40% setelah bukti
            permohonan resmi terbit. Silakan hubungi tim kami untuk pengaturan
            jadwal pembayaran.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-6",
        question: "Bisakah saya meminta invoice perusahaan beserta NPWP?",
        answer: (
          <p>
            Bisa. Kami menerbitkan invoice atas nama perusahaan lengkap dengan
            NPWP, e-meterai, dan rincian biaya per kelas. Informasikan data
            perusahaan sejak awal agar invoice dapat kami siapkan sebelum
            pembayaran dilakukan.
          </p>
        ),
      },
    ],
  },
  {
    id: "program-mitra",
    title: "Kategori 4 - Program Mitra & Referral",
    summary:
      "Informasi kolaborasi bisnis dan keuntungan menjadi mitra urusmerek.id.",
    icon: Users2,
    accent: {
      gradient: "from-violet-100/70 via-purple-50/60 to-transparent",
      icon: "bg-violet-100/70 text-violet-600",
    },
    items: [
      {
        value: "program-mitra-1",
        question: "Apa itu Program Mitra urusmerek.id?",
        answer: (
          <p>
            Program Mitra adalah program kolaborasi dan referral bagi individu,
            komunitas, maupun organisasi yang merekomendasikan layanan
            urusmerek.id dan memperoleh komisi dari setiap transaksi yang
            berhasil.
          </p>
        ),
      },
      {
        value: "program-mitra-2",
        question: "Siapa yang bisa bergabung sebagai mitra?",
        answer: (
          <div className="space-y-3">
            <p>Program ini terbuka bagi berbagai profil profesional:</p>
            <ul className="space-y-2 rounded-2xl border border-violet-100/70 bg-white/70 p-4 text-sm list-disc list-inside">
              {[
                "Pemilik usaha yang ingin membantu jaringan bisnisnya.",
                "Konsultan atau praktisi hukum kekayaan intelektual.",
                "Agensi kreatif, digital marketer, dan freelancer.",
                "Komunitas bisnis dan inkubator kewirausahaan.",
              ].map((profile) => (
                <li key={profile}>{profile}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        value: "program-mitra-3",
        question: "Apa keuntungan utama menjadi mitra?",
        answer: (
          <div className="space-y-3">
            <p>Keuntungan yang kami siapkan antara lain:</p>
            <ul className="space-y-2 rounded-2xl border border-violet-100/70 bg-white/70 p-4 text-sm list-disc list-inside">
              {[
                "Komisi dibayarkan rutin setiap tanggal 20 untuk transaksi terverifikasi.",
                "Diskon Rp100.000 bagi klien yang direferensikan melalui kode mitra.",
                "Pendampingan langsung dari Ahli Merek urusmerek.id untuk setiap kasus.",
              ].map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        value: "program-mitra-4",
        question: "Bagaimana cara bergabung menjadi Mitra?",
        answer: (
          <p>
            Hubungi Ahli Merek kami melalui{" "}
            <Link
              href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+bergabung+sebagai+Mitra+urusmerek.id.&type=phone_number&app_absent=0"
              className="font-medium text-primary underline underline-offset-4"
            >
              tautan WhatsApp ini
            </Link>
            . Tim kami akan memandu proses registrasi hingga akun Mitra aktif.
          </p>
        ),
      },
      {
        value: "program-mitra-5",
        question: "Berapa besar komisi yang diterima oleh Mitra?",
        answer: (
          <p>
            Komisi standar adalah 12% dari nilai transaksi jasa pendaftaran
            merek. Untuk Mitra yang berhasil membawa lebih dari 10 transaksi
            dalam satu bulan kalender, komisi meningkat menjadi 15% untuk
            transaksi berikutnya di bulan yang sama.
          </p>
        ),
      },
      {
        value: "program-mitra-6",
        question: "Bagaimana mekanisme pencairan komisi Mitra?",
        answer: (
          <p>
            Komisi direkap otomatis dalam dashboard Mitra dan dibayarkan setiap
            tanggal 20 ke rekening yang didaftarkan. Status pembayaran dapat
            dipantau real time, lengkap dengan bukti transfer dan laporan PDF
            yang dapat diunduh.
          </p>
        ),
      },
      {
        value: "program-mitra-7",
        question: "Apakah tersedia materi promosi untuk mendukung Mitra?",
        answer: (
          <p>
            Kami menyediakan toolkit digital berisi deck presentasi, poster,
            konten media sosial, hingga skrip pitch. Semua materi diperbarui
            berkala sesuai kampanye terbaru dan dapat diakses langsung dari
            dashboard Mitra.
          </p>
        ),
      },
      {
        value: "program-mitra-8",
        question: "Apakah ada laporan performa dan kode referral khusus?",
        answer: (
          <p>
            Setiap Mitra memperoleh kode referral unik dan tautan pelacakan.
            Dashboard menampilkan jumlah lead, konversi, serta nilai komisi
            secara rinci sehingga Anda dapat mengukur performa kampanye.
          </p>
        ),
      },
    ],
  },
  {
    id: "legalitas-keamanan",
    title: "Kategori 5 - Legalitas & Keamanan",
    summary:
      "Pastikan perlindungan data dan kolaborasi resmi bersama tim ahli kami.",
    icon: ShieldCheck,
    accent: {
      gradient: "from-sky-100/70 via-blue-50/60 to-transparent",
      icon: "bg-sky-100/70 text-sky-600",
    },
    items: [
      {
        value: "legalitas-keamanan-1",
        question: "Apakah data saya aman di urusmerek.id?",
        answer: (
          <p>
            Sangat aman. Kami menggunakan sistem terenkripsi dan akses
            bertingkat untuk melindungi dokumen hukum serta data pemohon dari
            pihak yang tidak berwenang.
          </p>
        ),
      },
      {
        value: "legalitas-keamanan-2",
        question: "Siapa yang menangani dokumen saya?",
        answer: (
          <p>
            Semua proses ditangani oleh Ahli Merek terdaftar dengan pengalaman
            lebih dari 10 tahun di bidang kekayaan intelektual serta tim legal
            internal yang berlisensi.
          </p>
        ),
      },
      {
        value: "legalitas-keamanan-3",
        question: "Apakah urusmerek.id bekerja sama dengan Kemenkumham?",
        answer: (
          <p>
            Kami bukan lembaga pemerintah, tetapi seluruh pengajuan dilakukan
            secara resmi ke DJKI Kemenkumham sesuai prosedur yang berlaku.
          </p>
        ),
      },
      {
        value: "legalitas-keamanan-4",
        question: "Apakah saya memperoleh perjanjian kerahasiaan (NDA)?",
        answer: (
          <p>
            Ya. Kami menyiapkan NDA standar yang dapat ditandatangani secara
            digital sebelum Anda mengirimkan dokumen. NDA ini melindungi semua
            informasi bisnis dan strategis yang dibagikan selama proses.
          </p>
        ),
      },
      {
        value: "legalitas-keamanan-5",
        question: "Bagaimana urusmerek.id menyimpan arsip dokumen?",
        answer: (
          <p>
            Arsip dokumen disimpan di penyimpanan cloud terenkripsi dengan
            backup harian dan akses terbatas. Anda dapat meminta salinan kapan
            saja tanpa dikenakan biaya tambahan.
          </p>
        ),
      },
    ],
  },
];

const contactChannels: Array<{
  label: string;
  value: string;
  helper?: string;
  href?: string;
}> = [
  {
    label: "WhatsApp",
    value: "62822 6789 0152",
    helper: "Respon cepat < 5 menit pada jam kerja",
    href: "https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0",
  },
  {
    label: "Email",
    value: "yessikurniawan@urusmerek.id",
    helper: "Penanganan dokumen dan tindak lanjut resmi",
    href: "mailto:yessikurniawan@urusmerek.id",
  },
  // {
  //   label: "Kemitraan",
  //   value: "yessikurniawan@urusmerek.id",
  //   helper: "Pertanyaan khusus Program Mitra & referral",
  //   href: "mailto:yessikurniawan@urusmerek.id",
  // },
  {
    label: "Jam Layanan",
    value: "Senin–Jumat, 09.00-17.00 WIB",
    helper: "Reservasi di luar jam kerja akan kami balas keesokan harinya",
  },
];

type FaqSectionProps = {
  className?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  categories?: FaqCategory[];
  showContactCard?: boolean;
};

const FaqSection = ({
  className,
  eyebrow = "FAQ urusmerek.id",
  heading = "Yang Paling Sering Ditanyakan",
  description = "Semua yang perlu Anda ketahui seputar pendaftaran, perpanjangan, kemitraan, hingga keamanan data kami rangkum dalam satu tempat yang mudah dieksplorasi.",
  categories = faqCategories,
  showContactCard = true,
}: FaqSectionProps) => {
  return (
    <section
      id="faq"
      className={cn(
        "relative overflow-hidden py-24 sm:py-28",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/40 to-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-rose-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-rose-100/40 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 text-center">
          <span className="eyebrow text-xs font-semibold uppercase tracking-[0.4em] text-primary/70 sm:text-sm">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-10">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_22px_60px_-45px_rgba(225,29,72,0.65)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_40px_90px_-48px_rgba(225,29,72,0.55)]"
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100",
                    category.accent.gradient
                  )}
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-10 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-14 lg:p-12">
                  <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm shadow-primary/10 lg:max-w-sm">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                        category.accent.gradient
                      )}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-white/75" />
                    <div className="relative flex items-center gap-4">
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-105",
                          category.accent.icon
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/60">
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="relative mt-6 space-y-3">
                      <h3 className="text-2xl font-semibold text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground sm:text-base">
                        {category.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Accordion
                      type="multiple"
                      className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-inner shadow-primary/10"
                    >
                      {category.items.map((item) => (
                        <AccordionItem
                          key={item.value}
                          value={item.value}
                          className="group/accordion border-b border-white/60 last:border-b-0 transition-colors duration-300 data-[state=open]:border-primary/20"
                        >
                          <AccordionTrigger className="text-base p-6 font-semibold text-foreground transition-colors hover:no-underline data-[state=open]:text-primary sm:text-lg">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            <div className="space-y-3 px-6 [&_p]:text-muted-foreground [&_p]:leading-relaxed">
                              {item.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showContactCard ? (
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-xl shadow-primary/15 backdrop-blur-xl sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.18),transparent_55%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-6 lg:flex-1">
                <div className="flex items-start gap-4">
                  <span className="flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <MessageSquareText className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="eyebrow text-xs font-semibold uppercase tracking-[0.32em] text-primary/70 sm:text-sm">
                      Masih Butuh Bantuan?
                    </p>
                    <h4 className="mt-1 text-2xl font-semibold text-foreground">
                      Terhubung langsung dengan Ahli Merek kami
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Konsultasi cepat untuk menentukan strategi pendaftaran,
                      perpanjangan, atau program kemitraan yang paling sesuai.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:text-base">
                  {contactChannels.map((channel) => (
                    <div
                      key={channel.label}
                      className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">
                        {channel.label}
                      </p>
                      {channel.href ? (
                        <Link
                          href={channel.href}
                          className="mt-2 block font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {channel.value}
                        </Link>
                      ) : (
                        <p className="mt-2 font-semibold text-foreground">
                          {channel.value}
                        </p>
                      )}
                      {channel.helper ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {channel.helper}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full shrink-0 bg-primary text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 lg:w-auto"
              >
                <Link href="/konsultasi">Konsultasi Sekarang</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FaqSection;
export type { FaqCategory, FaqItem, FaqSectionProps };
