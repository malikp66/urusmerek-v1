import type { Metadata } from "next";

export type ServicePageHero = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description: string;
  bullets?: string[];
  tags?: string[];
  stats?: { label: string; value: string }[];
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  note?: string;
  image?: { src: string; alt: string };
  backgroundImage?: string;
};

export type ServiceOverview = {
  id?: string;
  heading: string;
  description: string;
  paragraphs?: string[];
  items: { title: string; description: string }[];
  media?: { src: string; alt: string };
};

export type ServiceBenefits = {
  heading: string;
  description: string;
  items: { title: string; description: string }[];
};

export type ServicePricing = {
  heading: string;
  description: string;
  note?: string;
  packages: {
    name: string;
    badge?: string;
    price: string;
    description?: string;
    cta: { label: string; href: string };
    features: string[];
    footnote?: string;
  }[];
};

export type ServicePageContent = {
  slug: string;
  nav: {
    title: string;
    description: string;
  };
  metadata: Metadata;
  hero: ServicePageHero;
  overview?: ServiceOverview;
  benefits?: ServiceBenefits;
  pricing?: ServicePricing;
};

const DEFAULT_BACKGROUND = "/web-banner-bg.png";
const DEFAULT_CTA = "https://wa.me/628112119718";

export const servicePages: ServicePageContent[] = [
  // 1) PENDAFTARAN MEREK
  {
    slug: "pendaftaran-merek",
    nav: {
      title: "Pendaftaran Merek",
      description: "Ajukan merek resmi ke DJKI dengan pendampingan konsultan HKI.",
    },
    metadata: {
      title: "Pendaftaran Merek Dagang Resmi | Urus Merek",
      description:
        "Daftar merek tanpa drama, 1 hari langsung terlindungi. Pendampingan ahli dari persiapan berkas hingga bukti permohonan terbit.",
      keywords: [
        "pendaftaran merek",
        "jasa daftar merek dagang",
        "urus merek djki",
        "konsultan merek bersertifikat",
      ],
      alternates: {
        canonical: "https://www.urusmerek.id/layanan/pendaftaran-merek",
      },
      openGraph: {
        type: "article",
        title: "Layanan Pendaftaran Merek Dagang",
        description:
          "Bebas antri & terima beres — kami urus penelusuran, kelas, dan dokumen resmi DJKI.",
        url: "https://www.urusmerek.id/layanan/pendaftaran-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Pendaftaran Merek",
      title: "Ajukan pendaftaran merek resmi",
      highlight: "tanpa ribet, one-day submission",
      description:
        "Mulai dari penelusuran nama, pemilihan kelas Nice, hingga penyusunan dokumen legal sesuai standar DJKI. Bukti permohonan resmi kamu terima di hari yang sama setelah data lengkap.",
      bullets: [
        "Analisis kemiripan & rekomendasi kelas oleh Ahli Merek",
        "Dokumen sesuai format resmi DJKI (surat kuasa/pernyataan, dsb.)",
        "Pengajuan cepat & monitoring status hingga sertifikat terbit",
      ],
      stats: [
        { label: "Bukti permohonan", value: "≤ 1 hari" },
        { label: "Kelas Nice tervalidasi", value: "45 kelas" },
        { label: "Kepuasan klien", value: "4.9/5" },
      ],
      cta: { label: "Konsultasi Gratis", href: DEFAULT_CTA },
      secondaryCta: { label: "Lihat Alur Pengajuan", href: "#alur-pendaftaran" },
      image: { src: "/service-1.png", alt: "Pendampingan pendaftaran merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Harga paket pendaftaran Rp4.500.000 sudah termasuk PNBP & jasa pengurusan. :contentReference[oaicite:2]{index=2}",
    },
    overview: {
      id: "alur-pendaftaran",
      heading: "Pastikan merek diterima sebelum pemeriksaan substantif",
      description:
        "Penolakan sering terjadi karena kelas tidak relevan, deskripsi kurang tepat, atau berkas tidak lengkap. Kami rapikan sejak awal.",
      paragraphs: [
        "Tim melakukan penelusuran menyeluruh — nama serupa, status, hingga tingkat kemiripan — untuk memetakan risiko dan memberi strategi anti-tolak.",
        "Seluruh berkas administratif (surat kuasa/pernyataan, bukti legalitas, desain/label) disiapkan dan dicek ulang sebelum unggah.",
      ],
      items: [
        {
          title: "Briefing strategis 1:1",
          description:
            "Bahas positioning merek, ruang lingkup penggunaan, prior art, dan rencana ekspansi agar kelas benar-benar relevan.",
        },
        {
          title: "Dokumen siap unggah",
          description:
            "Template resmi kami lengkapi dengan data usaha & file sesuai ketentuan DJKI untuk meminimalkan koreksi.",
        },
        {
          title: "Notifikasi status real-time",
          description:
            "Pantau formalitas hingga substantif lewat dashboard & email — kami bantu respon jika ada keberatan/sanggahan.",
        },
      ],
      media: { src: "/service-1.png", alt: "Pendampingan pengisian dokumen merek" },
    },
    benefits: {
      heading: "Keuntungan daftar merek bersama UrusMerek.id",
      description: "Kurangi risiko penolakan dan percepat legalitas merek bisnis Anda.",
      items: [
        {
          title: "Deteksi benturan sejak awal",
          description:
            "Laporan penelusuran memuat nama serupa, status, dan tingkat kemiripan untuk keputusan yang lebih aman.",
        },
        {
          title: "Reputasi merek terlindungi",
          description:
            "Berkas tersusun rapi sehingga tahapan pengumuman & sertifikasi berjalan mulus.",
        },
        {
          title: "Efisien biaya & waktu",
          description:
            "Pendekatan berbasis teknologi mempercepat proses tanpa mengorbankan akurasi. :contentReference[oaicite:3]{index=3}",
        },
      ],
    },
    pricing: {
      heading: "Paket Pendaftaran Merek",
      description: "Sudah termasuk biaya resmi (PNBP) dan jasa pengurusan lengkap.",
      note: "Harga resmi paket pendaftaran merek: Rp4.500.000. :contentReference[oaicite:4]{index=4}",
      packages: [
        {
          name: "Pendaftaran Merek",
          badge: "Paling laris",
          price: "Rp4.500.000",
          description: "One-day submission setelah data lengkap.",
          cta: { label: "Mulai Daftar", href: DEFAULT_CTA },
          features: [
            "Penelusuran kemiripan & rekomendasi kelas",
            "Penyusunan & unggah berkas resmi DJKI",
            "Pengajuan dan bukti permohonan ≤ 1 hari",
            "Monitoring status hingga sertifikat terbit",
          ],
          footnote: "Konsultasi awal gratis.",
        },
      ],
    },
  },

  // 2) PERPANJANGAN
  {
    slug: "perpanjangan-merek",
    nav: {
      title: "Perpanjangan Merek",
      description: "Perpanjang sertifikat merek Anda sebelum masa perlindungan berakhir.",
    },
    metadata: {
      title: "Perpanjangan Merek Dagang | Urus Merek",
      description:
        "Hindari jeda perlindungan 10 tahun berikutnya dengan renewal yang terpantau dan tepat waktu.",
      keywords: ["perpanjangan merek", "renewal merek djki", "biaya perpanjangan merek"],
      alternates: { canonical: "https://www.urusmerek.id/layanan/perpanjangan-merek" },
      openGraph: {
        type: "article",
        title: "Layanan Perpanjangan Merek Dagang",
        description: "Pengingat kadaluarsa, berkas lengkap, dan pengajuan tepat waktu.",
        url: "https://www.urusmerek.id/layanan/perpanjangan-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Perpanjangan",
      title: "Perpanjang perlindungan merek",
      highlight: "tanpa jeda masa berlaku",
      description:
        "Kami cek jadwal kadaluarsa, siapkan bukti penggunaan (bila perlu), kelola PNBP, dan ajukan perpanjangan hingga selesai.",
      bullets: [
        "Pengingat jadwal 6 & 3 bulan sebelum kadaluarsa",
        "Audit data merek & bukti penggunaan",
        "Monitoring proses sampai sertifikat baru terbit",
      ],
      stats: [
        { label: "Waktu pengerjaan", value: "3–5 hari kerja" },
        { label: "Notifikasi pengingat", value: "Otomatis" },
        { label: "Merek diperpanjang", value: "420+" },
      ],
      cta: { label: "Amankan Jadwal Renewal", href: DEFAULT_CTA },
      secondaryCta: { label: "Unduh Checklist", href: "#checklist-renewal" },
      image: { src: "/service-2.png", alt: "Perpanjangan sertifikat merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note:
        "Harga perpanjangan: sebelum 6 bulan Rp3.500.000, sesudah 6 bulan Rp6.000.000. :contentReference[oaicite:5]{index=5}",
    },
    overview: {
      id: "checklist-renewal",
      heading: "Jangan tunggu hingga masa perlindungan berakhir",
      description:
        "Keterlambatan satu hari bisa membuka celah bagi pihak lain. Kami pastikan syarat renewal terpenuhi tepat waktu.",
      items: [
        {
          title: "Audit data merek",
          description:
            "Cek nama, pemilik, alamat agar sesuai sertifikat lama & data terbaru.",
        },
        {
          title: "Pembayaran PNBP terkelola",
          description:
            "Kami pastikan bukti bayar sesuai agar tidak ditolak sistem DJKI.",
        },
        {
          title: "Berita acara & bukti penggunaan",
          description:
            "Jika dibutuhkan, kami siapkan materi pendukung (katalog, foto, invoice).",
        },
      ],
      media: { src: "/service-2.png", alt: "Pendampingan perpanjangan merek" },
    },
    benefits: {
      heading: "Kenapa renewal harus jauh-jauh hari?",
      description:
        "Mengamankan jadwal menghindarkan biaya ekstra dan sengketa merek di kemudian hari.",
      items: [
        {
          title: "Tanpa daftar ulang",
          description:
            "Perlindungan berlanjut tanpa pemeriksaan substantif ulang yang lama.",
        },
        {
          title: "Eksklusivitas tetap aman",
          description:
            "Hindari klaim pihak lain saat masa perlindungan hangus.",
        },
        {
          title: "Efisien anggaran legal",
          description: "Minim risiko biaya sanggahan darurat.",
        },
      ],
    },
    pricing: {
      heading: "Paket Perpanjangan Merek",
      description:
        "Termasuk audit, penyusunan berkas, pengajuan, dan notifikasi status.",
      packages: [
        {
          name: "Renewal ≤6 Bulan",
          badge: "Direkomendasikan",
          price: "Rp3.500.000",
          description: "Pengajuan sebelum 6 bulan masa berlaku berakhir.",
          cta: { label: "Jadwalkan Pengingat", href: DEFAULT_CTA },
          features: [
            "Audit sertifikat & data legalitas",
            "Penyusunan berkas & pembayaran PNBP",
            "Pengajuan & bukti resmi",
            "Monitoring hingga sertifikat terbit",
          ],
        },
        {
          name: "Renewal >6 Bulan",
          price: "Rp6.000.000",
          description: "Pengajuan setelah melewati 6 bulan terakhir.",
          cta: { label: "Konsultasikan Kasus", href: DEFAULT_CTA },
          features: [
            "Pendampingan intensif",
            "Penyesuaian bukti penggunaan (bila perlu)",
            "Pengajuan & bukti resmi",
            "Monitoring hingga sertifikat terbit",
          ],
        },
      ],
    },
  },

  // 3) CETAK SERTIFIKAT
  {
    slug: "cetak-sertifikat-merek",
    nav: {
      title: "Cetak Sertifikat Merek",
      description: "Cetak sertifikat merek terdaftar dan kirim ke alamat Anda.",
    },
    metadata: {
      title: "Cetak Sertifikat Merek Terdaftar | Urus Merek",
      description:
        "Klaim sertifikat merek terdaftar dengan mudah. Kami bantu proses cetak dan pengiriman.",
      keywords: ["cetak sertifikat merek", "sertifikat merek terdaftar"],
      alternates: {
        canonical: "https://www.urusmerek.id/layanan/cetak-sertifikat-merek",
      },
      openGraph: {
        type: "article",
        title: "Layanan Cetak Sertifikat Merek",
        description:
          "Mudah, cepat, dan langsung kirim ke rumah/kantor Anda.",
        url: "https://www.urusmerek.id/layanan/cetak-sertifikat-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Pasca-Pendaftaran",
      title: "Cetak sertifikat merek",
      highlight: "resmi & siap kirim",
      description:
        "Sertifikat sudah terbit? Kami bantu proses cetak, validasi data, dan pengiriman aman.",
      bullets: [
        "Validasi data sertifikat",
        "Koordinasi percetakan resmi",
        "Packing & pengiriman ke alamat",
      ],
      stats: [
        { label: "Durasi standard", value: "1–3 hari" },
        { label: "Klaim sukses", value: "98%" },
        { label: "Dukungan pengiriman", value: "Seluruh Indonesia" },
      ],
      cta: { label: "Ajukan Cetak", href: DEFAULT_CTA },
      image: { src: "/service-4.png", alt: "Cetak sertifikat merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Harga cetak sertifikat: Rp1.000.000. :contentReference[oaicite:6]{index=6}",
    },
    overview: {
      heading: "Dokumen otentik untuk bukti kepemilikan",
      description:
        "Sertifikat fisik berguna untuk pembuktian, kerja sama, dan administrasi internal.",
      items: [
        {
          title: "Pemeriksaan data",
          description:
            "Cocokkan detail sertifikat dengan permohonan/registrasi terakhir.",
        },
        {
          title: "Koordinasi cetak",
          description:
            "Proses percetakan resmi dengan kualitas dokumen terjaga.",
        },
        {
          title: "Logistik aman",
          description:
            "Dokumen dipacking rapi dan dikirim ke alamat yang ditentukan.",
        },
      ],
    },
    benefits: {
      heading: "Kenapa cetak lewat UrusMerek.id?",
      description:
        "Proses lebih terarah, transparan biaya, dan dibantu tim berpengalaman.",
      items: [
        { title: "Cepat & praktis", description: "Kami kelola end-to-end." },
        {
          title: "Valid & rapi",
          description: "Minim risiko salah cetak/penulisan.",
        },
        {
          title: "Dokumentasi",
          description: "Bukti pengiriman & arsip digital disediakan.",
        },
      ],
    },
    pricing: {
      heading: "Biaya Cetak Sertifikat",
      description: "Sudah termasuk layanan pengurusan & pengiriman domestik standar.",
      packages: [
        {
          name: "Cetak Sertifikat",
          price: "Rp1.000.000",
          cta: { label: "Ajukan Sekarang", href: DEFAULT_CTA },
          features: [
            "Validasi data sertifikat",
            "Koordinasi percetakan",
            "Packing & pengiriman",
          ],
        },
      ],
    },
  },

  // 4) PERUBAHAN DATA/NAMA/ALAMAT
  {
    slug: "perubahan-data-merek",
    nav: {
      title: "Perubahan Data Merek",
      description:
        "Urus pencatatan perubahan nama/alamat pemilik merek secara resmi.",
    },
    metadata: {
      title: "Permohonan Perubahan Data Merek | Urus Merek",
      description:
        "Perubahan nama/alamat pemilik merek kami urus cepat & akurat hingga tercatat resmi.",
      keywords: ["perubahan nama merek", "ubah alamat pemilik merek"],
      alternates: {
        canonical: "https://www.urusmerek.id/layanan/perubahan-data-merek",
      },
      openGraph: {
        type: "article",
        title: "Layanan Perubahan Data Merek",
        description:
          "Solusi tuntas koreksi data kepemilikan agar administrasi tetap rapi.",
        url: "https://www.urusmerek.id/layanan/perubahan-data-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Pasca-Pendaftaran",
      title: "Perubahan data kepemilikan",
      highlight: "resmi & terdokumentasi",
      description:
        "Kami susun berkas perubahan nama/alamat, siapkan surat kuasa/pernyataan, dan ajukan pencatatan hingga selesai.",
      bullets: [
        "Audit dokumen & kesesuaian data",
        "Penyusunan surat kuasa/pernyataan",
        "Pengajuan pencatatan & bukti resmi",
      ],
      cta: { label: "Ajukan Perubahan", href: DEFAULT_CTA },
      image: { src: "/service-5.png", alt: "Perubahan data merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Harga layanan perubahan data: Rp3.500.000. :contentReference[oaicite:7]{index=7}",
    },
    overview: {
      heading: "Data terkini, pengelolaan merek makin mudah",
      description:
        "Data yang tidak sinkron berpotensi menunda proses lain (renewal, lisensi, alih hak).",
      items: [
        {
          title: "Audit data & sertifikat",
          description:
            "Cek perbedaan data lalu buat ringkasan koreksi yang dibutuhkan.",
        },
        {
          title: "Penyusunan berkas",
          description:
            "Surat kuasa & pernyataan sesuai ketentuan resmi disiapkan.",
        },
        {
          title: "Pengajuan & bukti",
          description: "Kami urus pencatatan sampai bukti resmi terbit.",
        },
      ],
    },
    benefits: {
      heading: "Nilai tambah UrusMerek.id",
      description: "Cepat, rapi, dan minim revisi.",
      items: [
        { title: "Ketepatan data", description: "Kualitas verifikasi berlapis." },
        {
          title: "Jejak administrasi",
          description: "Seluruh proses terdokumentasi untuk audit di masa depan.",
        },
        { title: "Dukungan lanjutan", description: "Siap bantu layanan pasca-pencatatan lain." },
      ],
    },
    pricing: {
      heading: "Biaya Perubahan Data",
      description:
        "Termasuk persiapan berkas, pengajuan resmi, dan monitoring status.",
      packages: [
        {
          name: "Perubahan Data",
          price: "Rp3.500.000",
          cta: { label: "Diskusikan Sekarang", href: DEFAULT_CTA },
          features: [
            "Audit & ringkasan koreksi",
            "Surat kuasa & pernyataan",
            "Pengajuan resmi & bukti",
          ],
        },
      ],
    },
  },

  // 5) PENGALIHAN HAK
  {
    slug: "pengalihan-hak",
    nav: {
      title: "Pengalihan Hak Merek",
      description: "Alihkan kepemilikan merek dengan pencatatan dan dokumen resmi.",
    },
    metadata: {
      title: "Pengalihan Hak Merek | Urus Merek",
      description:
        "Penyusunan akta, verifikasi sertifikat, dan pencatatan DJKI hingga sertifikat baru terbit.",
      keywords: ["pengalihan hak merek", "jual beli merek", "akta pengalihan"],
      alternates: { canonical: "https://www.urusmerek.id/layanan/pengalihan-hak" },
      openGraph: {
        type: "article",
        title: "Layanan Pengalihan Hak Merek",
        description:
          "Transfer aman dibantu ahli berpengalaman dengan dokumen sah.",
        url: "https://www.urusmerek.id/layanan/pengalihan-hak",
      },
    },
    hero: {
      eyebrow: "Layanan Alih Hak",
      title: "Alihkan kepemilikan merek",
      highlight: "dengan akta & pencatatan resmi",
      description:
        "Kami audit legalitas, siapkan akta & surat kuasa, dampingi penandatanganan, dan urus pencatatan di DJKI.",
      bullets: [
        "Audit legalitas & potensi sengketa",
        "Draft akta sesuai struktur transaksi",
        "Pencatatan DJKI sampai sertifikat baru terbit",
      ],
      stats: [
        { label: "Waktu proses", value: "7–10 hari" },
        { label: "Kasus berhasil", value: "160+" },
        { label: "Skema umum", value: "Jual beli / merger / hibah" },
      ],
      cta: { label: "Mulai Alih Hak", href: DEFAULT_CTA },
      secondaryCta: { label: "Dokumen Diperlukan", href: "#dokumen-pengalihan" },
      image: { src: "/service-3.png", alt: "Pengalihan hak merek resmi" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Honor pendampingan alih hak: mulai Rp6.000.000. :contentReference[oaicite:8]{index=8}",
    },
    overview: {
      id: "dokumen-pengalihan",
      heading: "Proses transparan untuk kedua belah pihak",
      description:
        "Pastikan kepastian hukum transaksi aset merek dengan dokumentasi lengkap.",
      items: [
        {
          title: "Audit legalitas",
          description:
            "Lacak status, masa berlaku, dan catatan sengketa merek.",
        },
        {
          title: "Draft & penyesuaian akta",
          description:
            "Klausul pembayaran, jaminan, dan scope hak disesuaikan kebutuhan.",
        },
        {
          title: "Pencatatan DJKI",
          description:
            "Perubahan kepemilikan dicatat hingga sertifikat atas nama pemilik baru terbit.",
        },
      ],
    },
    benefits: {
      heading: "Lindungi transaksi aset merek",
      description:
        "Peralihan sah, tercatat resmi, dan dapat dipertahankan secara hukum.",
      items: [
        { title: "Kepastian hukum", description: "Dokumen sah & bukti lengkap." },
        {
          title: "Pendampingan negosiasi",
          description: "Lindungi kepentingan para pihak.",
        },
        { title: "Arsip & jejak digital", description: "Semua proses terdokumentasi." },
      ],
    },
    pricing: {
      heading: "Honor Pengalihan Hak",
      description:
        "Mencakup audit awal, penyusunan dokumen, dan pengajuan perubahan.",
      note: "Notaris & PNBP menyesuaikan struktur transaksi.",
      packages: [
        {
          name: "Transfer Package",
          price: "Mulai Rp6.000.000",
          cta: { label: "Diskusikan Kasus Anda", href: DEFAULT_CTA },
          features: [
            "Audit sertifikat & status merek",
            "Draft akta & surat kuasa",
            "Pengajuan pencatatan DJKI",
            "Monitoring hingga sertifikat baru",
          ],
        },
      ],
    },
  },

  // 6) USUL/TOLAK (Tanggapan Substantif)
  {
    slug: "usul-tolak-merek",
    nav: {
      title: "Usul/Tolak Merek",
      description:
        "Siapkan tanggapan substantif atas usul penolakan agar merek tetap bisa terdaftar.",
    },
    metadata: {
      title: "Tanggapan Usul/Tolak Merek | Urus Merek",
      description:
        "Dokumen tanggapan substantif disusun cepat, terstruktur, dan berbasis argumen kuat.",
      keywords: ["tanggapan usul tolak merek", "surat tanggapan substantif"],
      alternates: { canonical: "https://www.urusmerek.id/layanan/usul-tolak-merek" },
      openGraph: {
        type: "article",
        title: "Layanan Tanggapan Usul/Tolak",
        description:
          "Bantu merek Anda lolos dengan argumen yang tepat dan bukti pendukung.",
        url: "https://www.urusmerek.id/layanan/usul-tolak-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Sengketa/Keberatan",
      title: "Tanggapi usul penolakan",
      highlight: "cepat & terarah",
      description:
        "Kami analisis alasan penolakan dan susun tanggapan substantif lengkap bukti pendukung agar peluang lolos meningkat.",
      bullets: [
        "Analisis alasan penolakan",
        "Strategi argumen & pembuktian",
        "Penyusunan surat & pengajuan resmi",
      ],
      cta: { label: "Minta Penilaian Kasus", href: DEFAULT_CTA },
      image: { src: "/service-6.png", alt: "Tanggapan usul tolak merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Biaya tanggapan usul/tolak: Rp2.500.000. :contentReference[oaicite:9]{index=9}",
    },
    overview: {
      heading: "Dokumen tanggapan terstruktur",
      description:
        "Kami susun kerangka argumen yang menjawab poin-poin DJKI secara sistematis.",
      items: [
        { title: "Analisis kasus", description: "Kaji legal ground & referensi." },
        { title: "Draft argumentatif", description: "Bahasa jelas & ringkas." },
        { title: "Pengajuan & bukti", description: "Upload tepat waktu & tracking." },
      ],
    },
    benefits: {
      heading: "Mengapa UrusMerek.id?",
      description: "Pengalaman menangani beragam kasus across industri.",
      items: [
        {
          title: "Strategi anti-tolak",
          description: "Argumentasi didukung riset & referensi.",
        },
        { title: "Cepat", description: "Penuhi tenggat DJKI tanpa drama." },
        { title: "Transparan", description: "Status dan berkas dapat dipantau." },
      ],
    },
    pricing: {
      heading: "Biaya Tanggapan Usul/Tolak",
      description: "Termasuk analisis, drafting, dan pengajuan.",
      packages: [
        {
          name: "Response Package",
          price: "Rp2.500.000",
          cta: { label: "Mulai Tanggapan", href: DEFAULT_CTA },
          features: [
            "Analisis penyebab penolakan",
            "Penyusunan argumen & bukti",
            "Pengajuan resmi & monitoring",
          ],
        },
      ],
    },
  },

  // 7) SURAT KEBERATAN (Opposition)
  {
    slug: "surat-keberatan-merek",
    nav: {
      title: "Surat Keberatan Merek",
      description:
        "Kirim surat keberatan untuk menghadang merek tiruan pada tahap pengumuman.",
    },
    metadata: {
      title: "Penyusunan Surat Keberatan Merek | Urus Merek",
      description:
        "Susunan argumen kuat & bukti pelanggaran untuk menghalau merek yang berpotensi membingungkan publik.",
      keywords: ["surat keberatan merek", "oposisi merek"],
      alternates: {
        canonical: "https://www.urusmerek.id/layanan/surat-keberatan-merek",
      },
      openGraph: {
        type: "article",
        title: "Layanan Surat Keberatan Merek",
        description:
          "Hadang merek tiruan lolos dari pengecekan dengan keberatan terstruktur.",
        url: "https://www.urusmerek.id/layanan/surat-keberatan-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Sengketa/Keberatan",
      title: "Ajukan surat keberatan",
      highlight: "tepat sasaran & berbukti",
      description:
        "Kami rangkai surat keberatan yang tajam, menguraikan alasan kebingungan merek dan dukungan bukti penggunaan Anda.",
      bullets: [
        "Analisis kemiripan visual/fonetik/konseptual",
        "Strategi argumen legal",
        "Pengajuan keberatan & pemantauan",
      ],
      cta: { label: "Konsultasi Kasus", href: DEFAULT_CTA },
      image: { src: "/service-7.png", alt: "Surat keberatan merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Biaya surat keberatan: Rp2.500.000. :contentReference[oaicite:10]{index=10}",
    },
    overview: {
      heading: "Lindungi eksklusivitas brand Anda",
      description:
        "Keberatan efektif mencegah merek tiruan melewati tahap pengumuman.",
      items: [
        { title: "Penelusuran bukti", description: "Jejak pakai & materi promosi." },
        { title: "Kerangka argumen", description: "Kuat, ringkas, dan on-point." },
        { title: "Pengajuan resmi", description: "Sertakan lampiran & daftar bukti." },
      ],
    },
    benefits: {
      heading: "Keunggulan penyusunan kami",
      description: "Terarah, cepat, dan terdokumentasi.",
      items: [
        { title: "Sudut pandang praktis", description: "Berbasis kasus nyata." },
        { title: "Dokumentasi lengkap", description: "Draft + bukti rapi." },
        { title: "Tracking jelas", description: "Update status berkala." },
      ],
    },
    pricing: {
      heading: "Biaya Surat Keberatan",
      description: "Termasuk analisis, penyusunan, dan pengajuan.",
      packages: [
        {
          name: "Opposition Package",
          price: "Rp2.500.000",
          cta: { label: "Mulai Keberatan", href: DEFAULT_CTA },
          features: [
            "Analisis kemiripan & risiko",
            "Penyusunan surat keberatan",
            "Pengajuan & monitoring",
          ],
        },
      ],
    },
  },

  // 8) PERJANJIAN LISENSI
  {
    slug: "perjanjian-lisensi-merek",
    nav: {
      title: "Perjanjian Lisensi Merek",
      description:
        "Susun perjanjian lisensi yang aman & menguntungkan untuk kolaborasi.",
    },
    metadata: {
      title: "Penyusunan Perjanjian Lisensi Merek | Urus Merek",
      description:
        "Perjanjian lisensi disusun oleh tim ahli — jelas, sah, dan melindungi hak eksklusif Anda.",
      keywords: ["perjanjian lisensi merek", "lisensi merek dagang"],
      alternates: {
        canonical: "https://www.urusmerek.id/layanan/perjanjian-lisensi-merek",
      },
      openGraph: {
        type: "article",
        title: "Layanan Perjanjian Lisensi Merek",
        description:
          "Optimalkan keuntungan kolaborasi tanpa mengorbankan perlindungan hukum.",
        url: "https://www.urusmerek.id/layanan/perjanjian-lisensi-merek",
      },
    },
    hero: {
      eyebrow: "Layanan Komersialisasi",
      title: "Susun perjanjian lisensi merek",
      highlight: "untung & tetap aman",
      description:
        "Kami siapkan struktur perjanjian, scope hak, wilayah, jangka waktu, royalty, QC, dan mekanisme penegakan.",
      bullets: [
        "Draft perjanjian & negosiasi klausul",
        "Penyesuaian skema royalty & QC",
        "Pencatatan lisensi (bila diperlukan)",
      ],
      cta: { label: "Diskusikan Kebutuhan", href: DEFAULT_CTA },
      image: { src: "/service-8.png", alt: "Perjanjian lisensi merek" },
      backgroundImage: DEFAULT_BACKGROUND,
      note: "Biaya penyusunan lisensi: Rp3.500.000. :contentReference[oaicite:11]{index=11}",
    },
    overview: {
      heading: "Kolaborasi aman, pendapatan optimal",
      description:
        "Struktur yang tepat mengurangi sengketa dan memastikan kualitas brand terjaga.",
      items: [
        { title: "Identifikasi scope", description: "Produk, wilayah, & durasi." },
        {
          title: "Klausul inti",
          description: "Royalty, QC, pelaporan, audit, & penalti pelanggaran.",
        },
        { title: "Dokumentasi lengkap", description: "Lampiran merek & matriks QC." },
      ],
    },
    benefits: {
      heading: "Keunggulan lisensi bersama kami",
      description: "Klausul tajam & teruji praktik.",
      items: [
        { title: "Proteksi hak", description: "Hak eksklusif tetap terjaga." },
        { title: "Win-win", description: "Skema yang adil & berkelanjutan." },
        { title: "Siap dicatat", description: "Opsional pencatatan lisensi di DJKI." },
      ],
    },
    pricing: {
      heading: "Biaya Perjanjian Lisensi",
      description: "Termasuk drafting & penyesuaian klausul.",
      packages: [
        {
          name: "License Drafting",
          price: "Rp3.500.000",
          cta: { label: "Minta Draft", href: DEFAULT_CTA },
          features: [
            "Draft & negosiasi klausul",
            "Matrix QC & lampiran merek",
            "Opsional pencatatan lisensi",
          ],
        },
      ],
    },
  },

  // 9) KONSULTASI HKI (dipertahankan & sedikit diselaraskan)
  {
    slug: "konsultasi-hki",
    nav: {
      title: "Konsultasi HKI",
      description: "Diskusi strategi perlindungan dan monetisasi merek dengan ahli.",
    },
    metadata: {
      title: "Konsultasi HKI & Strategi Perlindungan | Urus Merek",
      description:
        "Sesi privat 60 menit membahas strategi perlindungan, lisensi, hingga ekspansi internasional.",
      keywords: ["konsultasi hki", "konsultasi merek dagang", "strategi perlindungan merek"],
      alternates: { canonical: "https://www.urusmerek.id/layanan/konsultasi-hki" },
      openGraph: {
        type: "article",
        title: "Layanan Konsultasi HKI",
        description:
          "Rancang strategi perlindungan merek, lisensi, dan ekspansi bersama konsultan bersertifikat.",
        url: "https://www.urusmerek.id/layanan/konsultasi-hki",
      },
    },
    hero: {
      eyebrow: "Konsultasi HKI",
      title: "Strategi perlindungan merek",
      highlight: "langsung dari konsultan bersertifikat",
      description:
        "Audit posisi merek, siapkan strategi anti-tolak, hingga roadmap ekspansi multi-negara (Madrid Protocol).",
      bullets: [
        "Sesi daring 60 menit",
        "Agenda disesuaikan kebutuhan bisnis",
        "Ringkasan rekomendasi tertulis",
      ],
      stats: [
        { label: "Tim konsultan", value: "Ahli berpengalaman" },
        { label: "Sesi terselesaikan", value: "1.200+" },
        { label: "Rating", value: "4.9/5" },
      ],
      cta: { label: "Jadwalkan Konsultasi", href: DEFAULT_CTA },
      secondaryCta: { label: "Topik Populer", href: "#topik-konsultasi" },
      image: { src: "/service-1.png", alt: "Sesi konsultasi HKI" },
      backgroundImage: DEFAULT_BACKGROUND,
    },
    overview: {
      id: "topik-konsultasi",
      heading: "Bahas tuntas strategi merek Anda",
      description:
        "Setiap sesi diawali analisis kebutuhan & target agar rekomendasi tepat sasaran.",
      items: [
        { title: "Audit posisi merek", description: "Status, penggunaan, & risiko." },
        {
          title: "Strategi multi-negara",
          description: "Estimasi biaya & timeline ekspansi.",
        },
        {
          title: "Roadmap aksi",
          description: "Prioritas langkah & estimasi biaya implementasi.",
        },
      ],
    },
    benefits: {
      heading: "Nilai tambah konsultasi",
      description: "Praktis, terdokumentasi, dan siap dieksekusi.",
      items: [
        { title: "Sudut pandang praktis", description: "Berbasis pengalaman lapangan." },
        {
          title: "Dokumentasi lengkap",
          description: "Ringkasan PDF & template aksi.",
        },
        { title: "Tindak lanjut fleksibel", description: "Mudah lanjut ke layanan eksekusi." },
      ],
    },
    pricing: {
      heading: "Biaya Konsultasi",
      description:
        "Termasuk ringkasan tertulis & follow-up via email selama 7 hari.",
      packages: [
        {
          name: "Consult Session",
          price: "Rp750.000 / sesi",
          cta: { label: "Pesan Jadwal", href: DEFAULT_CTA },
          features: [
            "Sesi privat 60 menit",
            "Ringkasan rekomendasi",
            "Template aksi & Q&A lanjutan",
          ],
        },
      ],
    },
  },

  // 10) PROGRAM MITRA (opsi halaman layanan/landing internal)
  {
    slug: "mitra-program",
    nav: {
      title: "Program Mitra",
      description:
        "Rekomendasikan layanan UrusMerek.id dan dapatkan komisi setiap transaksi.",
    },
    metadata: {
      title: "Program Mitra / Referral UrusMerek.id",
      description:
        "Komisi dibayarkan setiap tanggal 20 untuk transaksi terverifikasi bulan sebelumnya. Klienmu dapat potongan Rp100.000.",
      keywords: ["mitra urusmerek", "referral program merek", "komisi pendaftaran merek"],
      alternates: { canonical: "https://www.urusmerek.id/mitra" },
      openGraph: {
        type: "article",
        title: "Mitra UrusMerek.id",
        description:
          "Kemitraan cerdas: komisi menarik, dukungan ahli, dan potongan untuk klien.",
        url: "https://www.urusmerek.id/mitra",
      },
    },
    hero: {
      eyebrow: "Kemitraan & Referral",
      title: "Jadi Mitra UrusMerek.id",
      highlight: "komisi menarik • dukungan ahli",
      description:
        "Bagikan layanan kami ke jaringanmu. Mitra memperoleh commission fee; klienmu mendapat potongan Rp100.000 untuk pendaftaran merek.",
      bullets: [
        "Pembayaran komisi tiap tanggal 20",
        "Dukungan materi promosi",
        "Tracking status sampai sertifikat terbit",
      ],
      cta: { label: "Gabung sebagai Mitra", href: DEFAULT_CTA },
      image: { src: "/service-9.png", alt: "Program Mitra UrusMerek.id" },
      backgroundImage: DEFAULT_BACKGROUND,
      note:
        "Syarat singkat: hubungi WhatsApp ahli merek kami untuk pendaftaran mitra. :contentReference[oaicite:12]{index=12}",
    },
    overview: {
      heading: "Cara bergabung mudah",
      description:
        "Hubungi kami, dapatkan panduan, dan mulai rekomendasikan layanan UrusMerek.id.",
      items: [
        { title: "Hubungi Kami", description: "Pendaftaran via WhatsApp." },
        {
          title: "Dapatkan Panduan",
          description: "Kami kirim materi & mekanisme komisi.",
        },
        {
          title: "Mulai Berbagi",
          description: "Rekomendasikan dan pantau transaksi.",
        },
      ],
    },
    benefits: {
      heading: "Keuntungan Mitra",
      description:
        "Komisi, potongan harga untuk klien, dan reputasi profesional meningkat.",
      items: [
        { title: "Komisi rutin", description: "Dibayar tanggal 20 tiap bulan." },
        { title: "Diskon klien", description: "Potongan langsung Rp100.000." },
        { title: "Dukungan ahli", description: "Akses tim UrusMerek.id." },
      ],
    },
    pricing: {
      heading: "Skema Ringkas",
      description:
        "Tidak ada biaya bergabung. Komisi dibayarkan untuk transaksi terverifikasi.",
      packages: [
        {
          name: "Referral Partner",
          price: "Komisi / transaksi",
          cta: { label: "Daftar Mitra", href: DEFAULT_CTA },
          features: [
            "Atribusi transaksi terverifikasi",
            "Pembayaran komisi tiap tanggal 20",
            "Materi promosi siap pakai",
          ],
          footnote: "Ketentuan lengkap dibagikan setelah pendaftaran. :contentReference[oaicite:13]{index=13}",
        },
      ],
    },
  },
];

export const getServicePageContent = (slug: string) =>
  servicePages.find((service) => service.slug === slug);

export const servicePageSlugs = servicePages.map((service) => service.slug);
