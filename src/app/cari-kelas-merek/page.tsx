import type { Metadata } from "next";

const INDONESIAN_SUMMARY =
  "Portal pencarian kelas merek terlengkap, mencakup kelas barang (1-35) hingga kelas jasa (36-45), dengan sistem filter lanjutan untuk hasil pencarian yang lebih akurat.";

const ENGLISH_SUMMARY =
  "A comprehensive trademark class search portal covering goods classes 1-35 and service classes 36-45, equipped with advanced filtering for precise results.";

export const metadata: Metadata = {
  title: "Cari Kelas Merek | Urus Merek",
  description: INDONESIAN_SUMMARY,
};

export default function CariKelasMerekPage() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6 lg:px-10">
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Cari Kelas Merek</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {INDONESIAN_SUMMARY}
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Temukan kelas merek yang tepat sebelum mengajukan permohonan. Basis data Urus Merek merangkum seluruh klasifikasi Nice Classification untuk barang (kelas 1-35) dan jasa (kelas 36-45) berikut penjelasan rinci tiap subkelas.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Sistem Advance Filter kami membantu Anda memetakan kategori bisnis secara cepat. Saring hasil berdasarkan kata kunci, jenis produk atau layanan, bahkan status pendaftaran kompetitor untuk menilai peluang keberhasilan.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
              <li>Visualisasi hirarki kelas untuk mempermudah eksplorasi kategori terkait.</li>
              <li>Contoh produk atau jasa populer di setiap kelas sebagai referensi pengisian formulir.</li>
              <li>Rekomendasi kelas tambahan yang relevan dengan model bisnis Anda.</li>
            </ul>
            <p className="text-base leading-relaxed text-muted-foreground">
              Dengan pemetaan kelas yang akurat, Anda dapat meminimalkan risiko penolakan karena salah klasifikasi dan mempercepat proses administrasi.
            </p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">English</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Identify the right trademark classes before filing your application. Urus Merek consolidates the entire Nice Classification for goods (classes 1-35) and services (classes 36-45), complete with detailed explanations for every subclass.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Our Advance Filter System maps your business category in seconds. Narrow the list by keywords, product or service types, and even competitor registrations to gauge your filing strategy.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
              <li>Hierarchy visuals that make it easy to explore adjacent classes.</li>
              <li>Example goods and services for each class to guide your application wording.</li>
              <li>Suggested complementary classes aligned with your business model.</li>
            </ul>
            <p className="text-base leading-relaxed text-muted-foreground">
              Accurate class mapping minimizes refusal risk due to misclassification and accelerates your administrative process.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
