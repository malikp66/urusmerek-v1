import Image from "next/image";
import Link from "next/link";

const FinalCta = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: red theme */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-red-50 to-white"
        aria-hidden="true"
      />

      {/* Red decorative glows (pure CSS, tanpa asset eksternal) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60
                   bg-[radial-gradient(ellipse_at_center,theme(colors.red.300),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-40
                   bg-[radial-gradient(ellipse_at_center,theme(colors.rose.300),transparent_60%)]"
      />

      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-28 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          {/* Copy */}
          <div className="relative z-10">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              UrusMerek.id
            </span>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Lindungi Merek Anda, Mulai Hari Ini
            </h2>

            <p className="mt-3 text-base font-semibold text-primary">
              Jangan tunggu namamu dipakai orang lain.
            </p>

            <p className="mt-4 text-lg text-muted-foreground">
              Kami bantu <span className="font-medium text-foreground">pendaftaran</span> dan{" "}
              <span className="font-medium text-foreground">perpanjangan merek</span> secara resmi di
              DJKI—mulai dari penelusuran, pengajuan, hingga terbit sertifikat. Tersedia juga{" "}
              <span className="font-medium text-foreground">keberatan/oposisi</span>,{" "}
              <span className="font-medium text-foreground">tanggapan usul/tolak</span>,{" "}
              <span className="font-medium text-foreground">perubahan data</span>,{" "}
              <span className="font-medium text-foreground">pengalihan hak</span>,{" "}
              <span className="font-medium text-foreground">lisensi</span>, dan{" "}
              <span className="font-medium text-foreground">cetak sertifikat</span>.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Resmi DJKI Kemenkumham • Harga flat & transparan • Update progres berkala
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-medium
                           rounded-lg text-primary-foreground bg-primary shadow-lg hover:bg-primary/90
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Konsultasi Sekarang
              </Link>

              <Link
                href="#harga"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold
                           rounded-lg border border-primary/30 text-primary bg-white/70 backdrop-blur
                           hover:bg-white hover:border-primary transition-colors"
              >
                Lihat Paket & Harga
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="mt-12 lg:mt-0">
            <div className="relative mx-auto w-full rounded-xl shadow-2xl">
              <Image
                src="https://lh5.googleusercontent.com/proxy/dtt_ej0n7UbyaYB79wXc50BCIsJUCzIW4t1tcNJ-hELcutQNK6shtTgy75_6XKzRIiPuMehEu-BSkT7_bAt5nBT-F0XULjkfezbFUoCOI02PP_YT93L1zmbZN2-CWPyayB2QTIA"
                alt="Dasbor pengurusan merek UrusMerek.id — kelola pendaftaran, perpanjangan, dan status DJKI"
                width={1200}
                height={760}
                className="rounded-xl w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
