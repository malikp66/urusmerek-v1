import type { Metadata } from "next";

const INDONESIAN_SUMMARY =
  "Platform cek merek dengan teknologi AI yang menampilkan estimasi peluang keberhasilan pendaftaran secara real-time serta menyediakan Dokumen Hasil Analisis (DHA) lengkap.";

const ENGLISH_SUMMARY =
  "An AI-powered trademark search platform that delivers real-time filing success estimates and a comprehensive Analysis Result Document (DHA).";

export const metadata: Metadata = {
  title: "Cek Merek | Urus Merek",
  description: INDONESIAN_SUMMARY,
};

export default function CekMerekPage() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6 lg:px-10">
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Cek Merek</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {INDONESIAN_SUMMARY}
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Bahasa Indonesia</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Manfaatkan kecerdasan buatan Urus Merek untuk menelusuri merek yang telah terdaftar dan mengukur peluang keberhasilan pendaftaran merek Anda secara akurat. Sistem kami menganalisis ribuan basis data, menilai kedekatan fonetik maupun visual, dan menyajikan rekomendasi tindak lanjut yang mudah dipahami.
            </p>

            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
              <li>Info estimasi persentase keberhasilan berdasarkan parameter hukum dan tren pasar terkini.</li>
              <li>Laporan analisis terperinci yang memuat ringkasan risiko, dasar hukum, dan rekomendasi strategi.</li>
              <li>Tips untuk meningkatkan keberhasilan, termasuk rekomendasi variasi nama dan perbaikan elemen merek.</li>
              <li>Daftar nama merek yang mirip agar Anda dapat menilai potensi konflik sejak dini.</li>
            </ul>

            <p className="text-base leading-relaxed text-muted-foreground">
              Setiap pencarian menghasilkan Dokumen Hasil Analisis (DHA) lengkap yang siap dibagikan kepada tim legal atau manajemen. Anda dapat menindaklanjuti hasil analisis dengan menghubungi konsultan Urus Merek langsung dari dashboard.
            </p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">English</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Leverage Urus Merek artificial intelligence to scan the trademark registry and forecast your filing success with confidence. Our engine reviews thousands of records, evaluates phonetic and visual similarities, and surfaces actionable next steps tailored to your brand.
            </p>

            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground">
              <li>Success probability insights built on legal parameters and the latest market trends.</li>
              <li>Detailed analysis reports covering risk summaries, legal grounds, and strategy recommendations.</li>
              <li>Guidance to improve your odds, including suggested name variations and brand refinements.</li>
              <li>A curated list of similar trademarks so you can assess conflicts before filing.</li>
            </ul>

            <p className="text-base leading-relaxed text-muted-foreground">
              Every search produces a comprehensive Analysis Result Document (DHA) that you can share with legal teams or stakeholders. Continue the journey by contacting an Urus Merek consultant directly from your dashboard.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
