# Rencana SEO & Konten Urus Merek

1. **Beranda (/)**
   1. **Tujuan Halaman & Audiens Utama**
      - Menjadi landing page utama yang memperkenalkan layanan pengurusan merek Urus Merek.
      - Audiens: pemilik UMKM dan startup yang baru mengenal proses pendaftaran merek, serta manajer merek di perusahaan skala menengah yang mencari solusi digital terpadu.
   2. **Kata Kunci Target**
      - Primer: "jasa pengurusan merek dagang", "layanan pendaftaran merek online", "konsultan merek DJKI".
      - Sekunder & long-tail: "bantuan daftar merek untuk UMKM", "platform cek merek AI", "jasa urus merek harga transparan", "daftar merek dagang resmi djki".
      - Lokal (opsional): "jasa urus merek di Jakarta", "konsultan merek Indonesia".
   3. **Struktur Konten**
      - **H1**: "Jasa Pengurusan Merek Dagang Terintegrasi Urus Merek".
      - **Ringkasan Pembuka**: 2 paragraf yang menonjolkan solusi end-to-end, kecepatan proses, serta kredibilitas tim hukum.
      - **H2 Manfaat Layanan**: jelaskan otomatisasi cek merek, pendampingan legal, laporan risiko.
      - **H2 Proses End-to-End** dengan H3 per tahap: Analisis awal, pencarian kelas, penyusunan dokumen, pendampingan DJKI, monitoring pasca daftar.
      - **H2 Paket & Biaya Transparan**: tabel paket (UMKM, Growing Startup, Corporate) dengan CTA ke /konsultasi.
      - **H2 Testimoni Klien**: kutipan singkat dari UMKM & startup.
      - **H2 FAQ**: 4–5 pertanyaan umum seputar waktu proses, biaya, legalitas.
      - **H2 Ajakan Bertindak**: CTA besar ke form konsultasi dan link internal ke /konsultasi & /cek-merek.
      - **Internal Link**: /cek-merek, /cari-kelas-merek, /monitoring-merek.
      - **External Link (otoritatif)**: DJKI (https://www.dgip.go.id/) untuk informasi regulasi resmi.
   4. **Elemen SEO On-Page & Implementasi Next.js**
      - **Title Tag**: `Jasa Pengurusan Merek Cepat & Terpercaya | Urus Merek` (58 karakter).
      - **Meta Description**: `Daftarkan merek usaha dengan tim ahli Urus Merek. Cek merek, pilih kelas, dan ajukan ke DJKI lebih cepat.`
      - **Kata Kunci Utama**: `jasa pengurusan merek dagang`, `pendaftaran merek dagang`, `konsultan merek djki`.
      - **Kata Kunci Sekunder**: `platform cek merek`, `monitoring merek`, `biaya daftar merek dagang`.
      - **Structured Data** (`Organization` + `Service` berlapis):
        ```ts
        import type { Metadata } from "next";

        const homeJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Urus Merek',
          url: 'https://www.urusmerek.id/',
          logo: 'https://www.urusmerek.id/logo.png',
          sameAs: ['https://www.dgip.go.id/'],
          serviceProvided: {
            '@type': 'Service',
            name: 'Jasa pengurusan merek dagang',
            areaServed: 'ID',
            providerMobility: 'dynamic'
          }
        };

        export const metadata: Metadata = {
          title: 'Jasa Pengurusan Merek Cepat & Terpercaya | Urus Merek',
          description:
            'Daftarkan merek usaha dengan tim ahli Urus Merek. Cek merek, pilih kelas, dan ajukan ke DJKI lebih cepat.',
          alternates: {
            canonical: 'https://www.urusmerek.id/'
          },
          openGraph: {
            title: 'Jasa Pengurusan Merek Dagang Terintegrasi',
            description:
              'Solusi cek merek, penyusunan dokumen, dan pendaftaran DJKI dalam satu platform.',
            url: 'https://www.urusmerek.id/',
            siteName: 'Urus Merek',
            locale: 'id_ID',
            type: 'website'
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Jasa Pengurusan Merek Cepat',
            description:
              'Platform terpadu untuk cek merek, pilih kelas, dan daftar ke DJKI.',
            images: ['https://www.urusmerek.id/og-cover.png']
          },
          other: {
            'script:ld+json': JSON.stringify(homeJsonLd)
          }
        };
        ```
      - **Contoh `next-seo`**:
        ```tsx
        import { NextSeo } from 'next-seo';

        <NextSeo
          title="Jasa Pengurusan Merek Cepat & Terpercaya | Urus Merek"
          description="Daftarkan merek usaha dengan tim ahli Urus Merek. Cek merek, pilih kelas, dan ajukan ke DJKI lebih cepat."
          canonical="https://www.urusmerek.id/"
          openGraph={{
            url: 'https://www.urusmerek.id/',
            title: 'Jasa Pengurusan Merek Dagang Terintegrasi',
            description:
              'Solusi cek merek, penyusunan dokumen, dan pendaftaran DJKI dalam satu platform.',
          }}
        />
        ```
   5. **Optimasi Teknis & UX**
      - Gunakan komponen `next/image` untuk hero & testimoni dengan alt text berisi kata kunci relevan.
      - Terapkan lazy loading untuk section berat dan gunakan `@next/font` untuk mengurangi layout shift.
      - Implementasikan schema `BreadcrumbList` di layout agar navigasi jelas bagi crawler.
      - Aktifkan caching & ISR (misal revalidate 3600 detik) untuk konten statis namun perbarui saat ada perubahan testimoni.
      - Tambahkan trust badge & microinteractions ringan di CTA untuk meningkatkan konversi.
   6. **Rekomendasi Implementasi Next.js**
      - Struktur file: `src/app/(site)/page.tsx` dengan komponen hero/testimoni dipisah di `components/sections` untuk reuse.
      - Gunakan `generateMetadata` jika data title/description dinamis dari CMS.
      - Buat `app/sitemap.ts` yang memasukkan URL beranda dan update prioritas tinggi.
      - Atur `next.config.js` `experimental.appDir: true` (sudah aktif) dan pastikan `headers()` menambahkan `Cache-Control` agresif.
      - Testing: gunakan Playwright untuk memverifikasi elemen meta di `<head>` dan jest-dom snapshot untuk hero CTA.

2. **Cari Kelas Merek (/cari-kelas-merek)**
   1. **Tujuan & Audiens**
      - Membantu user memahami klasifikasi Nice sebelum mengajukan permohonan.
      - Audiens: pemilik UMKM & tim legal internal yang menyiapkan dokumen.
   2. **Kata Kunci Target**
      - Primer: "cari kelas merek", "klasifikasi merek dagang", "kelas merek nice".
      - Sekunder/long-tail: "cara menentukan kelas merek dagang", "cek kelas merek barang dan jasa", "panduan kelas merek UMKM".
   3. **Struktur Konten**
      - **H1**: "Cari Kelas Merek Dagang Resmi Nice Classification".
      - Pembuka menjelaskan manfaat alat pencarian dan keakuratan data DJKI.
      - **H2 Kenapa Penting**: risiko salah klasifikasi.
      - **H2 Cara Menggunakan Tools**: H3 langkah-langkah (masukkan kata kunci, filter, hasil rekomendasi).
      - **H2 Paket Bantuan Konsultan**: upsell ke layanan /konsultasi.
      - **H2 Integrasi dengan Pendaftaran**: ajak lanjut ke /cek-merek dan /monitoring-merek.
      - **H2 FAQ** fokus definisi kelas, jumlah kelas barang/jasa, apakah bisa multi kelas.
      - Internal link: /cek-merek, /konsultasi.
      - External link: Panduan Nice Classification WIPO (https://www.wipo.int/classifications/nice/en/).
   4. **Elemen SEO On-Page**
      - **Title**: `Cari Kelas Merek Dagang Nice Classification | Urus Merek`.
      - **Meta Description**: `Temukan kelas merek barang dan jasa dengan database resmi. Hindari penolakan DJKI dengan panduan Urus Merek.`
      - **Kata Kunci Utama**: `cari kelas merek`, `kelas merek dagang`, `nice classification indonesia`.
      - **Structured Data (`Service`)**:
        ```ts
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Pencarian Kelas Merek',
          provider: {
            '@type': 'Organization',
            name: 'Urus Merek',
            url: 'https://www.urusmerek.id/cari-kelas-merek'
          },
          serviceType: 'Trademark Class Search',
          areaServed: 'ID',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Paket Konsultasi Kelas Merek',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Review kelas merek oleh konsultan'
                }
              }
            ]
          }
        };

        export const metadata: Metadata = {
          title: 'Cari Kelas Merek Dagang Nice Classification | Urus Merek',
          description:
            'Temukan kelas merek barang dan jasa dengan database resmi. Hindari penolakan DJKI dengan panduan Urus Merek.',
          alternates: {
            canonical: 'https://www.urusmerek.id/cari-kelas-merek'
          },
          openGraph: {
            type: 'website',
            url: 'https://www.urusmerek.id/cari-kelas-merek',
            title: 'Cari Kelas Merek Dagang Resmi Nice Classification',
            description:
              'Filter kelas barang dan jasa dengan data resmi DJKI dan rekomendasi otomatis.'
          },
          twitter: {
            card: 'summary',
            title: 'Cari Kelas Merek Dagang',
            description:
              'Gunakan database Urus Merek untuk memilih kelas barang/jasa secara akurat.'
          },
          other: {
            'script:ld+json': JSON.stringify(jsonLd)
          }
        };
        ```
   5. **Optimasi Teknis & UX**
      - Pastikan pencarian kelas memakai debounce dan skeleton loading untuk respon cepat.
      - Tampilkan breadcrumbs (Beranda › Cari Kelas Merek) dengan schema `BreadcrumbList`.
      - Sediakan filter mobile friendly dengan bottom sheet.
      - Gunakan `Suspense` dan streaming untuk daftar hasil panjang.
   6. **Rekomendasi Implementasi Next.js**
      - Gunakan `generateMetadata` bila summary berasal dari database.
      - Data kelas dapat diambil melalui `GET /api/classes`; gunakan caching Edge & ISR (revalidate 86400 detik).
      - Tambahkan pengujian Playwright untuk memastikan filter bekerja dan metadata ter-render.

3. **Cek Merek (/cek-merek)**
   1. **Tujuan & Audiens**
      - Memberikan layanan pencarian konflik merek berbasis AI.
      - Audiens: startup dan perusahaan skala menengah yang memerlukan analisis cepat sebelum investasi branding.
   2. **Kata Kunci**
      - Primer: "cek merek dagang", "pencarian merek djki", "cek merek online".
      - Sekunder: "cek merek dagang gratis", "analisis konflik merek", "dokumen hasil analisis merek".
   3. **Struktur Konten**
      - **H1**: "Cek Merek Dagang Online dengan Analisis AI".
      - Pembuka menjelaskan kecepatan dan akurasi.
      - **H2 Fitur Unggulan**: probabilitas keberhasilan, DHA, rekomendasi strategi.
      - **H2 Cara Kerja AI** dengan visual flow.
      - **H2 Integrasi Layanan**: link ke /konsultasi untuk tindak lanjut.
      - **H2 Paket Harga**: highlight per pencarian atau bundling.
      - **H2 FAQ**: perbedaan cek manual vs AI, sumber data.
      - **H2 Testimoni**: studi kasus singkat startup.
      - Internal link: /monitoring-merek, /cari-kelas-merek.
      - External link: Database publik DJKI sebagai referensi sumber data.
   4. **Elemen SEO**
      - **Title**: `Cek Merek Dagang Online Berbasis AI | Urus Merek`.
      - **Meta Description**: `Analisis konflik merek dengan AI, dapatkan estimasi peluang lolos DJKI dan Dokumen Hasil Analisis lengkap.`
      - **Structured Data (`Service` + `FAQPage`)**:
        ```ts
        const faqJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Berapa lama proses cek merek AI? ',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hasil awal muncul kurang dari 5 menit dengan ringkasan risiko.'
              }
            },
            {
              '@type': 'Question',
              name: 'Apakah data cek merek resmi?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Kami mensinkronkan basis data DJKI dan menambahkan analisis fonetik serta visual.'
              }
            }
          ]
        };

        const serviceJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Cek Merek Dagang Berbasis AI',
          provider: {
            '@type': 'Organization',
            name: 'Urus Merek',
            url: 'https://www.urusmerek.id/cek-merek'
          },
          serviceOutput: 'Dokumen Hasil Analisis (DHA)',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'IDR',
            price: '350000',
            availability: 'https://schema.org/InStock'
          }
        };

        export const metadata: Metadata = {
          title: 'Cek Merek Dagang Online Berbasis AI | Urus Merek',
          description:
            'Analisis konflik merek dengan AI, dapatkan estimasi peluang lolos DJKI dan Dokumen Hasil Analisis lengkap.',
          alternates: {
            canonical: 'https://www.urusmerek.id/cek-merek'
          },
          openGraph: {
            title: 'Cek Merek Dagang Online dengan Analisis AI',
            description:
              'Prediksi peluang lolos DJKI dan dapatkan Dokumen Hasil Analisis (DHA).',
            url: 'https://www.urusmerek.id/cek-merek',
            type: 'article'
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Cek Merek Dagang Online',
            description:
              'Analisis konflik merek otomatis plus rekomendasi langkah selanjutnya.'
          },
          other: {
            'script:ld+json': JSON.stringify(serviceJsonLd),
            'script:ld+json:faq': JSON.stringify(faqJsonLd)
          }
        };
        ```
   5. **Optimasi Teknis & UX**
      - Tampilkan indikator akurasi AI dan highlight call-to-action dengan badges kepercayaan.
      - Gunakan SSR atau server actions untuk hasil pencarian agar tidak terekspos di klien.
      - Implementasikan progres bar & export PDF untuk DHA.
      - Pastikan form input memiliki validasi real-time & states loading accessible.
   6. **Rekomendasi Next.js**
      - Manfaatkan route handler `/api/search-trademark` dengan streaming data.
      - Terapkan `revalidatePath('/cek-merek')` setelah pembaruan testimoni.
      - Uji dengan Jest + MSW untuk API response serta Playwright untuk memverifikasi meta tag.

4. **Konsultasi (/konsultasi)**
   1. **Tujuan & Audiens**
      - Menjadi halaman konversi untuk mengisi form konsultasi.
      - Audiens: pemilik usaha yang membutuhkan pendampingan penuh, corporate legal yang ingin SLA jelas.
   2. **Kata Kunci**
      - Primer: "konsultasi merek dagang", "form konsultasi merek", "jasa konsultan merek".
      - Sekunder: "biaya konsultasi merek", "konsultan merek djki", "form pendaftaran merek online".
   3. **Struktur Konten**
      - **H1**: "Konsultasi Merek Dagang dengan Konsultan Berlisensi".
      - Ringkasan: jaminan respons cepat & pendampingan hukum.
      - **H2 Kenapa Konsultasi Urus Merek**: SLA, tim berlisensi, dukungan AI.
      - **H2 Cara Kerja Konsultasi**: H3 (Submit Form, Analisis, Rekomendasi, Eksekusi).
      - **H2 Paket Pendampingan**: highlight retainer bulanan atau per kasus.
      - **H2 Testimoni & Studi Kasus**.
      - **H2 FAQ**: waktu respons, dokumen yang diperlukan, biaya.
      - CTA sticky ke form.
      - Internal link: /cek-merek, /monitoring-merek.
      - External link: Peraturan Menteri Hukum & HAM terkait merek.
   4. **Elemen SEO**
      - **Title**: `Konsultasi Merek Dagang Berlisensi | Urus Merek`.
      - **Meta Description**: `Isi form konsultasi merek dan dapatkan pendampingan konsultan berlisensi untuk proses pendaftaran DJKI.`
      - **Structured Data (`Service` + `ContactPoint`)**:
        ```ts
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Konsultasi Merek Dagang Urus Merek',
          url: 'https://www.urusmerek.id/konsultasi',
          areaServed: 'ID',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'hello@urusmerek.id',
            availableLanguage: ['id', 'en'],
            areaServed: 'ID'
          }
        };

        export const metadata: Metadata = {
          title: 'Konsultasi Merek Dagang Berlisensi | Urus Merek',
          description:
            'Isi form konsultasi merek dan dapatkan pendampingan konsultan berlisensi untuk proses pendaftaran DJKI.',
          alternates: {
            canonical: 'https://www.urusmerek.id/konsultasi'
          },
          openGraph: {
            title: 'Form Konsultasi Merek Dagang',
            description:
              'Tim berlisensi siap membantu strategi pendaftaran dan perlindungan merek.',
            url: 'https://www.urusmerek.id/konsultasi',
            type: 'website'
          },
          twitter: {
            card: 'summary',
            title: 'Konsultasi Merek Dagang Berlisensi',
            description:
              'Hubungi konsultan Urus Merek untuk pendampingan resmi DJKI.'
          },
          other: {
            'script:ld+json': JSON.stringify(jsonLd)
          }
        };
        ```
   5. **Optimasi Teknis & UX**
      - Gunakan validasi `react-hook-form` + zod (sudah ada) dan tampilkan progress state.
      - Tambahkan captcha ringan atau honeypot (sudah tersedia) untuk keamanan.
      - Pastikan form accessible (label terasosiasi, feedback error ARIA live).
      - Implementasikan `POST /konsultasi/submit` dengan rate limiting.
   6. **Rekomendasi Next.js**
      - Gunakan Server Action untuk submit data dan trigger email.
      - Simpan data ke database via Drizzle dan revalidate dashboard admin.
      - Tes dengan Cypress/Playwright untuk form submission dan intercept fetch.

5. **Monitoring Merek (/monitoring-merek)**
   1. **Tujuan & Audiens**
      - Menawarkan fitur pemantauan status merek & notifikasi.
      - Audiens: perusahaan skala menengah & korporasi dengan portofolio merek banyak.
   2. **Kata Kunci**
      - Primer: "monitoring merek dagang", "pantau status merek", "notifikasi status merek".
      - Sekunder: "monitoring permohonan merek djki", "tracking status merek dagang", "dashboard monitoring merek".
   3. **Struktur Konten**
      - **H1**: "Monitoring Status Merek Dagang Otomatis".
      - Pembuka: penjelasan mitigasi risiko.
      - **H2 Fitur Monitoring**: alert, timeline, log aktivitas.
      - **H2 Cara Integrasi**: API/ dashboard.
      - **H2 Paket Harga**: per jumlah merek dipantau.
      - **H2 Studi Kasus**: corporate, franchise.
      - **H2 FAQ**: sumber data, frekuensi update, keamanan.
      - CTA ke /konsultasi untuk demo.
      - Internal link: /cek-merek, /konsultasi.
      - External link: Regulasi terkait perpanjangan merek DJKI.
   4. **Elemen SEO**
      - **Title**: `Monitoring Status Merek Dagang Otomatis | Urus Merek`.
      - **Meta Description**: `Aktifkan notifikasi perubahan status merek dan pantau proses DJKI secara real-time.`
      - **Structured Data (`SoftwareApplication`)**:
        ```ts
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Monitoring Merek Urus Merek',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'IDR',
            price: '99000'
          }
        };

        export const metadata: Metadata = {
          title: 'Monitoring Status Merek Dagang Otomatis | Urus Merek',
          description:
            'Aktifkan notifikasi perubahan status merek dan pantau proses DJKI secara real-time.',
          alternates: {
            canonical: 'https://www.urusmerek.id/monitoring-merek'
          },
          openGraph: {
            title: 'Monitoring Status Merek Dagang Otomatis',
            description:
              'Dashboard pemantauan status merek plus notifikasi email & WhatsApp.',
            url: 'https://www.urusmerek.id/monitoring-merek',
            type: 'website'
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Monitoring Merek Dagang Otomatis',
            description:
              'Lacak proses pendaftaran dan perpanjangan merek Anda secara menyeluruh.'
          },
          other: {
            'script:ld+json': JSON.stringify(jsonLd)
          }
        };
        ```
   5. **Optimasi Teknis & UX**
      - Integrasikan WebSocket atau SSE untuk update status real-time.
      - Tampilkan grafik progres dan filter portofolio.
      - Gunakan `Image` untuk ilustrasi notifikasi dengan deskripsi alt.
      - Terapkan background job queue untuk polling DJKI.
   6. **Rekomendasi Next.js**
      - Pertimbangkan route dinamis `/monitoring-merek/[id]` untuk detail merek.
      - Gunakan `generateStaticParams` jika data portofolio publik, atau `generateMetadata` per merek.
      - Tambahkan pengujian API watchers & snapshot UI dashboard dengan Storybook.

6. **Tentang Kami (/tentang-kami)**
   1. **Tujuan & Audiens**
      - Membangun kepercayaan dan menonjolkan tim ahli.
      - Audiens: calon klien korporasi, investor, mitra strategis.
   2. **Kata Kunci**
      - Primer: "tentang urus merek", "profil konsultan merek", "perusahaan jasa pendaftaran merek".
      - Sekunder: "tim konsultan merek berlisensi", "pengalaman urus merek", "layanan hki indonesia".
   3. **Struktur Konten**
      - **H1**: "Tentang Urus Merek – Konsultan Pendaftaran Merek Terpercaya".
      - Pembuka: misi dan nilai.
      - **H2 Sejarah & Visi**.
      - **H2 Tim Inti**: profil singkat, sertifikasi.
      - **H2 Legalitas & Pengakuan**: nomor izin, kemitraan.
      - **H2 Teknologi & Metodologi**: sebut fitur AI.
      - **H2 Budaya Pelayanan & Testimoni**.
      - **H2 CTA**: ajak ke /konsultasi dan /monitoring-merek.
      - External link: asosiasi konsultan HKI resmi.
   4. **Elemen SEO**
      - **Title**: `Tentang Urus Merek | Konsultan Pendaftaran Merek`.
      - **Meta Description**: `Kenali tim konsultan dan teknologi Urus Merek yang membantu ribuan bisnis melindungi merek dagang.`
      - **Structured Data (`Organization`)**:
        ```ts
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Urus Merek',
          url: 'https://www.urusmerek.id/tentang-kami',
          logo: 'https://www.urusmerek.id/logo.png',
          foundingDate: '2021',
          founder: [{ '@type': 'Person', name: 'Nama Founder' }],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: 'hello@urusmerek.id',
            telephone: '+62-21-1234567'
          }
        };

        export const metadata: Metadata = {
          title: 'Tentang Urus Merek | Konsultan Pendaftaran Merek',
          description:
            'Kenali tim konsultan dan teknologi Urus Merek yang membantu ribuan bisnis melindungi merek dagang.',
          alternates: {
            canonical: 'https://www.urusmerek.id/tentang-kami'
          },
          openGraph: {
            title: 'Tentang Urus Merek',
            description:
              'Pelajari misi, tim, dan teknologi yang mendampingi pendaftaran merek Anda.',
            url: 'https://www.urusmerek.id/tentang-kami',
            type: 'profile'
          },
          twitter: {
            card: 'summary',
            title: 'Tentang Urus Merek',
            description:
              'Platform layanan pendaftaran merek terpercaya di Indonesia.'
          },
          other: {
            'script:ld+json': JSON.stringify(jsonLd)
          }
        };
        ```
   5. **Optimasi Teknis & UX**
      - Tambahkan foto tim dengan `next/image` dan alt text nama + jabatan.
      - Sertakan timeline animasi ringan dengan intersection observer.
      - Gunakan CSS Grid untuk menampilkan nilai perusahaan.
   6. **Rekomendasi Next.js**
      - Muat data tim dari CMS melalui `async` component & caching 12 jam.
      - Buat `app/tentang-kami/team-member.tsx` untuk card reusable.
      - Tes snapshot konten statis dengan Jest & visual regression (Chromatic/Storybook).

7. **Optimasi Global & Infrastruktur SEO**
   1. **Sitemap & Robots**
      - Tambahkan `app/sitemap.ts` otomatis yang menggabungkan seluruh halaman di atas + konten blog.
      - Konfigurasi `robots.txt` melalui `next-sitemap` atau custom handler: izinkan semua user-agent, blokir route admin.
   2. **Metadata Global**
      - Set `metadataBase` pada `app/layout.tsx` ke `https://www.urusmerek.id` agar semua canonical otomatis konsisten.
      - Gunakan `title` template global (`%s | Urus Merek`) serta default Open Graph & Twitter Card untuk fallback halaman baru.
      - Aktifkan directive `robots` default (`index, follow`) dan daftarkan gambar OG standar (`/og-cover.png`).
   3. **Domain & Canonical**
      - Pastikan `next.config.js` berisi `images.domains` untuk CDN dan `i18n` jika menambah bahasa.
      - Set `metadataBase` di `app/layout.tsx` untuk canonical domain tunggal.
   4. **Caching & ISR**
      - Gunakan `revalidate` berbeda per halaman (beranda 1 jam, halaman informasional 24 jam).
      - Simpan data testimoni di database & revalidate ketika ada perubahan.
   5. **Testing Metadata**
      - Buat tes Jest untuk memeriksa `metadata` object (snapshot) dan Playwright untuk mengecek `<head>`.
      - Gunakan `@testing-library/react` untuk memastikan internal link muncul.

8. **KPI Kinerja SEO & Bisnis**
   - Peringkat kata kunci utama (top 3 target per halaman) di Google Indonesia.
   - Organic CTR dari Google Search Console untuk tiap landing page.
   - Jumlah sesi organik & rasio pentalan pada halaman layanan.
   - Konversi form konsultasi (submit per 100 sesi organik) dan permintaan demo monitoring.
   - Jumlah dokumen DHA yang di-generate per minggu dari traffic organik.
   - Growth daftar email yang bersumber dari CTA beranda & halaman edukasi.
   - Event tracking GA4/Segment untuk `consultation_submit`, `dha_generated`, dan `demo_requested` yang di-tag sumber organik.
   - Dashboard gabungan Search Console + CRM untuk memantau pipeline nilai deal dari prospek organik.
