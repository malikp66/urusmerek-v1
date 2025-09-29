import Image from 'next/image';
import Link from 'next/link';

const FinalCta = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white" aria-hidden="true"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 transform scale-150" aria-hidden="true">
        <Image
          src="https://clickup.com/assets/glows/warm-vector.png"
          alt=""
          width={1000}
          height={1000}
          className="pointer-events-none mix-blend-multiply opacity-40"
        />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 transform scale-150" aria-hidden="true">
        <Image
          src="https://clickup.com/assets/glows/glow-vector.png"
          alt=""
          width={1000}
          height={1000}
          className="pointer-events-none mix-blend-multiply opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-28 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          <div className="relative z-10">
            <span className="text-lg font-bold text-primary">UrusMerek.id</span>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Lindungi Merek Anda Sekarang
            </h2>
            <p className="mt-2 text-base font-semibold text-primary">
              Jangan tunggu merekmu dicuri orang lain!
            </p>
            <p className="mt-4 text-xl text-muted-foreground">
              Kelola pendaftaran, pantau status, perpanjangan, dan urus surat keberatan—semua dalam satu dasbor yang mudah digunakan dan resmi tercatat di Kemenkumham.
            </p>
            <div className="mt-8">
              <Link
                href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2C+saya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-primary-foreground bg-primary shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
              >
                Konsultasi Sekarang
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="relative mx-auto w-full rounded-xl shadow-2xl">
              <Image
                src="https://images.ctfassets.net/w8fc6tgspyjz/48U3fEhpi2LVBEmCuC4hF/bf29abf01c4e8633048df708c51c8b97/supercharge-your-productivity.png"
                alt="Dasbor Manajemen Merek UrusMerek.id"
                width={1000}
                height={679}
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