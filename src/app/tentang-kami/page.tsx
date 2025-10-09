import type { Metadata } from "next";

const INDONESIAN_DESCRIPTION =
  "Urus Merek adalah platform digital untuk penelusuran dan perlindungan merek usaha. Kami menyediakan fitur cek merek real-time berbasis AI, pencarian kelas barang/jasa, serta monitoring status merek dengan notifikasi otomatis. Tujuan kami adalah memastikan pendaftaran merek Anda berjalan lancar sehingga merek usaha Anda terlindungi.";

const ENGLISH_DESCRIPTION =
  "Urus Merek is a digital platform for trademark search and brand protection. We provide real-time AI-powered trademark checks, class search across goods and service categories, and status monitoring with automatic notifications. Our goal is to ensure your trademark registration proceeds smoothly so your brand is protected.";

export const metadata: Metadata = {
  title: "Tentang Kami | Urus Merek",
  description: INDONESIAN_DESCRIPTION,
};

export default function TentangKamiPage() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6 lg:px-10">
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Tentang Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Mengenal lebih dekat misi Urus Merek dalam membantu pelaku usaha melindungi identitas brand mereka.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{INDONESIAN_DESCRIPTION}</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">English</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{ENGLISH_DESCRIPTION}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
