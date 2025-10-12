"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldQuestion,
  Workflow,
  Wallet2,
  Users2,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";

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
  accent: string;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    id: "pendaftaran",
    title: "Kategori 1 - Pendaftaran Merek",
    summary:
      "Kenali dasar-dasar layanan pendaftaran merek resmi di urusmerek.id.",
    icon: ShieldQuestion,
    accent: "from-rose-100/70 via-red-50/60 to-transparent",
    items: [
      {
        value: "pendaftaran-1",
        question: "Apa itu urusmerek.id?",
        answer: (
          <p>
            urusmerek.id adalah biro jasa kekayaan intelektual berbasis
            teknologi yang membantu pemilik bisnis di Indonesia untuk
            mendaftarkan, memperpanjang, dan melindungi merek mereka. Semua
            proses dilakukan secara resmi melalui DJKI Kemenkumham dan
            didampingi oleh Ahli Merek berpengalaman.
          </p>
        ),
      },
      {
        value: "pendaftaran-2",
        question:
          "Apakah pendaftaran melalui urusmerek.id resmi tercatat di Kemenkumham?",
        answer: (
          <p>
            Tentu saja. urusmerek.id mengajukan permohonan Anda langsung ke DJKI
            Kemenkumham setelah semua dokumen lengkap. Bukti resmi permohonan
            dikirimkan pada hari yang sama sehingga Anda dapat memantau setiap
            langkahnya.
          </p>
        ),
      },
      {
        value: "pendaftaran-3",
        question:
          "Berapa biaya jasa pendaftaran merek di urusmerek.id dan apa saja yang termasuk?",
        answer: (
          <div className="space-y-3">
            <p>
              Biaya jasa pendaftaran merek adalah Rp4.500.000, sudah meliputi
              seluruh komponen penting berikut:
            </p>
            <ul className="grid gap-2 rounded-xl bg-muted/40 p-4 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <span>Biaya resmi PNBP dari Kemenkumham.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <span>Jasa pengurusan menyeluruh oleh tim ahli.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <span>Akses fitur premium pemantauan status permohonan.</span>
              </li>
            </ul>
            <p>
              Pendampingan berlanjut hingga merek Anda resmi terdaftar dan
              memperoleh sertifikat.
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
            Ya. Karena seluruh sistem berbasis digital, Anda dapat
            mendaftarkan merek dari mana saja tanpa perlu datang ke kantor.
            Cukup kirim data, tim kami mengurus seluruh proses hingga selesai.
          </p>
        ),
      },
      {
        value: "pendaftaran-5",
        question: "Apakah pengajuan merek bisa ditolak?",
        answer: (
          <p>
            Bisa, terutama bila tidak dilakukan analisis nama dan kelas merek
            terlebih dahulu. urusmerek.id menyediakan konsultasi pra-daftar
            gratis dan strategi Anti-Tolak dari Ahli Merek profesional untuk
            meningkatkan peluang merek Anda lolos.
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
    accent: "from-orange-100/60 via-amber-50/60 to-transparent",
    items: [
      {
        value: "layanan-proses-1",
        question: "Berapa lama proses pendaftaran merek berlangsung?",
        answer: (
          <p>
            Setelah dokumen lengkap, urusmerek.id memproses pengajuan dalam
            waktu satu hari kerja hingga bukti permohonan resmi terbit dari
            Kemenkumham. Tahapan pemeriksaan substantif selanjutnya mengikuti
            ketentuan DJKI.
          </p>
        ),
      },
      {
        value: "layanan-proses-2",
        question: "Apa saja layanan yang tersedia di urusmerek.id?",
        answer: (
          <div className="space-y-3">
            <p>Kami siap membantu berbagai kebutuhan perlindungan merek:</p>
            <ul className="grid gap-2 rounded-xl bg-muted/40 p-4 text-sm">
              {[
                "Pendaftaran Merek Baru",
                "Perpanjangan Merek",
                "Cetak Sertifikat Merek",
                "Perubahan Nama/Alamat Pemilik",
                "Pengalihan Hak Merek",
                "Tanggapan Usul Tolak & Surat Keberatan",
                "Perjanjian Lisensi Merek",
              ].map((service) => (
                <li key={service} className="flex items-start gap-2">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <span>{service}</span>
                </li>
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
            cetak sertifikat, hingga penyusunan dokumen hukum untuk lisensi
            maupun pengalihan hak merek.
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
            Anda menerima pembaruan berkala melalui email dan WhatsApp dari tim
            urusmerek.id, mulai dari pengajuan hingga sertifikat terbit. Semua
            status juga dipantau melalui dashboard internal kami.
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
    accent: "from-emerald-100/60 via-green-50/60 to-transparent",
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
            setiap pendaftaran merek. Promo musiman juga diumumkan secara
            berkala di halaman utama.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-3",
        question: "Bagaimana metode pembayarannya?",
        answer: (
          <p>
            Pembayaran dapat dilakukan melalui transfer bank, virtual account,
            atau e-wallet resmi urusmerek.id. Semua transaksi dicatat aman dan
            transparan.
          </p>
        ),
      },
      {
        value: "harga-pembayaran-4",
        question: "Apakah ada garansi uang kembali?",
        answer: (
          <p>
            Jika permohonan tidak dapat diproses karena alasan administratif,
            misalnya dokumen tidak memenuhi syarat DJKI, urusmerek.id
            menawarkan pengembalian sebagian biaya sesuai ketentuan layanan.
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
    accent: "from-purple-100/60 via-violet-50/60 to-transparent",
    items: [
      {
        value: "program-mitra-1",
        question: "Apa itu Program Mitra urusmerek.id?",
        answer: (
          <p>
            Program Mitra adalah program referral untuk individu atau komunitas
            yang merekomendasikan layanan urusmerek.id dan memperoleh komisi dari
            setiap transaksi yang berhasil.
          </p>
        ),
      },
      {
        value: "program-mitra-2",
        question: "Siapa yang bisa bergabung sebagai mitra?",
        answer: (
          <div className="space-y-3">
            <p>Program ini terbuka bagi berbagai profil profesional:</p>
            <ul className="grid gap-2 rounded-xl bg-muted/40 p-4 text-sm">
              {[
                "Pemilik usaha",
                "Konsultan atau praktisi hukum",
                "Agensi dan freelancer",
                "Komunitas bisnis yang mendukung anggotanya",
              ].map((profile) => (
                <li key={profile} className="flex items-start gap-2">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <span>{profile}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        value: "program-mitra-3",
        question: "Apa keuntungan menjadi mitra?",
        answer: (
          <div className="space-y-3">
            <p>Anda akan menikmati keuntungan berikut:</p>
            <ul className="grid gap-2 rounded-xl bg-muted/40 p-4 text-sm">
              {[
                "Komisi menarik dibayarkan setiap tanggal 20 untuk transaksi terverifikasi.",
                "Diskon Rp100.000 bagi klien yang direferensikan.",
                "Dukungan langsung dari Ahli Merek urusmerek.id.",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <span>{benefit}</span>
                </li>
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
    ],
  },
  {
    id: "legalitas-keamanan",
    title: "Kategori 5 - Legalitas & Keamanan",
    summary:
      "Pastikan perlindungan data dan kolaborasi resmi bersama tim ahli kami.",
    icon: ShieldCheck,
    accent: "from-sky-100/60 via-blue-50/60 to-transparent",
    items: [
      {
        value: "legalitas-keamanan-1",
        question: "Apakah data saya aman di urusmerek.id?",
        answer: (
          <p>
            Sangat aman. Kami menggunakan sistem terenkripsi untuk melindungi
            data dan dokumen hukum dari akses pihak ketiga yang tidak berwenang.
          </p>
        ),
      },
      {
        value: "legalitas-keamanan-2",
        question: "Siapa yang menangani dokumen saya?",
        answer: (
          <p>
            Semua proses ditangani oleh Ahli Merek terdaftar dengan pengalaman
            lebih dari 10 tahun di bidang kekayaan intelektual.
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
    ],
  },
];

const contactChannels = [
  {
    label: "WhatsApp",
    value: "62822 6789 0152",
    href: "https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0",
  },
  {
    label: "Email",
    value: "support@urusmerek.id",
    href: "mailto:support@urusmerek.id",
  },
  {
    label: "Jam Layanan",
    value: "Senin-Jumat, 09.00-17.00 WIB",
  },
];

const FaqSection = () => {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50 to-white py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,theme(colors.red.200/45),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,theme(colors.red.300/40),transparent_65%)] blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 text-center">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Badge className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[.25em] text-primary">
              FAQ urusmerek.id
            </Badge>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Yang Paling Sering Ditanyakan
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Semua yang perlu Anda ketahui seputar pendaftaran, perpanjangan,
            kemitraan, hingga keamanan data dalam satu tempat yang mudah
            dieksplorasi.
          </p>
        </div>

        <div className="grid gap-8">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-primary/5 backdrop-blur-xl"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.accent}`}
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-10 p-6 sm:p-8 lg:flex-row lg:gap-12 lg:p-12">
                  <div className="lg:max-w-xs">
                    <div className="flex items-center gap-3 text-primary">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-widest text-primary/70">
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                      {category.summary}
                    </p>
                  </div>

                  <div className="flex-1">
                    <Accordion
                      type="multiple"
                      className="divide-y divide-white/60 rounded-2xl border border-white/60 bg-white/70 shadow-inner shadow-primary/5"
                    >
                      {category.items.map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                          <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline sm:text-lg">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            <div className="space-y-3">{item.answer}</div>
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

        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur-xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_center,theme(colors.red.200/35),transparent_70%)]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-primary">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquareText className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/70">
                  Masih Butuh Bantuan?
                </p>
                <h4 className="text-2xl font-semibold text-foreground">
                  Terhubung langsung dengan Ahli Merek kami
                </h4>
              </div>
            </div>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 sm:text-base lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-6">
              {contactChannels.map((channel) => (
                <div key={channel.label} className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-primary/70">
                    {channel.label}
                  </p>
                  {channel.href ? (
                    <Link
                      href={channel.href}
                      className="font-semibold text-foreground transition hover:text-primary"
                    >
                      {channel.value}
                    </Link>
                  ) : (
                    <p className="font-semibold text-foreground">
                      {channel.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button
              asChild
              size="lg"
              className="w-full shrink-0 bg-primary text-primary-foreground hover:-translate-y-[1px] hover:bg-primary/90 lg:w-auto"
            >
              <Link href="/konsultasi">
                Konsultasi Gratis Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
