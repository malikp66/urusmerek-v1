import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AiFeatures = () => {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-primary font-semibold mb-2">UrusMerek AI</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Smart tools untuk urus merek—cepat & tepat
          </h2>
          <p className="text-lg text-muted-foreground">
            Cek nama merek, siapkan dokumen, dan kelola proses ke DJKI secara lebih cerdas—didampingi konsultan ahli.
          </p>
        </div>

        <div className="space-y-20 lg:space-y-24">
          {/* Feature 1: Cek Ketersediaan Nama + Analisis Kemiripan */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center">
              <Image
                src="/images/ai-similarity-check.png"
                alt="AI Cek Ketersediaan & Kemiripan Nama Merek"
                width={550}
                height={450}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div>
              <p className="text-primary font-semibold mb-2">Analisis Awal Cepat</p>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                AI Cek Ketersediaan & Kemiripan Nama Merek
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Dapatkan pengecekan nama merek instan berikut indikasi kemiripan. Hasil ringkas sebagai dasar konsultasi ahli,
                sehingga keputusan pendaftaran lebih aman dan percaya diri.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md"
                  asChild
                >
                  <Link href="/konsultasi">Coba Gratis</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 rounded-md text-foreground hover:bg-secondary"
                  asChild
                >
                  <Link href="/layanan/pendaftaran-merek">Pelajari Layanan</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Feature 2: Otomatisasi Dokumen & Pencarian Cerdas */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="md:order-last flex justify-center">
              <Image
                src="/images/ai-doc-automation.png"
                alt="AI Otomatisasi Dokumen & Pencarian Cerdas"
                width={550}
                height={450}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div className="md:order-first">
              <p className="text-primary font-semibold mb-2">Siap Daftar Lebih Cepat</p>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Otomatisasi Dokumen & Pencarian Cerdas
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Susun dokumen pendaftaran dengan lebih rapi, kurangi kelalaian input, dan lakukan pencarian data pendukung secara cerdas.
                Konsultan kami memfinalkan berkas dan mengurus pengajuan secara resmi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md"
                  asChild
                >
                  <Link href="/konsultasi">Konsultasi Sekarang</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 rounded-md text-foreground hover:bg-secondary"
                  asChild
                >
                  <Link href="/layanan">Lihat Semua Layanan</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Feature 3: One Day Service & Layanan Lanjutan */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center">
              <Image
                src="/images/ai-one-day-service.png"
                alt="One Day Service & Layanan Lanjutan"
                width={550}
                height={450}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div>
              <p className="text-primary font-semibold mb-2">End-to-End Support</p>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                One Day Service & Perlindungan Lanjut
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Pengajuan diproses dalam 1 hari kerja setelah dokumen lengkap. Layanan lanjutan mencakup perpanjangan 10 tahun,
                sanggahan/keberatan, pengalihan hak, dan perjanjian lisensi sesuai kebutuhan bisnis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md" asChild>
                  <Link href="/layanan/perpanjangan-merek">Perpanjangan Merek</Link>
                </Button>
                <Button size="lg" variant="outline" className="font-semibold px-6 rounded-md text-foreground hover:bg-secondary" asChild>
                  <Link href="/layanan/surat-keberatan">Surat Keberatan</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Global CTA */}
          <div className="text-center">
            <h4 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Jangan tunggu merekmu dicuri orang lain!
            </h4>
            <p className="text-muted-foreground mb-6">
              Lindungi merek bisnis Anda bersama ahli profesional UrusMerek.id.
            </p>
            <Button size="lg" className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md" asChild>
              <Link href="/konsultasi">Konsultasi Sekarang</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
