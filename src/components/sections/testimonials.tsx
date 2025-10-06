import React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    logoUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/4d8kBKr1zeAhBuaknjCYhR/df93bd8f533efa93b44b305a9c34a639/DIGGS.png',
    backgroundUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/JvI87yKGOUtp4TzYuyH2W/61a60487f044151de6b1e1fb2b7cfce6/diggs.png',
    quote: "Urusmerek.id membantu kami mengamankan merek dagang 'Lokal Karya' dengan cepat. Layanan pelanggan mereka luar biasa!",
    authorName: 'Rina Wijaya',
    authorTitle: 'Founder, Lokal Karya',
  },
  {
    logoUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/5Oju88IgcHPLGDdhyTture/b4d4613b522d0ddeb860fa7d349ef462/FINASTRA.png',
    backgroundUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/4nXhf04NpR40EFledQRc2g/c92bb0ed31efad965434c6780d88b00b/finastra.png',
    quote: "Sebagai startup teknologi, perlindungan HKI sangat penting. Tim urusmerek.id adalah platform terbaik untuk itu.",
    authorName: 'Agus Salim',
    authorTitle: 'CEO, Inovasi Digital',
  },
  {
    logoUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/4SFOhIQheRYyWTJR4mtIVl/6a916823a75f603935307cac4e1393f9/HAWKE.png',
    backgroundUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/4caOIk4hfm2TeEkz0PZBxc/a94ff0a67e2f0c65a9f4c2321f2eb762/hawk.png',
    quote: "Proses pendaftaran merek yang rumit menjadi mudah. Ini adalah investasi terbaik yang kami lakukan tahun ini.",
    authorName: 'Citra Lestari',
    authorTitle: 'Creative Director, Kreasi Anak Bangsa',
  },
];

const awards = [
  {
    title: 'Konsultan HKI Terpercaya',
    imageUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/3C52DufvZVhOFaw3q9apa9/8d31590bd28a6e52c72d695c34a08a63/leader-on-g2.png',
    alt: 'Sertifikasi Konsultan HKI Terpercaya',
  },
  {
    title: 'Penghargaan Industri Kreatif',
    imageUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/6YSuf6zjQdPc0HItwFPPkl/c04fd99c6218c15c44e85a7c7a459cb2/awarded-by-the-press.png',
    alt: 'Penghargaan Layanan HKI untuk Industri Kreatif',
  },
  {
    title: 'Pilihan Utama UKM',
    imageUrl: 'https://images.ctfassets.net/w8fc6tgspyjz/2JDeOy15KUVbaddL2QauL6/adece107956f320f6808abb0e885ca81/most-loved-on-truct-radius.png',
    alt: 'Sertifikasi Pilihan Utama UKM Indonesia',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            Testimonials
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Don’t just take it from us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Loved by teams. Backed by awards. Trusted worldwide.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <a href="#" key={index} className="group block">
              <div className="relative h-[480px] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={testimonial.backgroundUrl}
                  alt={`Testimonial from ${testimonial.authorName}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 flex h-full flex-col p-8 text-white">
                  <Image
                    src={testimonial.logoUrl}
                    alt={`${testimonial.authorTitle} logo`}
                    width={100}
                    height={32}
                    className="h-8 w-auto object-contain self-start"
                  />
                  <p className="mt-8 flex-grow text-2xl font-medium">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6">
                    <div className="font-semibold">{testimonial.authorName}</div>
                    <div className="text-sm text-gray-300">{testimonial.authorTitle}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* <div className="mt-20 grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-3">
          {awards.map((award, index) => (
            <div key={index} className="text-center">
              <h3 className="text-lg font-semibold text-foreground">{award.title}</h3>
              <div className="mt-4 flex justify-center">
                <a href="#" className="block">
                  <Image
                    src={award.imageUrl}
                    alt={award.alt}
                    width={300}
                    height={200}
                    className="h-auto w-full max-w-[250px] object-contain transition-opacity hover:opacity-80"
                  />
                </a>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialsSection;