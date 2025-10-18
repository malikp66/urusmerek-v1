import {
  BadgeCheck,
  BellRing,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  Flag,
  Handshake,
  Gavel,
  Globe2,
  Layers,
  Lightbulb,
  LineChart,
  Mail,
  NotebookPen,
  PieChart,
  Receipt,
  RefreshCcw,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Timer,
  Users2,
  Workflow,
  Wallet2
} from "lucide-react";

import type {
  FaqCategory,
  FaqItem,
  FaqSectionProps,
} from "@/components/sections/faq-section";

type FaqContent = Pick<
  FaqSectionProps,
  | "eyebrow"
  | "title"
  | "heading"
  | "description"
  | "cta"
  | "search"
  | "categories"
  | "showContactCard"
>;

const withKeywords = (
  items: Array<
    Omit<FaqItem, "keywords"> & { keywords?: FaqItem["keywords"] }
  >,
): FaqItem[] =>
  items.map((item) => ({
    ...item,
    keywords: item.keywords ?? [],
  }));

const serviceFaqSections: Record<string, FaqContent> = {
  "perpanjangan-merek": {
    eyebrow: "FAQ layanan perpanjangan",
    title: "Perpanjangan merek agar perlindungan tidak terputus",
    description:
      "Jangan menunggu masa berlaku habis. Berikut jawaban singkat tentang persiapan dokumen, biaya resmi, dan apa saja yang kami bantu setelah perpanjangan disetujui.",
    categories: [
      {
        id: "persiapan",
        title: "Persiapan dokumen",
        summary: "Periksa kembali kelengkapan sebelum mengajukan perpanjangan.",
        icon: ClipboardCheck,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "persiapan-1",
            question: "Kapan waktu ideal memulai perpanjangan?",
            answer: (
              <p>
                Kami sarankan memulai 12-6 bulan sebelum masa berlaku berakhir.
                Ini memberi ruang untuk melengkapi dokumen dan menghindari denda
                keterlambatan.
              </p>
            ),
            keywords: ["waktu ideal", "12 bulan", "denda"],
          },
          {
            value: "persiapan-2",
            question: "Dokumen apa yang wajib disiapkan?",
            answer: (
              <p>
                Sertifikat merek lama, KTP atau akta perusahaan terbaru, serta
                surat pernyataan penggunaan merek. Jika sertifikat hilang, kami
                bantu membuat berita acara kehilangan.
              </p>
            ),
            keywords: ["sertifikat lama", "surat pernyataan", "kehilangan"],
          },
          {
            value: "persiapan-3",
            question:
              "Apakah bisa memperbarui data pemilik sekaligus saat perpanjangan?",
            answer: (
              <p>
                Bisa. Kami akan menggabungkan proses perpanjangan dengan layanan
                perubahan data sehingga data baru tercatat pada sertifikat hasil
                perpanjangan.
              </p>
            ),
            keywords: ["perubahan data", "gabung layanan"],
          },
        ]),
      },
      {
        id: "biaya-timeline",
        title: "Biaya & timeline",
        summary:
          "Memahami komponen PNBP dan alur waktu perpanjangan resmi.",
        icon: Receipt,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "biaya-timeline-1",
            question: "Berapa biaya resmi perpanjangan merek?",
            answer: (
              <p>
                Tarif PNBP per kelas mengikuti Peraturan Pemerintah terbaru. Kami
                menambahkan jasa pengurusan dan opsi cetak sertifikat sehingga
                Anda menerima satu invoice terperinci.
              </p>
            ),
            keywords: ["pnbp", "biaya per kelas", "invoice"],
          },
          {
            value: "biaya-timeline-2",
            question: "Berapa lama proses perpanjangan hingga status aktif?",
            answer: (
              <p>
                Setelah dokumen lengkap, kami kirim permohonan dalam 2 hari kerja.
                DJKI biasanya menerbitkan keputusan dalam 1-2 bulan tergantung
                antrian. Progresnya bisa dipantau di dashboard.
              </p>
            ),
            keywords: ["durasi", "1-2 bulan", "dashboard"],
          },
          {
            value: "biaya-timeline-3",
            question: "Apakah ada opsi percepatan?",
            answer: (
              <p>
                Kami mengoptimalkan jadwal internal dan memastikan dokumen
                memenuhi ketentuan sehingga tidak ada koreksi ulang. Namun
                keputusan akhir tetap mengikuti SLA DJKI.
              </p>
            ),
            keywords: ["percepatan", "sla djki"],
          },
        ]),
      },
      {
        id: "pasca-perpanjangan",
        title: "Setelah perpanjangan disetujui",
        summary:
          "Langkah lanjutan agar perlindungan merek tetap terjaga.",
        icon: ShieldCheck,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "pasca-perpanjangan-1",
            question:
              "Apa bukti resmi yang saya terima setelah perpanjangan selesai?",
            answer: (
              <p>
                Anda akan menerima bukti rekam DJKI, sertifikat terbaru, dan
                ringkasan masa berlaku baru. Dokumen kami arsipkan dalam format
                digital dan fisik sesuai permintaan.
              </p>
            ),
            keywords: ["bukti rekam", "sertifikat baru", "arsip"],
          },
          {
            value: "pasca-perpanjangan-2",
            question:
              "Apakah data merek di database DJKI langsung diperbarui?",
            answer: (
              <p>
                Ya. Kami memantau hingga status berubah menjadi &quot;Diperpanjang&quot;
                dan mengirim tangkapan layar sebagai bukti. Jika ada keterlambatan
                pembaruan, tim kami melakukan follow-up.
              </p>
            ),
            keywords: ["database djki", "status diperpanjang"],
          },
          {
            value: "pasca-perpanjangan-3",
            question: "Apakah layanan monitoring termasuk setelah perpanjangan?",
            answer: (
              <p>
                Setiap paket perpanjangan mencakup monitoring 6 bulan untuk
                memastikan tidak ada sengketa yang muncul setelah pembaruan.
              </p>
            ),
            keywords: ["monitoring", "6 bulan"],
          },
        ]),
      },
    ],
  },
  "cetak-sertifikat-merek": {
    eyebrow: "FAQ cetak sertifikat",
    title: "Cetak sertifikat merek yang siap legalisir",
    description:
      "Proses validasi sertifikat digital hingga pencetakan dengan material premium agar siap dipresentasikan kepada investor maupun mitra bisnis.",
    categories: [
      {
        id: "validasi",
        title: "Validasi sertifikat",
        summary: "Memastikan file asli dari DJKI valid sebelum dicetak.",
        icon: FileCheck2,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "validasi-1",
            question: "Bagaimana kami memverifikasi sertifikat digital?",
            answer: (
              <p>
                Kami mengecek QR code dan tanda tangan elektronik resmi DJKI,
                serta memastikan nomor permohonan sesuai data Anda. Sertifikat
                hanya dicetak setelah verifikasi lulus.
              </p>
            ),
            keywords: ["verifikasi", "qr code", "tanda tangan elektronik"],
          },
          {
            value: "validasi-2",
            question:
              "Apakah bisa mencetak sertifikat untuk beberapa kelas sekaligus?",
            answer: (
              <p>
                Bisa. Kami menggabungkan sertifikat per kelas dalam satu paket
                pencetakan dan memberi penanda warna agar mudah dibedakan.
              </p>
            ),
            keywords: ["multi kelas", "penanda warna"],
          },
          {
            value: "validasi-3",
            question: "Bisakah kami mencetak ulang jika file asli kurang jelas?",
            answer: (
              <p>
                Kami melakukan enhancement kualitas sebelum cetak. Jika file asli
                kurang jelas, kami meminta re-issue dari DJKI atas nama Anda.
              </p>
            ),
            keywords: ["re-issue", "kualitas", "enhancement"],
          },
        ]),
      },
      {
        id: "opsi",
        title: "Opsi pencetakan",
        summary:
          "Pilih material dan finishing yang sesuai kebutuhan presentasi.",
        icon: FileText,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "opsi-1",
            question: "Material apa yang digunakan untuk cetak premium?",
            answer: (
              <p>
                Kami menggunakan kertas art carton 260gsm dengan laminasi doff
                dan finishing emboss pada elemen penting. Hologram keamanan
                tersedia sebagai opsi tambahan.
              </p>
            ),
            keywords: ["material", "laminasi doff", "hologram"],
          },
          {
            value: "opsi-2",
            question: "Berapa lama pengerjaan cetak setelah file valid?",
            answer: (
              <p>
                Proses standar membutuhkan 3 hari kerja termasuk quality control.
                Untuk kebutuhan mendesak, kami menyediakan opsi ekspres 1 hari.
              </p>
            ),
            keywords: ["3 hari", "ekspres", "quality control"],
          },
          {
            value: "opsi-3",
            question: "Apakah disediakan file digital versi siap presentasi?",
            answer: (
              <p>
                Ya. Selain cetak fisik, kami menyiapkan versi digital beresolusi
                tinggi dengan bingkai branding agar mudah dipresentasikan.
              </p>
            ),
            keywords: ["file digital", "presentasi", "branding"],
          },
        ]),
      },
      {
        id: "pengiriman",
        title: "Pengiriman & arsip",
        summary: "Menjaga sertifikat tetap aman sampai tiba di tangan Anda.",
        icon: Mail,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "pengiriman-1",
            question: "Bagaimana mekanisme pengiriman ke luar kota?",
            answer: (
              <p>
                Kami menggunakan pengiriman ekspedisi dengan asuransi dan
                packaging rigid box kedap air. Nomor resi dan estimasi tiba
                dibagikan otomatis.
              </p>
            ),
            keywords: ["pengiriman", "asuransi", "rigid box"],
          },
          {
            value: "pengiriman-2",
            question:
              "Apakah Urus Merek menyimpan salinan cadangan sertifikat?",
            answer: (
              <p>
                Ya. Softcopy terenkripsi disimpan di data center kami sehingga
                Anda dapat meminta salinan kapan saja saat dibutuhkan.
              </p>
            ),
            keywords: ["arsip", "softcopy", "cadangan"],
          },
          {
            value: "pengiriman-3",
            question: "Bagaimana jika sertifikat rusak saat pengiriman?",
            answer: (
              <p>
                Segera hubungi kami. Kami akan mengajukan klaim asuransi dan
                menjadwalkan pencetakan ulang tanpa biaya tambahan.
              </p>
            ),
            keywords: ["rusak", "klaim", "pencetakan ulang"],
          },
        ]),
      },
    ],
  },
  "perubahan-data-merek": {
    eyebrow: "FAQ perubahan data",
    title: "Ubah data merek tanpa menghentikan perlindungan",
    description:
      "Ketahui jenis data apa saja yang dapat diubah, dokumen pendukung yang perlu disiapkan, serta durasi pemrosesan di DJKI.",
    categories: [
      {
        id: "jenis",
        title: "Jenis perubahan",
        summary: "Variasi perubahan data yang dapat kami bantu proses.",
        icon: RefreshCcw,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "jenis-1",
            question: "Data apa saja yang bisa diubah di DJKI?",
            answer: (
              <p>
                Kami dapat memperbarui nama pemilik, alamat, bentuk badan hukum,
                dan detail korespondensi. Perubahan logo memerlukan proses
                pendaftaran baru.
              </p>
            ),
            keywords: ["nama pemilik", "alamat", "badan hukum"],
          },
          {
            value: "jenis-2",
            question: "Bisakah melakukan beberapa perubahan sekaligus?",
            answer: (
              <p>
                Bisa. Kami menggabungkan perubahan dalam satu permohonan jika
                regulasi memungkinkan, sehingga biaya dan waktu lebih efisien.
              </p>
            ),
            keywords: ["perubahan ganda", "gabungan", "efisiensi"],
          },
          {
            value: "jenis-3",
            question:
              "Apakah perubahan kepemilikan penuh termasuk layanan ini?",
            answer: (
              <p>
                Perubahan kepemilikan memerlukan proses pengalihan hak. Kami akan
                merekomendasikan paket yang tepat jika kebutuhan Anda sudah masuk
                kategori transfer kepemilikan.
              </p>
            ),
            keywords: ["kepemilikan", "pengalihan hak", "rekomendasi"],
          },
        ]),
      },
      {
        id: "dokumen",
        title: "Dokumen pendukung",
        summary:
          "Persyaratan administrasi untuk memastikan perubahan diterima.",
        icon: ClipboardList,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "dokumen-1",
            question: "Dokumen apa yang perlu disiapkan?",
            answer: (
              <p>
                Kami biasanya membutuhkan akta perubahan, NPWP terbaru, surat
                kuasa, dan bukti legalitas lain yang relevan. Semua dokumen akan
                kami cek kelengkapannya sebelum diajukan.
              </p>
            ),
            keywords: ["akta perubahan", "npwp", "surat kuasa"],
          },
          {
            value: "dokumen-2",
            question: "Apakah dokumen perlu diterjemahkan?",
            answer: (
              <p>
                Jika dokumen berbahasa asing, kami bekerja sama dengan penerjemah
                tersumpah untuk memastikan format sesuai standar DJKI.
              </p>
            ),
            keywords: ["terjemahan", "penerjemah tersumpah"],
          },
          {
            value: "dokumen-3",
            question:
              "Apakah saya perlu menyiapkan surat kuasa terpisah untuk setiap merek?",
            answer: (
              <p>
                Tidak. Satu surat kuasa dapat mencakup beberapa merek selama
                tercantum jelas di dokumen. Kami sediakan templatenya.
              </p>
            ),
            keywords: ["surat kuasa", "beberapa merek"],
          },
        ]),
      },
      {
        id: "proses",
        title: "Proses DJKI & hasil",
        summary: "Mengetahui durasi dan bukti resmi setelah data diperbarui.",
        icon: Workflow,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "proses-1",
            question: "Berapa lama DJKI memproses perubahan data?",
            answer: (
              <p>
                Rata-rata 3-6 minggu tergantung antrian. Kami memantau status dan
                melakukan follow-up jika melewati SLA tersebut.
              </p>
            ),
            keywords: ["3-6 minggu", "sla", "follow-up"],
          },
          {
            value: "proses-2",
            question: "Apakah merek tetap sah selama menunggu update?",
            answer: (
              <p>
                Ya. Status perlindungan tidak terputus karena perubahan hanya
                menyentuh data administratif.
              </p>
            ),
            keywords: ["status sah", "perlindungan"],
          },
          {
            value: "proses-3",
            question: "Apa bukti resmi setelah perubahan disetujui?",
            answer: (
              <p>
                Kami memberikan kutipan resmi DJKI yang memuat data terbaru dan
                menyimpannya dalam arsip digital Anda.
              </p>
            ),
            keywords: ["kutipan djki", "arsip digital"],
          },
        ]),
      },
    ],
  },
  "pengalihan-hak": {
    eyebrow: "FAQ pengalihan hak",
    title: "Alihkan kepemilikan merek dengan aman",
    description:
      "Transfer kepemilikan merek butuh koordinasi administrasi dan legal yang matang. Berikut hal-hal penting sebelum dan sesudah pengalihan hak dilakukan.",
    categories: [
      {
        id: "persiapan",
        title: "Persiapan transfer",
        summary:
          "Langkah awal memastikan pihak penerima siap menerima hak merek.",
        icon: Handshake,
        accent: {
          gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
          icon: "bg-rose-100/80 text-rose-500",
        },
        items: withKeywords([
          {
            value: "persiapan-1",
            question: "Kapan sebaiknya pengalihan hak dimulai?",
            answer: (
              <p>
                Mulailah sebelum ada transaksi bisnis besar atau lisensi akan
                berjalan. Kami membantu audit portofolio merek dan kesiapan
                dokumen kedua belah pihak.
              </p>
            ),
            keywords: ["waktu tepat", "audit portofolio"],
          },
          {
            value: "persiapan-2",
            question: "Apakah perlu memeriksa status merek penerima?",
            answer: (
              <p>
                Ya. Kami memastikan penerima memiliki legalitas lengkap dan tidak
                memiliki konflik merek yang sedang berjalan untuk menghindari
                penolakan DJKI.
              </p>
            ),
            keywords: ["legalitas penerima", "konflik"],
          },
          {
            value: "persiapan-3",
            question: "Bisakah mengalihkan sebagian kelas saja?",
            answer: (
              <p>
                Bisa. Kami menyiapkan perjanjian partial assignment sehingga
                kelas tertentu berpindah tanpa memengaruhi kelas lain.
              </p>
            ),
            keywords: ["partial assignment", "kelas tertentu"],
          },
        ]),
      },
      {
        id: "dokumen",
        title: "Dokumen legal",
        summary:
          "Perjanjian dan lampiran yang wajib ada dalam proses pengalihan.",
        icon: Gavel,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "dokumen-1",
            question:
              "Dokumen minimal apa yang harus ditandatangani kedua pihak?",
            answer: (
              <p>
                Perjanjian pengalihan (Assignment Agreement), surat kuasa, dan
                bukti transaksi. Kami menyediakan template yang disesuaikan dengan
                kebutuhan bisnis Anda.
              </p>
            ),
            keywords: ["assignment agreement", "bukti transaksi", "template"],
          },
          {
            value: "dokumen-2",
            question: "Apakah perlu legalisasi notaris?",
            answer: (
              <p>
                Kami merekomendasikan legalisasi notaris untuk transaksi bernilai
                besar atau lintas negara. Tim kami dapat mengoordinasikan jadwal
                legalisasi.
              </p>
            ),
            keywords: ["notaris", "legalisasi"],
          },
          {
            value: "dokumen-3",
            question: "Bagaimana dengan syarat pajak atas transaksi?",
            answer: (
              <p>
                Kami membantu mempersiapkan dokumentasi pajak (PPH, PPN) sesuai
                kesepakatan kontrak agar siap saat audit fiskal.
              </p>
            ),
            keywords: ["pajak", "pph", "ppn"],
          },
        ]),
      },
      {
        id: "hasil",
        title: "Setelah hak berpindah",
        summary:
          "Apa yang dilakukan setelah DJKI menyetujui pengalihan.",
        icon: ShieldCheck,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "hasil-1",
            question: "Apakah sertifikat baru akan diterbitkan?",
            answer: (
              <p>
                DJKI menerbitkan kutipan resmi yang mengakui pemilik baru. Kami
                juga dapat mencetak sertifikat versi terbaru bila dibutuhkan.
              </p>
            ),
            keywords: ["kutipan resmi", "sertifikat baru"],
          },
          {
            value: "hasil-2",
            question:
              "Bagaimana memastikan semua lisensi pihak ketiga diperbarui?",
            answer: (
              <p>
                Kami membantu mengkomunikasikan perubahan kepada pemegang lisensi
                dan menyiapkan addendum bila diperlukan agar perjanjian tetap
                berlaku.
              </p>
            ),
            keywords: ["lisensi", "addendum", "pemberitahuan"],
          },
          {
            value: "hasil-3",
            question:
              "Apakah Urus Merek memantau masa transisi setelah pengalihan?",
            answer: (
              <p>
                Ya. Masa transisi 90 hari kami pantau untuk memastikan tidak ada
                kendala proses internal maupun pembaruan data di DJKI.
              </p>
            ),
            keywords: ["masa transisi", "90 hari", "monitoring"],
          },
        ]),
      },
    ],
  },
  "usul-tolak-merek": {
    eyebrow: "FAQ tanggapan usul tolak",
    title: "Optimalkan peluang merek Anda lolos pemeriksaan substantif",
    description:
      "Ketahui cara kami menganalisis dasar penolakan, menyusun argumentasi, serta mengelola timeline DJKI agar tanggapan diajukan tepat waktu.",
    categories: [
      {
        id: "analisis",
        title: "Analisis kasus",
        summary:
          "Langkah pertama memahami alasan penolakan dari pemeriksa DJKI.",
        icon: FileSearch,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "analisis-1",
            question:
              "Apa saja dokumen yang kami telaah saat menerima usul tolak?",
            answer: (
              <p>
                Kami menelaah surat usul tolak, hasil penelusuran pemeriksa,
                serta portofolio penggunaan merek Anda. Data ini dikompilasi
                menjadi laporan analisis risiko.
              </p>
            ),
            keywords: ["surat usul tolak", "analisis risiko"],
          },
          {
            value: "analisis-2",
            question: "Berapa lama proses analisis awal dilakukan?",
            answer: (
              <p>
                Dalam 3 hari kerja kami mengirim ringkasan awal berisi opsi
                strategi dan dokumen tambahan yang perlu disiapkan.
              </p>
            ),
            keywords: ["3 hari", "ringkasan awal", "strategi"],
          },
          {
            value: "analisis-3",
            question: "Apakah kami menilai potensi rebranding sebagai opsi?",
            answer: (
              <p>
                Jika peluang mempertahankan merek kecil, kami memberikan
                rekomendasi rebranding parsial atau total sebagai skenario cadangan.
              </p>
            ),
            keywords: ["rebranding", "skenario cadangan"],
          },
        ]),
      },
      {
        id: "strategi",
        title: "Strategi tanggapan",
        summary: "Merancang argumen dan bukti pendukung yang kuat.",
        icon: Lightbulb,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "strategi-1",
            question: "Apa saja jenis bukti yang memperkuat tanggapan?",
            answer: (
              <p>
                Kami menyertakan bukti penggunaan merek, survei pasar, perbandingan
                visual/fonetik, serta referensi putusan sebelumnya jika relevan.
              </p>
            ),
            keywords: ["bukti penggunaan", "survei pasar", "putusan"],
          },
          {
            value: "strategi-2",
            question: "Bagaimana alur review draft tanggapan?",
            answer: (
              <p>
                Draft disusun konsultan, direview partner senior, lalu dibagikan
                ke Anda untuk komentar akhir. Revisi dapat dilakukan maksimal dua
                siklus sebelum diajukan.
              </p>
            ),
            keywords: ["draft", "review", "revisi"],
          },
          {
            value: "strategi-3",
            question: "Apakah kami dapat menyertakan ahli bahasa atau industri?",
            answer: (
              <p>
                Bisa. Kami bekerja sama dengan ahli eksternal untuk menambah
                bobot argumentasi ketika dibutuhkan.
              </p>
            ),
            keywords: ["ahli", "testimoni", "eksternal"],
          },
        ]),
      },
      {
        id: "tindak-lanjut",
        title: "Timeline & tindak lanjut",
        summary:
          "Menjaga tanggapan terkirim tepat waktu dan memantau hasilnya.",
        icon: Timer,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "tindak-lanjut-1",
            question: "Berapa batas waktu pengajuan tanggapan usul tolak?",
            answer: (
              <p>
                DJKI memberi waktu 30 hari sejak surat diterima. Kami menargetkan
                pengajuan maksimal di hari ke-21 agar ada cadangan waktu bila
                perlu revisi.
              </p>
            ),
            keywords: ["30 hari", "timeline", "hari ke-21"],
          },
          {
            value: "tindak-lanjut-2",
            question: "Bagaimana kami memantau status setelah tanggapan dikirim?",
            answer: (
              <p>
                Status diperbarui di dashboard dan kami mengirim ringkasan mingguan
                sampai keputusan keluar.
              </p>
            ),
            keywords: ["status", "ringkasan mingguan"],
          },
          {
            value: "tindak-lanjut-3",
            question: "Apa langkah jika tanggapan tidak diterima?",
            answer: (
              <p>
                Kami menyiapkan opsi lanjutan seperti banding atau pendaftaran
                ulang dengan strategi nama baru. Keputusan dibuat bersama Anda.
              </p>
            ),
            keywords: ["banding", "pendaftaran ulang"],
          },
        ]),
      },
    ],
  },
  "surat-keberatan-merek": {
    eyebrow: "FAQ surat keberatan",
    title: "Susun keberatan resmi terhadap merek yang mengganggu",
    description:
      "Waktu keberatan hanya 2 bulan sejak pengumuman. Pastikan dokumen lengkap, argumentasi tajam, dan bukti terstruktur.",
    categories: [
      {
        id: "dasar",
        title: "Dasar keberatan",
        summary:
          "Menilai apakah suatu permohonan patut diajukan keberatan.",
        icon: Flag,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "dasar-1",
            question: "Kapan keberatan sebaiknya diajukan?",
            answer: (
              <p>
                Saat merek yang diumumkan memiliki kemiripan signifikan dengan
                merek Anda dan berpotensi menimbulkan kebingungan konsumen.
              </p>
            ),
            keywords: ["kemiripan", "kebingungan", "dua bulan"],
          },
          {
            value: "dasar-2",
            question: "Apa indikator bahwa keberatan memiliki peluang tinggi?",
            answer: (
              <p>
                Terdapat persamaan visual/fonetik, kelas barang yang sama, dan
                bukti reputasi merek Anda. Kami melakukan scoring awal untuk
                menilai peluang.
              </p>
            ),
            keywords: ["indikator", "scoring", "reputasi"],
          },
          {
            value: "dasar-3",
            question: "Apakah keberatan bisa diajukan atas nama komunitas?",
            answer: (
              <p>
                Bisa, selama memiliki legal standing dan bukti bahwa merek
                tersebut merugikan anggota asosiasi. Kami bantu memastikan dokumen
                legalnya terpenuhi.
              </p>
            ),
            keywords: ["asosiasi", "legal standing"],
          },
        ]),
      },
      {
        id: "penyusunan",
        title: "Penyusunan argumentasi",
        summary:
          "Membangun argumen hukum dan bukti pendukung yang kuat.",
        icon: NotebookPen,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "penyusunan-1",
            question: "Bukti apa saja yang kami lampirkan?",
            answer: (
              <p>
                Bukti penggunaan, angka penjualan, materi promosi, testimoni,
                hingga riset pasar yang mendukung klaim reputasi merek Anda.
              </p>
            ),
            keywords: ["bukti penggunaan", "penjualan", "riset pasar"],
          },
          {
            value: "penyusunan-2",
            question: "Apakah argumentasi disesuaikan dengan dasar keberatan?",
            answer: (
              <p>
                Ya. Kami menyesuaikan dengan dasar keberatan (Pasal 20/21) dan
                menambahkan yurisprudensi terkait bila tersedia.
              </p>
            ),
            keywords: ["pasal 20", "pasal 21", "yurisprudensi"],
          },
          {
            value: "penyusunan-3",
            question: "Bagaimana proses review sebelum dokumen dikirim?",
            answer: (
              <p>
                Draft melewati review konsultan senior dan tim legal internal.
                Anda mendapatkan kesempatan memberikan masukan sebelum final.
              </p>
            ),
            keywords: ["review", "konsultan senior", "masukan"],
          },
        ]),
      },
      {
        id: "pasca",
        title: "Setelah keberatan diajukan",
        summary: "Memantau respon DJKI dan strategi lanjutan.",
        icon: BellRing,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "pasca-1",
            question: "Berapa lama DJKI merespons surat keberatan?",
            answer: (
              <p>
                Biasanya 2-4 bulan tergantung kompleksitas kasus. Kami memantau
                jadwal sidang jika ditetapkan.
              </p>
            ),
            keywords: ["2-4 bulan", "sidang"],
          },
          {
            value: "pasca-2",
            question: "Apa yang terjadi jika keberatan diterima?",
            answer: (
              <p>
                Permohonan lawan ditolak dan kami membantu menyusun strategi
                komunikasi agar merek Anda tetap kuat di pasaran.
              </p>
            ),
            keywords: ["diterima", "strategi komunikasi"],
          },
          {
            value: "pasca-3",
            question: "Bagaimana jika keberatan ditolak?",
            answer: (
              <p>
                Kami menilai opsi banding administratif atau langkah hukum lain
                sesuai urgensi bisnis Anda.
              </p>
            ),
            keywords: ["banding", "langkah hukum"],
          },
        ]),
      },
    ],
  },
  "perjanjian-lisensi-merek": {
    eyebrow: "FAQ perjanjian lisensi",
    title: "Kelola lisensi merek secara profesional",
    description:
      "Kami bantu menyusun kontrak lisensi yang jelas, mengatur wilayah penggunaan, serta mendesain mekanisme monitoring royalti.",
    categories: [
      {
        id: "perencanaan",
        title: "Perencanaan kemitraan",
        summary: "Menentukan model lisensi yang ideal untuk bisnis Anda.",
        icon: Handshake,
        accent: {
          gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
          icon: "bg-rose-100/80 text-rose-500",
        },
        items: withKeywords([
          {
            value: "perencanaan-1",
            question: "Apa yang harus dipertimbangkan sebelum membuka lisensi?",
            answer: (
              <p>
                Tentukan wilayah, durasi, standar kualitas, dan mekanisme kontrol.
                Kami membantu memetakan resiko serta kebutuhan pendampingan operasional.
              </p>
            ),
            keywords: ["wilayah", "standar kualitas", "resiko"],
          },
          {
            value: "perencanaan-2",
            question: "Bisakah lisensi eksklusif dan non-eksklusif digabung?",
            answer: (
              <p>
                Bisa. Anda dapat memberi eksklusivitas di wilayah tertentu dan
                non-eksklusif di wilayah lain. Kontrak kami desain modular.
              </p>
            ),
            keywords: ["eksklusif", "non eksklusif", "wilayah"],
          },
          {
            value: "perencanaan-3",
            question: "Apakah kami menyediakan pelatihan bagi penerima lisensi?",
            answer: (
              <p>
                Kami dapat mengatur program onboarding dan checklist operasional
                agar penerima lisensi memahami standar merek Anda.
              </p>
            ),
            keywords: ["onboarding", "checklist", "standar"],
          },
        ]),
      },
      {
        id: "struktur",
        title: "Struktur kontrak",
        summary: "Elemen utama yang harus ada dalam perjanjian lisensi.",
        icon: FileText,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "struktur-1",
            question: "Bagaimana menentukan skema royalti yang adil?",
            answer: (
              <p>
                Kami menyediakan beberapa model (flat fee, revenue share, hybrid)
                dan simulasi proyeksi sehingga Anda dapat memilih yang paling
                sesuai.
              </p>
            ),
            keywords: ["royalti", "flat fee", "revenue share"],
          },
          {
            value: "struktur-2",
            question: "Apakah kontrak mencakup standar kualitas produk?",
            answer: (
              <p>
                Ya. Kami menuliskan standar kualitas, hak audit, serta konsekuensi
                jika standar tidak dipenuhi.
              </p>
            ),
            keywords: ["standar kualitas", "audit", "konsekuensi"],
          },
          {
            value: "struktur-3",
            question: "Bagaimana jika terjadi pelanggaran atau sengketa?",
            answer: (
              <p>
                Klausul penyelesaian sengketa, pemutusan kontrak, dan denda kami
                siapkan agar perlindungan merek tetap kuat.
              </p>
            ),
            keywords: ["sengketa", "pemutusan", "denda"],
          },
        ]),
      },
      {
        id: "monitoring",
        title: "Monitoring pelaksanaan",
        summary: "Memastikan lisensi berjalan sesuai kesepakatan.",
        icon: LineChart,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "monitoring-1",
            question: "Apakah tersedia dashboard monitoring royalti?",
            answer: (
              <p>
                Kami menyediakan modul pelaporan royalti dengan integrasi Excel
                sehingga data penjualan penerima lisensi mudah diaudit.
              </p>
            ),
            keywords: ["dashboard", "royalti", "audit"],
          },
          {
            value: "monitoring-2",
            question: "Bagaimana mekanisme evaluasi berkala?",
            answer: (
              <p>
                Kami membantu menyusun jadwal evaluasi dan template laporan
                bulanan, termasuk checklist quality control.
              </p>
            ),
            keywords: ["evaluasi", "template", "quality control"],
          },
          {
            value: "monitoring-3",
            question: "Apakah Urus Merek membantu renegosiasi kontrak?",
            answer: (
              <p>
                Ya. Kami menyiapkan addendum dan strategi negosiasi ketika ada
                perubahan skema bisnis.
              </p>
            ),
            keywords: ["renegosiasi", "addendum"],
          },
        ]),
      },
    ],
  },
  "konsultasi-hki": {
    eyebrow: "FAQ konsultasi HKI strategis",
    title: "Jadikan sesi konsultasi HKI sebagai peta jalan bisnis",
    description:
      "Konsultasi HKI memberi pandangan menyeluruh atas kekayaan intelektual Anda. Kami merangkum ruang lingkup, output, dan tindak lanjut setelah sesi.",
    categories: [
      {
        id: "ruang-lingkup",
        title: "Ruang lingkup",
        summary: "Bahasan apa saja yang bisa masuk ke dalam konsultasi HKI.",
        icon: Sparkles,
        accent: {
          gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
          icon: "bg-sky-100/80 text-sky-500",
        },
        items: withKeywords([
          {
            value: "ruang-lingkup-1",
            question: "Topik apa saja yang dapat dibahas?",
            answer: (
              <p>
                Mulai dari audit portofolio merek, strategi ekspansi internasional,
                lisensi, hingga sengketa kekayaan intelektual.
              </p>
            ),
            keywords: ["audit", "ekspansi internasional", "sengketa"],
          },
          {
            value: "ruang-lingkup-2",
            question: "Apakah bisa melibatkan beberapa divisi perusahaan?",
            answer: (
              <p>
                Bisa. Kami menyesuaikan agenda agar relevan bagi tim legal,
                marketing, maupun manajemen.
              </p>
            ),
            keywords: ["multi divisi", "agenda"],
          },
          {
            value: "ruang-lingkup-3",
            question: "Berapa lama sesi berlangsung?",
            answer: (
              <p>
                Sesi standar 90 menit dengan opsi tambahan workshop setengah hari
                jika dibutuhkan.
              </p>
            ),
            keywords: ["90 menit", "workshop"],
          },
        ]),
      },
      {
        id: "output",
        title: "Deliverables",
        summary: "Output tertulis yang Anda terima setelah sesi selesai.",
        icon: ClipboardCheck,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "output-1",
            question: "Apa saja dokumen yang kami terima?",
            answer: (
              <p>
                Anda menerima executive summary, analisis risiko, timeline aksi,
                dan rekomendasi prioritas dalam format PDF.
              </p>
            ),
            keywords: ["executive summary", "timeline aksi"],
          },
          {
            value: "output-2",
            question: "Apakah ada template implementasi?",
            answer: (
              <p>
                Kami menyertakan checklist dan template dokumen yang bisa langsung
                dipakai tim Anda.
              </p>
            ),
            keywords: ["template", "checklist"],
          },
          {
            value: "output-3",
            question: "Berapa lama akses ke konsultan setelah sesi?",
            answer: (
              <p>
                Anda mendapatkan dukungan follow-up selama 30 hari via email atau
                call singkat untuk memastikan rekomendasi berjalan.
              </p>
            ),
            keywords: ["30 hari", "follow-up"],
          },
        ]),
      },
      {
        id: "implementasi",
        title: "Implementasi lanjutan",
        summary:
          "Cara melanjutkan rekomendasi ke eksekusi layanan Urus Merek.",
        icon: Workflow,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "implementasi-1",
            question: "Apakah kami membantu implementasi setelah konsultasi?",
            answer: (
              <p>
                Ya. Kami menyiapkan proposal eksekusi berdasarkan prioritas yang
                disepakati dan mengalokasikan tim khusus.
              </p>
            ),
            keywords: ["implementasi", "proposal", "tim khusus"],
          },
          {
            value: "implementasi-2",
            question: "Bagaimana jika memerlukan kolaborasi dengan mitra eksternal?",
            answer: (
              <p>
                Kami dapat merekomendasikan mitra terpercaya (misal kantor hukum
                internasional) dan bekerja secara koordinatif.
              </p>
            ),
            keywords: ["mitra eksternal", "koordinasi"],
          },
          {
            value: "implementasi-3",
            question: "Apakah ada laporan progres berkala?",
            answer: (
              <p>
                Semua aksi lanjutan tercatat di dashboard dengan milestone dan
                penanggung jawab yang jelas.
              </p>
            ),
            keywords: ["laporan progres", "dashboard"],
          },
        ]),
      },
    ],
  },
};

export const homepageFaqContent: FaqContent = {
  eyebrow: "FAQ urusmerek.id",
  title: "Lebih paham layanan Urus Merek sebelum mulai",
  description:
    "Rangkum semua pertanyaan yang paling sering kami terima, mulai dari alur pendaftaran, biaya, sampai bagaimana teknologi kami bekerja. Gunakan pencarian jika ingin menemukan jawaban dengan cepat.",
  cta: {
    label: "Jadwalkan konsultasi gratis",
    href: "https://wa.me/628112119718",
  },
  search: {
    placeholder: "Cari topik: biaya, waktu proses, monitoring...",
  },
  categories: [
    {
      id: "mulai",
      title: "Mulai dengan Urus Merek",
      summary:
        "Gambaran singkat bagaimana kami mendampingi pendaftaran merek dari nol.",
      icon: ShieldQuestion,
      accent: {
        gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
        icon: "bg-rose-100/70 text-rose-500",
      },
      items: withKeywords([
        {
          value: "mulai-1",
          question: "Apa layanan utama yang bisa dimulai secara online?",
          answer: (
            <div className="space-y-3">
              <p>
                Anda dapat memulai pendaftaran merek baru, perpanjangan,
                monitoring status, hingga konsultasi keberatan tanpa perlu
                datang ke kantor. Semua dokumen, persetujuan, dan pembayaran
                dikelola melalui dashboard terproteksi.
              </p>
              <p>
                Tim ahli kami akan menghubungi Anda maksimal 1x24 jam untuk
                mengonfirmasi detail dan memberikan rekomendasi langkah
                berikutnya.
              </p>
            </div>
          ),
          keywords: [
            "mulai online",
            "layanan utama",
            "pendaftaran dari rumah",
          ],
        },
        {
          value: "mulai-2",
          question:
            "Seberapa resmi pengajuan yang dilakukan melalui Urus Merek?",
          answer: (
            <p>
              Semua permohonan dikirimkan langsung ke DJKI Kemenkumham memakai
              akun resmi konsultan berlisensi kami. Bukti permohonan, tanda
              terima PNBP, dan nomor agenda DJKI dibagikan di hari yang sama
              setelah berkas dinyatakan lengkap.
            </p>
          ),
          keywords: ["resmi", "legal", "djkI", "kemenkumham"],
        },
        {
          value: "mulai-3",
          question: "Apakah saya mendapat pendampingan memilih kelas merek?",
          answer: (
            <p>
              Ya. Kami melakukan penelusuran Nice Classification berdasarkan
              produk dan rencana ekspansi Anda. Daftar kelas prioritas dan
              cadangan akan kami kirimkan lengkap dengan contoh barang/jasa
              sehingga keputusan Anda lebih akurat.
            </p>
          ),
          keywords: ["kelas merek", "nice", "konsultasi kelas"],
        },
        {
          value: "mulai-4",
          question: "Berapa lama sampai bukti permohonan saya terbit?",
          answer: (
            <p>
              Asalkan dokumen sudah sesuai, proses unggah ke DJKI dilakukan di
              hari yang sama dan bukti permohonan akan tersedia maksimal dalam
              1 hari kerja. Anda dapat mengunduhnya dari dashboard kapan saja.
            </p>
          ),
          keywords: ["bukti permohonan", "1 hari", "timeline awal"],
        },
      ]),
    },
    {
      id: "biaya",
      title: "Biaya & Paket Layanan",
      summary:
        "Penjelasan struktur biaya, opsi paket, dan cara pembayaran yang tersedia.",
      icon: Receipt,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "biaya-1",
          question: "Apa saja komponen biaya pendaftaran merek di Urus Merek?",
          answer: (
            <div className="space-y-3">
              <p>
                Paket Rp4.500.000 sudah termasuk PNBP resmi pemerintah, jasa
                penyusunan dokumen, kuasa hukum, dan monitoring sampai sertifikat
                terbit.
              </p>
              <p>
                Jika Anda mendaftarkan lebih dari satu kelas, biaya PNBP tambahan
                mengikuti tarif DJKI dan kami berikan faktur terperinci.
              </p>
            </div>
          ),
          keywords: ["pnBp", "tarif", "paket pendaftaran", "4500000"],
        },
        {
          value: "biaya-2",
          question: "Apakah tersedia opsi cicilan atau pembayaran bertahap?",
          answer: (
            <p>
              Kami mendukung pembayaran bertahap 2x. Termin pertama mencakup
              biaya jasa serta PNBP kelas prioritas, sedangkan termin kedua
              dibayarkan sebelum pengajuan kelas tambahan atau layanan lanjutan.
            </p>
          ),
          keywords: ["cicilan", "pembayaran bertahap"],
        },
        {
          value: "biaya-3",
          question:
            "Bisakah saya menggabungkan pendaftaran dengan monitoring atau perpanjangan?",
          answer: (
            <p>
              Bisa. Banyak klien memilih bundel pendaftaran + monitoring setahun
              dengan tarif lebih hemat 20%. Tim kami juga menyediakan paket
              perpanjangan sekaligus pembaruan label jika diperlukan.
            </p>
          ),
          keywords: ["bundel", "monitoring", "perpanjangan"],
        },
        {
          value: "biaya-4",
          question:
            "Apakah ada biaya tambahan saat terjadi usul tolak atau keberatan?",
          answer: (
            <p>
              Penyusunan tanggapan usul tolak dikenakan biaya konsultasi
              tambahan berdasarkan kompleksitas kasus. Kami selalu memberikan
              estimasi sebelum memulai agar Anda dapat mempertimbangkan
              strateginya.
            </p>
          ),
          keywords: ["usul tolak", "biaya tambahan", "keberatan"],
        },
      ]),
    },
    {
      id: "teknologi",
      title: "Teknologi & Keamanan",
      summary:
        "Ketahui bagaimana sistem kami menjaga data dan terhubung dengan DJKI.",
      icon: Fingerprint,
      accent: {
        gradient: "from-sky-100/70 via-cyan-50/60 to-transparent",
        icon: "bg-sky-100/70 text-sky-500",
      },
      items: withKeywords([
        {
          value: "teknologi-1",
          question: "Bagaimana keamanan data klien dijaga?",
          answer: (
            <p>
              Dashboard Urus Merek dienkripsi end-to-end dan berjalan di
              infrastruktur yang tersertifikasi ISO 27001. Dokumen penting
              disimpan terpisah dengan kontrol akses berlapis dan audit log
              realtime.
            </p>
          ),
          keywords: ["keamanan data", "iso 27001", "enkripsi"],
        },
        {
          value: "teknologi-2",
          question: "Apakah integrasi ke DJKI otomatis?",
          answer: (
            <p>
              Kami menggunakan API internal dengan tanda tangan digital yang sama
              seperti portal DJKI. Hal ini memastikan pengajuan cepat, minim
              kesalahan, dan bukti permohonan diterima tanpa kendala.
            </p>
          ),
          keywords: ["integrasi", "api", "tanda tangan digital"],
        },
        {
          value: "teknologi-3",
          question:
            "Bisakah saya memantau status permohonan secara mandiri?",
          answer: (
            <p>
              Ya. Dashboard menampilkan status terbaru, histori perubahan, dan
              rekomendasi tindakan. Anda juga bisa mengunduh laporan status dalam
              format PDF untuk dibagikan ke tim internal.
            </p>
          ),
          keywords: ["status", "dashboard", "pdf"],
        },
        {
          value: "teknologi-4",
          question: "Apakah ada integrasi dengan tim internal kami?",
          answer: (
            <p>
              Kami menyediakan akun kolaborator bagi tim legal Anda untuk melihat
              dokumen, memberi komentar, dan mengatur pengingat tanpa biaya
              tambahan.
            </p>
          ),
          keywords: ["kolaborasi", "tim legal"],
        },
      ]),
    },
    {
      id: "lanjutan",
      title: "Tahap Setelah Pengajuan",
      summary:
        "Langkah-langkah yang kami lakukan begitu merek Anda resmi diajukan.",
      icon: Workflow,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "lanjutan-1",
          question: "Apa yang terjadi setelah bukti permohonan terbit?",
          answer: (
            <p>
              Kami mengaktifkan monitoring otomatis, menjadwalkan evaluasi dokumen
              substantif, dan memastikan Anda menerima ringkasan tahapan berikutnya
              beserta estimasi waktu.
            </p>
          ),
          keywords: ["setelah daftar", "bukti permohonan", "monitoring"],
        },
        {
          value: "lanjutan-2",
          question: "Bagaimana jika ada usul tolak dari DJKI?",
          answer: (
            <p>
              Konsultan kami akan menganalisis dasar penolakan, merancang argumen,
              dan menyiapkan dokumen tanggapan. Proses ini melibatkan sesi diskusi
              strategis dengan Anda sebelum diajukan.
            </p>
          ),
          keywords: ["usul tolak", "tanggapan", "strategi"],
        },
        {
          value: "lanjutan-3",
          question: "Apakah saya mendapat notifikasi saat status berubah?",
          answer: (
            <p>
              Ya, Anda menerima notifikasi email dan WhatsApp setiap kali ada
              perubahan status penting—mulai dari pemeriksaan formalitas hingga
              pengumuman substantif.
            </p>
          ),
          keywords: ["notifikasi", "status berubah"],
        },
        {
          value: "lanjutan-4",
          question: "Bagaimana proses serah terima sertifikat merek?",
          answer: (
            <p>
              Setelah sertifikat diterbitkan, kami melakukan verifikasi digital
              kemudian mengirim softcopy resmi dan menawarkan layanan cetak fisik
              dengan laminasi keamanan jika dibutuhkan.
            </p>
          ),
          keywords: ["sertifikat", "softcopy", "cetak fisik"],
        },
      ]),
    },
  ],
};

export const cekMerekFaqContent: FaqContent = {
  eyebrow: "FAQ cek merek",
  title: "Pahami cara kerja pencarian merek DJKI di Urus Merek",
  description:
    "Mulai dari sumber data, cara membaca hasil, hingga langkah lanjutan yang sebaiknya Anda ambil setelah melakukan penelusuran.",
  categories: [
    {
      id: "dasar",
      title: "Dasar pencarian resmi",
      summary:
        "Hal-hal fundamental mengenai sumber data dan akurasi hasil pencarian.",
      icon: FileSearch,
      accent: {
        gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
        icon: "bg-sky-100/80 text-sky-500",
      },
      items: withKeywords([
        {
          value: "dasar-1",
          question:
            "Darimana data pencarian diambil dan seberapa cepat diperbarui?",
          answer: (
            <p>
              Data berasal dari pdki-indonesia.dgip.go.id dengan permintaan yang
              ditandatangani menggunakan algoritma PDKI Signature. Setiap permintaan
              memuat cache singkat 5 menit sehingga Anda selalu melihat status
              terbaru yang tersedia di DJKI.
            </p>
          ),
          keywords: ["sumber data", "pdki", "signature", "pembaruan"],
        },
        {
          value: "dasar-2",
          question: "Apakah pencarian ini bisa menggantikan penelusuran manual?",
          answer: (
            <p>
              Sistem kami menampilkan hasil yang identik dengan portal DJKI namun
              ditata ulang agar mudah dibaca. Untuk analisis mendalam atas risiko
              konflik, kami tetap menyarankan sesi konsultasi agar mendapat
              interpretasi ahli.
            </p>
          ),
          keywords: ["penelusuran manual", "interpretasi", "risiko"],
        },
        {
          value: "dasar-3",
          question: "Apakah ada batas jumlah pencarian harian?",
          answer: (
            <p>
              Sistem menerapkan throttle adaptif mengikuti kebijakan DJKI. Anda
              dapat melakukan beberapa pencarian beruntun; bila mendekati batas,
              kami menampilkan indikator waktu tunggu sebelum meminta ulang data.
            </p>
          ),
          keywords: ["batas pencarian", "throttle"],
        },
      ]),
    },
    {
      id: "membaca",
      title: "Cara membaca hasil",
      summary:
        "Gunakan struktur kartu dan filter untuk menilai potensi konflik merek.",
      icon: Layers,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/50 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "membaca-1",
          question: "Apa arti label warna pada status hasil pencarian?",
          answer: (
            <p>
              Warna merah menandakan konflik potensial (status aktif/berlangsung),
              kuning menunjukkan dokumen yang sedang menunggu tindak lanjut, dan
              hijau berarti merek sudah non-aktif sehingga biasanya aman bila
              namanya berbeda secara signifikan.
            </p>
          ),
          keywords: ["label warna", "status", "konflik"],
        },
        {
          value: "membaca-2",
          question: "Bagaimana cara memfilter berdasarkan kelas Nice?",
          answer: (
            <p>
              Gunakan filter kelas di sisi kiri tabel atau klik tag kelas pada
              kartu hasil. Anda dapat menyeleksi beberapa kelas sekaligus dan
              mengunduh ringkasannya untuk diskusi tim.
            </p>
          ),
          keywords: ["filter kelas", "nice", "ringkasan"],
        },
        {
          value: "membaca-3",
          question:
            "Apa yang harus saya lakukan jika menemukan merek dengan nama mirip?",
          answer: (
            <p>
              Tandai merek tersebut ke daftar pantauan dan jadwalkan konsultasi
              dengan ahli kami. Kami akan mengevaluasi tingkat kemiripan visual,
              fonetik, serta strategi modifikasi label bila diperlukan.
            </p>
          ),
          keywords: ["merek mirip", "tindakan", "pantauan"],
        },
      ]),
    },
    {
      id: "lanjutan",
      title: "Langkah lanjutan",
      summary:
        "Rekomendasi aktivitas setelah penelusuran awal Anda selesai.",
      icon: Lightbulb,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "lanjutan-1",
          question:
            "Bagaimana cara menyimpan laporan untuk dibagikan ke tim saya?",
          answer: (
            <p>
              Klik tombol &quot;Ekspor PDF&quot; untuk menghasilkan laporan
              lengkap beserta metadata pencarian. Laporan tersebut memuat daftar
              konflik, status terakhir, dan catatan analisis singkat dari sistem.
            </p>
          ),
          keywords: ["ekspor", "pdf", "laporan"],
        },
        {
          value: "lanjutan-2",
          question:
            "Apakah saya mendapat rekomendasi nama alternatif bila terjadi konflik?",
          answer: (
            <p>
              Ya, modul AI kami merekomendasikan variasi nama berdasarkan kata
              kunci yang Anda masukkan. Rekomendasi tersebut bisa dijadikan bahan
              diskusi sebelum memutuskan rebranding.
            </p>
          ),
          keywords: ["rekomendasi nama", "ai"],
        },
        {
          value: "lanjutan-3",
          question:
            "Bisakah hasil pencarian langsung diteruskan ke proses pendaftaran?",
          answer: (
            <p>
              Bisa. Klik tombol &quot;Ajukan Pendaftaran&quot; pada ringkasan
              pencarian dan sistem akan mengisi otomatis data yang relevan ke form
              pendaftaran agar Anda tidak perlu menulis ulang.
            </p>
          ),
          keywords: ["lanjut daftar", "otomatis", "prefill"],
        },
      ]),
    },
  ],
};

export const cariKelasFaqContent: FaqContent = {
  eyebrow: "FAQ cari kelas",
  title: "Lengkapi pemahaman Anda tentang pemilihan kelas Nice",
  description:
    "Pelajari cara menggunakan fitur pencarian kelas, struktur deskripsi barang/jasa, dan bagaimana kami membantu memastikan cakupan perlindungan yang tepat.",
  categories: [
    {
      id: "dasar",
      title: "Dasar klasifikasi",
      summary:
        "Penjelasan ringkas mengenai Nice Classification dan penerapannya di Indonesia.",
      icon: Layers,
      accent: {
        gradient: "from-purple-100/70 via-purple-50/60 to-transparent",
        icon: "bg-purple-100/80 text-purple-500",
      },
      items: withKeywords([
        {
          value: "dasar-1",
          question: "Apa itu Klasifikasi Nice dan kenapa penting?",
          answer: (
            <p>
              Nice Classification adalah sistem global yang membagi barang dan
              jasa ke dalam 45 kelas. DJKI mengadopsi sistem ini sehingga pemilihan
              kelas yang tepat menentukan sejauh mana perlindungan merek Anda
              berlaku.
            </p>
          ),
          keywords: ["nice classification", "pentingnya kelas"],
        },
        {
          value: "dasar-2",
          question:
            "Apakah deskripsi barang/jasa harus sama persis dengan yang ada di SKM?",
          answer: (
            <p>
              Yes. DJKI mewajibkan penggunaan deskripsi baku dari Sistem
              Klasifikasi Merek (SKM). Anda boleh menambahkan penjelasan pendukung
              selama tetap relevan dan tidak bertentangan dengan daftar resmi.
            </p>
          ),
          keywords: ["deskripsi barang", "SKM", "aturan DJKI"],
        },
        {
          value: "dasar-3",
          question: "Berapa banyak kelas yang sebaiknya saya pilih?",
          answer: (
            <p>
              Pilih kelas sesuai produk utama dan rencana ekspansi 1-2 tahun
              ke depan. Tim kami biasanya merekomendasikan kelas prioritas dan
              cadangan agar investasi Anda efisien namun tetap terlindungi.
            </p>
          ),
          keywords: ["jumlah kelas", "strategi", "ekspansi"],
        },
      ]),
    },
    {
      id: "pemakaian",
      title: "Cara menggunakan fitur",
      summary:
        "Tips praktis saat melakukan pencarian dan menyusun daftar kelas.",
      icon: Search,
      accent: {
        gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
        icon: "bg-sky-100/80 text-sky-500",
      },
      items: withKeywords([
        {
          value: "pemakaian-1",
          question: "Bagaimana cara mencari kelas dengan kata kunci spesifik?",
          answer: (
            <p>
              Ketik kata kunci pada kolom pencarian. Sistem akan mencari padanan
              Bahasa Indonesia dan Inggris sekaligus. Anda dapat memfilter hasil
              berdasarkan kategori barang atau jasa.
            </p>
          ),
          keywords: ["pencarian kelas", "kata kunci", "filter"],
        },
        {
          value: "pemakaian-2",
          question:
            "Bisakah saya menyimpan kombinasi kelas yang sudah dipilih?",
          answer: (
            <p>
              Klik &quot;Tambahkan ke shortlist&quot; untuk menyimpan kombinasi
              kelas. Shortlist tersebut dapat dibagikan ke rekan kerja atau
              dikirim ke konsultan Urus Merek untuk divalidasi.
            </p>
          ),
          keywords: ["shortlist", "simpan kelas", "kolaborasi"],
        },
        {
          value: "pemakaian-3",
          question: "Apakah tersedia rekomendasi kelas otomatis?",
          answer: (
            <p>
              Ya. Masukkan deskripsi produk utama Anda, dan modul AI kami akan
              menawarkan kelas relevan beserta contoh deskripsinya. Anda tetap
              dapat mengedit sebelum mengunci pilihan akhir.
            </p>
          ),
          keywords: ["rekomendasi", "ai", "otomatis"],
        },
      ]),
    },
    {
      id: "kolaborasi",
      title: "Kolaborasi & tindak lanjut",
      summary:
        "Cara mengevaluasi kelas bersama tim dan melanjutkan ke proses pengajuan.",
      icon: ClipboardCheck,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "kolaborasi-1",
          question: "Bagaimana cara berbagi daftar kelas dengan konsultan?",
          answer: (
            <p>
              Setiap shortlist dapat dikirim langsung ke konsultan melalui tautan
              aman. Kami akan memberi catatan tambahan, menandai kelas risiko,
              dan menyarankan kombinasi optimal.
            </p>
          ),
          keywords: ["bagikan daftar", "konsultan", "catatan"],
        },
        {
          value: "kolaborasi-2",
          question:
            "Apakah saya dapat mengunduh daftar kelas untuk arsip internal?",
          answer: (
            <p>
              Tentu. Gunakan fitur ekspor ke Excel atau PDF untuk dokumentasi
              internal. Dokumen ini berguna saat audit merek atau koordinasi
              dengan divisi legal.
            </p>
          ),
          keywords: ["unduh", "excel", "arsip"],
        },
        {
          value: "kolaborasi-3",
          question: "Apa langkah selanjutnya setelah kelas disepakati?",
          answer: (
            <p>
              Anda bisa langsung menghubungkan shortlist ke layanan pendaftaran.
              Sistem akan mengisi otomatis daftar kelas ke formulir permohonan
              sehingga proses pengajuan lebih singkat.
            </p>
          ),
          keywords: ["langkah lanjut", "pendaftaran", "prefill"],
        },
      ]),
    },
  ],
};

export const konsultasiFaqContent: FaqContent = {
  eyebrow: "FAQ konsultasi",
  title: "Semua hal tentang konsultasi merek di Urus Merek",
  description:
    "Ketahui detail alur konsultasi, dokumen pendukung, biaya, serta bagaimana kami menindaklanjuti hasil diskusi dengan rencana aksi terukur.",
  categories: [
    {
      id: "alur",
      title: "Alur konsultasi",
      summary: "Memahami tahapan sebelum, selama, dan setelah sesi konsultasi.",
      icon: NotebookPen,
      accent: {
        gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
        icon: "bg-rose-100/70 text-rose-500",
      },
      items: withKeywords([
        {
          value: "alur-1",
          question: "Apa yang terjadi setelah saya mengisi form konsultasi?",
          answer: (
            <p>
              Tim kami akan menghubungi Anda maksimal dalam 1 jam kerja untuk
              mengonfirmasi kebutuhan, menjadwalkan sesi, dan meminta dokumen
              pendukung bila diperlukan.
            </p>
          ),
          keywords: ["setelah form", "follow-up", "jadwal"],
        },
        {
          value: "alur-2",
          question: "Bagaimana format sesi konsultasi dilakukan?",
          answer: (
            <p>
              Sesi berlangsung melalui video call berdurasi 60 menit. Anda akan
              menerima agenda, tautan pertemuan, dan daftar poin diskusi sebelum
              sesi dimulai.
            </p>
          ),
          keywords: ["video call", "60 menit", "agenda"],
        },
        {
          value: "alur-3",
          question: "Apakah ada rekaman atau notulen setelah sesi?",
          answer: (
            <p>
              Kami menyediakan ringkasan tertulis, daftar rekomendasi, dan
              lampiran dokumen contoh maksimal H+1. Rekaman video tersedia atas
              permintaan untuk keperluan internal Anda.
            </p>
          ),
          keywords: ["notulen", "ringkasan", "rekaman"],
        },
      ]),
    },
    {
      id: "persiapan",
      title: "Persiapan & dokumen",
      summary: "Siapkan informasi yang membantu konsultan menganalisis kasus Anda.",
      icon: ClipboardList,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "persiapan-1",
          question: "Dokumen apa yang perlu saya kirim sebelum sesi?",
          answer: (
            <p>
              Minimal kami butuh logo/nama merek, daftar produk atau jasa, dan
              status permohonan terakhir bila sudah diajukan. Informasi tambahan
              seperti target pasar membantu kami memberi strategi lebih tajam.
            </p>
          ),
          keywords: ["dokumen pra sesi", "logo", "produk"],
        },
        {
          value: "persiapan-2",
          question:
            "Apakah konsultasi bisa dilanjutkan ke penyusunan tanggapan resmi?",
          answer: (
            <p>
              Bisa. Jika dibutuhkan, kami menyiapkan paket lanjutan untuk
              menyusun tanggapan usul tolak, keberatan, atau perjanjian lisensi
              berdasarkan hasil konsultasi.
            </p>
          ),
          keywords: ["tanggapan resmi", "lanjutan", "paket"],
        },
        {
          value: "persiapan-3",
          question: "Bisakah saya mengundang anggota tim lain ke sesi?",
          answer: (
            <p>
              Tentu. Beritahu kami nama peserta tambahan agar kami menyiapkan
              akses meeting dan materi yang sesuai. Sesi tetap bersifat privat.
            </p>
          ),
          keywords: ["tim", "undangan", "privat"],
        },
      ]),
    },
    {
      id: "biaya",
      title: "Biaya & hasil konsultasi",
      summary:
        "Informasi mengenai tarif, metode pembayaran, dan output yang Anda terima.",
      icon: Wallet2,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "biaya-1",
          question: "Berapa biaya konsultasi dan apa saja yang termasuk?",
          answer: (
            <p>
              Biaya Rp750.000 per sesi sudah mencakup analisis awal, sesi 60
              menit, ringkasan rekomendasi, dan pendampingan via email selama 7
              hari setelah konsultasi.
            </p>
          ),
          keywords: ["biaya", "750000", "output"],
        },
        {
          value: "biaya-2",
          question: "Metode pembayaran apa yang tersedia?",
          answer: (
            <p>
              Anda dapat membayar via transfer bank, virtual account, atau kartu
              kredit. Invoice resmi dikirim otomatis setelah pembayaran terselesaikan.
            </p>
          ),
          keywords: ["pembayaran", "invoice"],
        },
        {
          value: "biaya-3",
          question:
            "Apakah biaya konsultasi bisa di-offset jika lanjut ke layanan lain?",
          answer: (
            <p>
              Ya. Jika Anda melanjutkan ke paket pendaftaran atau perpanjangan
              dalam waktu 30 hari, biaya konsultasi akan menjadi potongan langsung
              pada invoice layanan tersebut.
            </p>
          ),
          keywords: ["offset", "potongan", "layanan lanjutan"],
        },
      ]),
    },
  ],
};

export const monitoringFaqContent: FaqContent = {
  eyebrow: "FAQ monitoring merek",
  title: "Maksimalkan perlindungan dengan monitoring status otomatis",
  description:
    "Dapatkan jawaban tentang cara kerja monitoring, jenis notifikasi, laporan, sampai strategi tindak lanjut saat terjadi perubahan status merek di DJKI.",
  categories: [
    {
      id: "konfigurasi",
      title: "Konfigurasi & sumber data",
      summary: "Pelajari bagaimana sistem memantau permohonan Anda.",
      icon: Globe2,
      accent: {
        gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
        icon: "bg-sky-100/80 text-sky-500",
      },
      items: withKeywords([
        {
          value: "konfigurasi-1",
          question:
            "Bagaimana sistem mendapatkan status terbaru dari DJKI?",
          answer: (
            <p>
              Kami melakukan sinkronisasi ke portal DJKI setiap 4 jam dan
              men-trigger pengecekan tambahan begitu ada indikasi perubahan.
              Semua data diverifikasi dengan tanda tangan digital sebelum
              ditampilkan di dashboard Anda.
            </p>
          ),
          keywords: ["sinkronisasi", "status terbaru", "djkI"],
        },
        {
          value: "konfigurasi-2",
          question: "Bisakah saya memantau merek milik kompetitor?",
          answer: (
            <p>
              Bisa. Cukup tambahkan nomor permohonan atau nama merek yang ingin
              dipantau. Kami menandai aset internal dan eksternal agar analisis
              risiko dapat dipisahkan.
            </p>
          ),
          keywords: ["kompetitor", "pemantauan", "nomor permohonan"],
        },
        {
          value: "konfigurasi-3",
          question: "Berapa banyak merek yang dapat dimonitor sekaligus?",
          answer: (
            <p>
              Paket dasar mencakup 10 merek aktif. Jika Anda membutuhkan lebih,
              hubungi tim kami untuk menambah kuota tanpa perlu migrasi akun.
            </p>
          ),
          keywords: ["kuota", "jumlah merek", "paket"],
        },
      ]),
    },
    {
      id: "notifikasi",
      title: "Notifikasi & respons cepat",
      summary:
        "Pastikan tidak ada perubahan status penting yang terlewat.",
      icon: BellRing,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "notifikasi-1",
          question: "Jenis notifikasi apa yang akan saya terima?",
          answer: (
            <p>
              Anda akan menerima notifikasi email dan WhatsApp untuk setiap
              perubahan status resmi, peringatan dokumen kurang, hingga tahap
              pengumuman keberatan. Kami juga menyediakan ringkasan mingguan
              untuk seluruh portofolio merek.
            </p>
          ),
          keywords: ["notifikasi", "email", "whatsapp"],
        },
        {
          value: "notifikasi-2",
          question:
            "Bisakah saya mengatur prioritas atau penerima notifikasi?",
          answer: (
            <p>
              Ya. Tentukan prioritas berdasarkan jenis status dan atur daftar
              penerima berbeda untuk tim legal, marketing, atau manajemen.
              Setiap penerima dapat mengelola preferensi sendiri.
            </p>
          ),
          keywords: ["prioritas", "penerima", "tim legal"],
        },
        {
          value: "notifikasi-3",
          question:
            "Apa langkah yang disarankan saat menerima peringatan risiko?",
          answer: (
            <p>
              Dashboard akan menampilkan rekomendasi tindakan awal—misalnya
              menyiapkan tanggapan usul tolak, mengunggah dokumen pelengkap, atau
              menghubungi konsultan kami untuk eskalasi kasus.
            </p>
          ),
          keywords: ["peringatan", "tindakan", "eskalasi"],
        },
      ]),
    },
    {
      id: "laporan",
      title: "Laporan & kolaborasi",
      summary:
        "Gunakan data monitoring untuk audit internal dan koordinasi tim.",
      icon: PieChart,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "laporan-1",
          question: "Apakah tersedia laporan analitik berkala?",
          answer: (
            <p>
              Kami mengirim laporan mingguan dan bulanan yang memuat status
              keseluruhan, SLA DJKI, serta highlight kasus yang perlu perhatian
              khusus. Laporan dapat diunduh dalam format PDF atau Excel.
            </p>
          ),
          keywords: ["laporan", "mingguan", "excel"],
        },
        {
          value: "laporan-2",
          question:
            "Bisakah tim internal menambahkan catatan dan checklist tindak lanjut?",
          answer: (
            <p>
              Tentu. Setiap status memiliki kolom catatan bersama dan checklist
              yang dapat ditandai. Riwayat perubahan dicatat otomatis untuk audit.
            </p>
          ),
          keywords: ["catatan", "checklist", "audit"],
        },
        {
          value: "laporan-3",
          question:
            "Bagaimana cara mengekspor data monitoring untuk rapat manajemen?",
          answer: (
            <p>
              Pilih merek yang ingin dilaporkan lalu klik &quot;Ekspor
              presentasi&quot;. Sistem akan menghasilkan deck ringkas berisi
              tren status, risiko utama, dan rencana aksi.
            </p>
          ),
          keywords: ["ekspor", "presentasi", "manajemen"],
        },
      ]),
    },
  ],
};

export const layananFaqContent: FaqContent = {
  eyebrow: "FAQ pilihan layanan",
  title: "Temukan layanan Urus Merek yang paling sesuai",
  description:
    "Kami merangkum pertanyaan umum seputar pemilihan layanan, alur kerja tiap paket, hingga bagaimana tim kami mendampingi Anda sejak konsultasi awal sampai penyelesaian administrasi.",
  categories: [
    {
      id: "memilih",
      title: "Menentukan layanan yang tepat",
      summary:
        "Gunakan panduan ini untuk memilih paket pendaftaran, perpanjangan, maupun dokumen hukum lain.",
      icon: Rocket,
      accent: {
        gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
        icon: "bg-rose-100/80 text-rose-500",
      },
      items: withKeywords([
        {
          value: "memilih-1",
          question:
            "Bagaimana cara menentukan layanan yang paling relevan dengan kebutuhan saya?",
          answer: (
            <p>
              Mulai dengan menjawab tiga pertanyaan: apakah merek sudah
              terdaftar, kapan masa berlaku sertifikat berakhir, dan dokumen apa
              yang ingin Anda susun. Gunakan filter layanan pada halaman ini
              untuk menandai prioritas, lalu jadwalkan sesi konsultasi singkat
              jika masih ragu.
            </p>
          ),
          keywords: ["memilih layanan", "panduan", "prioritas"],
        },
        {
          value: "memilih-2",
          question:
            "Apakah saya bisa menggabungkan beberapa layanan dalam satu proyek?",
          answer: (
            <p>
              Bisa. Banyak klien menggabungkan pendaftaran dengan monitoring
              atau layanan perjanjian lisensi. Konsultan kami akan membuatkan
              roadmap eksekusi beserta estimasi biaya tiap tahap.
            </p>
          ),
          keywords: ["gabung layanan", "roadmap", "paket"],
        },
        {
          value: "memilih-3",
          question:
            "Apa perbedaan layanan konsultasi HKI dengan konsultasi standar?",
          answer: (
            <p>
              Konsultasi HKI ditujukan untuk kasus kompleks seperti strategi
              portofolio, sengketa, atau ekspansi ke luar negeri. Sesi ini
              melibatkan analisis mendalam dan notulen komprehensif yang dapat
              dipakai sebagai dasar pengambilan keputusan manajemen.
            </p>
          ),
          keywords: ["konsultasi hki", "sengketa", "strategi"],
        },
      ]),
    },
    {
      id: "proses",
      title: "Proses & timeline",
      summary:
        "Ketahui estimasi waktu, SLA internal, dan dokumen yang kami butuhkan.",
      icon: Timer,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "proses-1",
          question: "Berapa lama proses tiap layanan berjalan?",
          answer: (
            <p>
              Pendaftaran merek dikirim dalam 1 hari kerja setelah dokumen lengkap.
              Perpanjangan membutuhkan 2-3 hari karena validasi sertifikat lama.
              Layanan hukum seperti tanggapan usul tolak membutuhkan waktu lebih
              lama (7-10 hari) untuk riset dan penyusunan argumen.
            </p>
          ),
          keywords: ["timeline", "sla", "berapa lama"],
        },
        {
          value: "proses-2",
          question: "Dokumen apa yang harus saya siapkan sejak awal?",
          answer: (
            <div className="space-y-2">
              <p>
                Umumnya kami membutuhkan identitas pemohon, bukti legalitas badan
                usaha (jika ada), logo merek, dan daftar produk/jasa. Layanan
                tertentu memerlukan lampiran tambahan seperti surat kuasa
                internal atau bukti penggunaan merek.
              </p>
            </div>
          ),
          keywords: ["dokumen awal", "identitas", "logo"],
        },
        {
          value: "proses-3",
          question:
            "Bagaimana saya bisa memantau progres layanan yang sedang berjalan?",
          answer: (
            <p>
              Progres dapat dipantau melalui dashboard Urus Merek. Setiap tahap
              memiliki status, estimasi selesai, dan PIC yang bertanggung jawab.
              Kami juga mengirim update via email/WhatsApp untuk tahap penting.
            </p>
          ),
          keywords: ["monitor progres", "dashboard", "update"],
        },
      ]),
    },
    {
      id: "kolaborasi",
      title: "Kolaborasi & dukungan",
      summary:
        "Pelajari bagaimana tim kami bekerja sama dengan perusahaan atau konsultan internal Anda.",
      icon: Users2,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "kolaborasi-1",
          question: "Apakah Urus Merek bisa bekerja bersama firma hukum saya?",
          answer: (
            <p>
              Bisa. Kami sering berkolaborasi dengan firma hukum internal atau
              eksternal. Akses kolaborator memungkinkan mereka melihat dokumen,
              memberi catatan, dan menyetujui draft sebelum dikirim ke DJKI.
            </p>
          ),
          keywords: ["firma hukum", "kolaborator", "persetujuan"],
        },
        {
          value: "kolaborasi-2",
          question: "Siapa yang menjadi kontak utama selama proyek berjalan?",
          answer: (
            <p>
              Setiap layanan memiliki konsultan penanggung jawab yang bisa
              dihubungi langsung. Selain itu, Customer Success kami memantau SLA
              keseluruhan dan siap membantu koordinasi lintas tim.
            </p>
          ),
          keywords: ["kontak utama", "customer success", "sla"],
        },
        {
          value: "kolaborasi-3",
          question: "Apakah ada dukungan pasca penyelesaian layanan?",
          answer: (
            <p>
              Ya. Setelah layanan selesai, kami menyediakan sesi handover,
              panduan perawatan dokumen, dan akses monitoring selama 30 hari
              tanpa biaya tambahan.
            </p>
          ),
          keywords: ["handover", "dukungan pasca", "monitoring"],
        },
      ]),
    },
    {
      id: "legal",
      title: "Legal & kepastian dokumen",
      summary:
        "Memastikan setiap dokumen sah secara hukum dan sesuai regulasi terbaru.",
      icon: Scale,
      accent: {
        gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
        icon: "bg-sky-100/80 text-sky-500",
      },
      items: withKeywords([
        {
          value: "legal-1",
          question:
            "Siapa yang menandatangani dokumen resmi ketika diwakilkan?",
          answer: (
            <p>
              Dokumen kuasa dan pernyataan ditandatangani oleh konsultan HKI
              berlisensi yang tercatat di DJKI. Salinan digital dan fisik kami
              simpan di arsip sehingga dapat diakses kembali kapan pun dibutuhkan.
            </p>
          ),
          keywords: ["penandatanganan", "kuasa", "arsip"],
        },
        {
          value: "legal-2",
          question:
            "Bagaimana memastikan dokumen mengikuti regulasi DJKI terbaru?",
          answer: (
            <p>
              Tim legal kami melakukan review berkala setiap kali DJKI
              memperbarui ketentuan. Template dokumen otomatis diperbarui di
              sistem sehingga Anda selalu menggunakan versi paling mutakhir.
            </p>
          ),
          keywords: ["regulasi djki", "template", "pembaruan"],
        },
        {
          value: "legal-3",
          question:
            "Apakah saya mendapatkan bukti pembayaran resmi pemerintah?",
          answer: (
            <p>
              Ya. Bukti bayar PNBP dari portal Simponi Kemenkeu kami unggah ke
              dashboard Anda sebagai bagian dari dokumentasi resmi.
            </p>
          ),
          keywords: ["pnbp", "bukti bayar", "simponi"],
        },
      ]),
    },
  ],
};

export const tentangKamiFaqContent: FaqContent = {
  eyebrow: "FAQ tentang kami",
  title: "Kenali lebih dekat tim dan kultur Urus Merek",
  description:
    "Halaman ini menjawab pertanyaan tentang sejarah perusahaan, kompetensi tim, cara kami bekerja, serta bagaimana kami menjaga kepercayaan klien korporasi maupun UMKM.",
  categories: [
    {
      id: "profil",
      title: "Profil perusahaan",
      summary:
        "Siapa kami, apa misi kami, dan bagaimana perjalanan Urus Merek berkembang.",
      icon: Flag,
      accent: {
        gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
        icon: "bg-rose-100/80 text-rose-500",
      },
      items: withKeywords([
        {
          value: "profil-1",
          question: "Bagaimana Urus Merek berawal?",
          answer: (
            <p>
              Urus Merek berdiri pada 2021 sebagai biro jasa HKI yang
              mengedepankan teknologi. Kami melihat kebutuhan pelaku usaha akan
              pendampingan merek yang transparan, cepat, dan terdokumentasi
              dengan baik.
            </p>
          ),
          keywords: ["sejarah", "2021", "biro jasa"],
        },
        {
          value: "profil-2",
          question: "Apa misi utama Urus Merek?",
          answer: (
            <p>
              Misi kami adalah membuat perlindungan merek terasa mudah bagi
              semua kalangan bisnis melalui kombinasi teknologi dan keahlian
              konsultan berlisensi.
            </p>
          ),
          keywords: ["misi", "perlindungan merek", "teknologi"],
        },
        {
          value: "profil-3",
          question: "Industri apa saja yang telah kami bantu?",
          answer: (
            <p>
              Kami mendampingi lebih dari 1.200 pelaku usaha dari sektor F&B,
              fashion, teknologi, kesehatan, hingga korporasi B2B yang memiliki
              portofolio merek global.
            </p>
          ),
          keywords: ["klien", "industri", "jumlah"],
        },
      ]),
    },
    {
      id: "tim",
      title: "Tim & kompetensi",
      summary:
        "Pelajari latar belakang tim konsultan dan bagaimana kami menjaga kualitas layanan.",
      icon: Users2,
      accent: {
        gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
        icon: "bg-emerald-100/80 text-emerald-500",
      },
      items: withKeywords([
        {
          value: "tim-1",
          question:
            "Siapa saja yang terlibat dalam proses pendaftaran dan monitoring?",
          answer: (
            <p>
              Tim kami terdiri atas konsultan HKI berlisensi, analis legal, dan
              engineer produk. Setiap proyek memiliki PIC utama yang
              berkoordinasi langsung dengan Anda.
            </p>
          ),
          keywords: ["konsultan", "analis legal", "engineer"],
        },
        {
          value: "tim-2",
          question:
            "Apakah konsultan Urus Merek memiliki sertifikasi resmi?",
          answer: (
            <p>
              Ya. Seluruh konsultan pemegang kuasa terdaftar di DJKI dan rutin
              mengikuti pelatihan pembaruan regulasi serta etika profesi.
            </p>
          ),
          keywords: ["sertifikasi", "djkI", "pelatihan"],
        },
        {
          value: "tim-3",
          question: "Bagaimana proses quality assurance dilakukan?",
          answer: (
            <p>
              Setiap dokumen melalui review berlapis oleh konsultan senior dan
              analis legal. Kami menggunakan checklist digital untuk memastikan
              tidak ada detail yang terlewat sebelum diajukan.
            </p>
          ),
          keywords: ["quality assurance", "review", "checklist"],
        },
      ]),
    },
    {
      id: "cara-kerja",
      title: "Cara kerja & transparansi",
      summary:
        "Nilai yang kami pegang ketika berkolaborasi dengan klien maupun mitra.",
      icon: Sparkles,
      accent: {
        gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
        icon: "bg-amber-100/80 text-amber-500",
      },
      items: withKeywords([
        {
          value: "cara-kerja-1",
          question:
            "Bagaimana struktur komunikasi selama proyek berlangsung?",
          answer: (
            <p>
              Kami menggunakan kanal yang terintegrasi di dashboard, dilengkapi
              fitur komentar, timeline aktivitas, serta rekaman keputusan
              penting. Hal ini menjaga keterlacakan dan memudahkan audit.
            </p>
          ),
          keywords: ["komunikasi", "dashboard", "audit"],
        },
        {
          value: "cara-kerja-2",
          question: "Apakah Urus Merek memiliki standar SLA internal?",
          answer: (
            <p>
              Ya. Setiap layanan memiliki SLA yang dipantau otomatis. Jika SLA
              mendekati batas, tim Customer Success melakukan eskalasi agar
              tindakan korektif segera diambil.
            </p>
          ),
          keywords: ["sla", "customer success", "eskalasi"],
        },
        {
          value: "cara-kerja-3",
          question:
            "Bagaimana kami menangani data rahasia klien korporasi?",
          answer: (
            <p>
              Kami menerapkan NDA, enkripsi data, serta segmentasi akses
              berdasarkan peran. Log aktivitas tersedia untuk memastikan
              kepatuhan audit internal klien.
            </p>
          ),
          keywords: ["NDA", "enkripsi", "audit"],
        },
      ]),
    },
    {
      id: "kepercayaan",
      title: "Kemitraan & kepercayaan",
      summary:
        "Komitmen kami terhadap kolaborasi jangka panjang dan keberlanjutan layanan.",
      icon: BadgeCheck,
      accent: {
        gradient: "from-sky-100/70 via-sky-50/60 to-transparent",
        icon: "bg-sky-100/80 text-sky-500",
      },
      items: withKeywords([
        {
          value: "kepercayaan-1",
          question:
            "Bagaimana Urus Merek membangun hubungan dengan mitra dan komunitas?",
          answer: (
            <p>
              Kami mengadakan webinar edukasi rutin, program referral, dan
              kolaborasi dengan inkubator bisnis. Tujuannya agar edukasi HKI
              tersebar luas dan mitra mendapatkan dukungan penuh.
            </p>
          ),
          keywords: ["mitra", "webinar", "inkubator"],
        },
        {
          value: "kepercayaan-2",
          question:
            "Apakah tersedia testimoni atau studi kasus yang bisa dipelajari?",
          answer: (
            <p>
              Ya. Kami menyiapkan studi kasus terkurasi yang menyoroti tantangan,
              strategi, dan hasil akhir secara transparan. Hubungi kami untuk
              mendapatkan akses sesuai industri Anda.
            </p>
          ),
          keywords: ["studi kasus", "testimoni", "transparan"],
        },
        {
          value: "kepercayaan-3",
          question: "Bagaimana mekanisme feedback dan continuous improvement?",
          answer: (
            <p>
              Setelah setiap proyek selesai kami mengirim survei NPS dan sesi
              review. Insight yang terkumpul digunakan untuk memperbaiki produk
              dan proses operasional secara berkala.
            </p>
          ),
          keywords: ["feedback", "nps", "perbaikan"],
        },
      ]),
    },
  ],
};

export const serviceFaqContent: Record<string, FaqContent> = {
  "pendaftaran-merek": {
    eyebrow: "FAQ layanan pendaftaran merek",
    title: "Pertanyaan populer seputar pendaftaran merek resmi",
    description:
      "Ketahui langkah pra-pendaftaran, proses unggah ke DJKI, hingga pendampingan setelah permohonan direkam. Cocok bagi Anda yang baru pertama kali mendaftarkan merek.",
    categories: [
      {
        id: "pra",
        title: "Pra-pendaftaran",
        summary:
          "Hal-hal yang kami selesaikan sebelum permohonan Anda diunggah.",
        icon: ShieldQuestion,
        accent: {
          gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
          icon: "bg-rose-100/80 text-rose-500",
        },
        items: withKeywords([
          {
            value: "pra-1",
            question: "Apa saja due diligence yang kami lakukan sebelum daftar?",
            answer: (
              <p>
                Kami melakukan pencarian konflik, memeriksa kategori Nice, serta
                meninjau kesesuaian logo dan nama terhadap regulasi DJKI. Hasilnya
                dituangkan dalam memo singkat sebagai dasar strategi pendaftaran.
              </p>
            ),
            keywords: ["due diligence", "pencarian konflik", "memo"],
          },
          {
            value: "pra-2",
            question:
              "Siapa yang menyiapkan surat kuasa dan pernyataan pemilik merek?",
            answer: (
              <p>
                Tim legal kami menyusun seluruh template resmi. Anda hanya perlu
                menandatangani secara digital atau basah sesuai kebutuhan. Kami
                akan memvalidasi format dan lampiran sebelum diajukan.
              </p>
            ),
            keywords: ["surat kuasa", "pernyataan", "template"],
          },
          {
            value: "pra-3",
            question: "Bisakah mendaftarkan banyak kelas sekaligus?",
            answer: (
              <p>
                Bisa. Kami menyusun roadmap kelas prioritas dan tambahan beserta
                estimasi PNBP per kelas. Pengajuan dilakukan bertahap sesuai
                persetujuan Anda agar biaya tetap terkendali.
              </p>
            ),
            keywords: ["multi kelas", "pnbp", "roadmap"],
          },
        ]),
      },
      {
        id: "pengajuan",
        title: "Proses pengajuan",
        summary:
          "Detail operasional saat permohonan dikirimkan ke DJKI Kemenkumham.",
        icon: Workflow,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "pengajuan-1",
            question: "Berapa lama hingga saya menerima bukti permohonan?",
            answer: (
              <p>
                Setelah data lengkap, kami unggah ke DJKI dan bukti permohonan
                akan tersedia maksimal satu hari kerja. Anda bisa mengunduhnya
                langsung dari dashboard.
              </p>
            ),
            keywords: ["bukti permohonan", "1 hari", "unggah"],
          },
          {
            value: "pengajuan-2",
            question: "Bagaimana proses tanda tangan digital dilakukan?",
            answer: (
              <p>
                Konsultan kami menandatangani permohonan dengan sertifikat
                elektronik resmi. Semua log tanda tangan tersimpan sehingga
                memudahkan audit jika dibutuhkan di kemudian hari.
              </p>
            ),
            keywords: ["tanda tangan digital", "sertifikat elektronik", "audit"],
          },
          {
            value: "pengajuan-3",
            question:
              "Apa yang terjadi jika DJKI meminta perbaikan dokumen saat unggah?",
            answer: (
              <p>
                Kami menerima notifikasi otomatis. Tim legal akan langsung
                menghubungi Anda, menyiapkan revisi, dan mengunggah ulang sebelum
                batas waktu DJKI berakhir.
              </p>
            ),
            keywords: ["perbaikan dokumen", "notifikasi djki", "revisi"],
          },
        ]),
      },
      {
        id: "pasca",
        title: "Pendampingan pasca pengajuan",
        summary:
          "Aktivitas yang kami lakukan setelah permohonan dicatat di DJKI.",
        icon: BellRing,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "pasca-1",
            question:
              "Apa yang dilakukan selama pemeriksaan formalitas dan substantif?",
            answer: (
              <p>
                Kami memantau status, mengirim laporan berkala, dan menyiapkan
                draft tanggapan jika ada catatan dari pemeriksa. Anda selalu tahu
                tahapan yang sedang berlangsung.
              </p>
            ),
            keywords: ["pemeriksaan formalitas", "substantif", "laporan"],
          },
          {
            value: "pasca-2",
            question: "Apakah saya mendapat peringatan sebelum masa pengumuman?",
            answer: (
              <p>
                Ya. Kami mengirim notifikasi saat memasuki masa pengumuman agar
                Anda siap jika ada keberatan dari pihak lain dan dapat
                menyiapkan strategi lebih awal.
              </p>
            ),
            keywords: ["masa pengumuman", "peringatan", "keberatan"],
          },
          {
            value: "pasca-3",
            question: "Bagaimana proses menerima sertifikat resmi?",
            answer: (
              <p>
                Setelah sertifikat terbit, kami melakukan verifikasi digital,
                mengunggah softcopy, dan menawarkan layanan cetak serta penyimpanan
                arsip jika dibutuhkan.
              </p>
            ),
            keywords: ["sertifikat", "softcopy", "verifikasi"],
          },
        ]),
      },
    ],
  },
  ...serviceFaqSections,

  "mitra-program": {
    eyebrow: "FAQ program mitra",
    title: "Kolaborasi sebagai mitra Urus Merek",
    description:
      "Ketahui syarat bergabung, skema komisi, dan dukungan pemasaran yang kami siapkan agar Anda bisa merekomendasikan layanan Urus Merek dengan percaya diri.",
    categories: [
      {
        id: "pendaftaran",
        title: "Pendaftaran & kualifikasi",
        summary: "Langkah awal menjadi mitra resmi Urus Merek.",
        icon: Rocket,
        accent: {
          gradient: "from-rose-100/70 via-rose-50/60 to-transparent",
          icon: "bg-rose-100/80 text-rose-500",
        },
        items: withKeywords([
          {
            value: "pendaftaran-1",
            question: "Siapa yang bisa bergabung sebagai mitra?",
            answer: (
              <p>
                Konsultan bisnis, firma hukum, komunitas wirausaha, maupun agen
                pemasaran digital yang memiliki jaringan klien relevan.
              </p>
            ),
            keywords: ["konsultan", "komunitas", "agen"],
          },
          {
            value: "pendaftaran-2",
            question: "Apa saja tahapan pendaftaran mitra?",
            answer: (
              <p>
                Isi formulir, lakukan sesi onboarding singkat, dan tanda tangani
                perjanjian kerjasama. Akun mitra akan aktif dalam 2 hari kerja.
              </p>
            ),
            keywords: ["formulir", "onboarding", "2 hari"],
          },
          {
            value: "pendaftaran-3",
            question: "Apakah ada biaya registrasi?",
            answer: (
              <p>
                Tidak ada. Program ini gratis dan kami hanya menilai kelayakan
                mitra berdasarkan rekam jejak profesional.
              </p>
            ),
            keywords: ["gratis", "kelayakan"],
          },
        ]),
      },
      {
        id: "komisi",
        title: "Skema komisi",
        summary: "Memahami cara perhitungan dan pencairan komisi.",
        icon: Receipt,
        accent: {
          gradient: "from-amber-100/70 via-amber-50/60 to-transparent",
          icon: "bg-amber-100/80 text-amber-500",
        },
        items: withKeywords([
          {
            value: "komisi-1",
            question: "Bagaimana perhitungan komisi mitra?",
            answer: (
              <p>
                Komisi dihitung persentase dari nilai transaksi bersih dan dibayarkan
                setiap tanggal 20 untuk transaksi bulan sebelumnya.
              </p>
            ),
            keywords: ["persentase", "tanggal 20", "transaksi"],
          },
          {
            value: "komisi-2",
            question: "Apakah mitra mendapatkan dashboard tracking?",
            answer: (
              <p>
                Ya. Anda dapat memantau status prospek, nilai transaksi, dan jadwal
                pencairan komisi secara real time.
              </p>
            ),
            keywords: ["dashboard", "tracking", "real time"],
          },
          {
            value: "komisi-3",
            question: "Apakah komisi berbeda untuk tiap layanan?",
            answer: (
              <p>
                Kami menyediakan tier komisi berbeda untuk pendaftaran, perpanjangan,
                dan layanan konsultasi premium. Detailnya dijelaskan saat onboarding.
              </p>
            ),
            keywords: ["tier", "pendaftaran", "konsultasi premium"],
          },
        ]),
      },
      {
        id: "dukungan",
        title: "Dukungan pemasaran",
        summary: "Materi promosi dan bantuan yang kami sediakan untuk mitra.",
        icon: Sparkles,
        accent: {
          gradient: "from-emerald-100/70 via-emerald-50/60 to-transparent",
          icon: "bg-emerald-100/80 text-emerald-500",
        },
        items: withKeywords([
          {
            value: "dukungan-1",
            question: "Materi apa yang tersedia untuk membantu promosi?",
            answer: (
              <p>
                Kami menyediakan deck presentasi, konten media sosial, dan template
                email yang bisa dipakai ulang dengan branding Anda.
              </p>
            ),
            keywords: ["deck", "media sosial", "template email"],
          },
          {
            value: "dukungan-2",
            question: "Apakah mitra mendapat support dari tim Urus Merek?",
            answer: (
              <p>
                Tentu. Tim channel partner siap membantu Q&A, demo produk, hingga
                pendampingan saat menutup deal strategis.
              </p>
            ),
            keywords: ["support", "demo", "deal"],
          },
          {
            value: "dukungan-3",
            question: "Apakah klien mitra mendapat benefit khusus?",
            answer: (
              <p>
                Ya. Klien yang direferensikan mendapatkan potongan biaya Rp100.000
                untuk layanan pendaftaran merek.
              </p>
            ),
            keywords: ["potongan", "rp100000", "klien referal"],
          },
        ]),
      },
    ],
  },
};

export type { FaqContent };
