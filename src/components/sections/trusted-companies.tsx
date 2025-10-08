"use client"

import Image from 'next/image';
import React from 'react';

// Per instruction to adapt for an Indonesian audience, this component uses the provided logos
// with a translated title. The original site's logos are used as no Indonesian assets were supplied.
const logos = [
  { name: 'Siemens', src: 'https://images.ctfassets.net/w8fc6tgspyjz/1HL4KL58cd7iMAPr65IaeY/309e5ef2949639ff518922340ff48154/siemens.svg' },
  { name: 'AT&T', src: 'https://images.ctfassets.net/w8fc6tgspyjz/48O7yTDdUxTq40wJuLQcd3/fdaa810cc6348f5c73200b24baddab20/at-and-t.svg' },
  { name: 'American Airlines', src: 'https://images.ctfassets.net/w8fc6tgspyjz/3gf9CUuRk2Mt50VhY6TIaU/4d72e5a2ce1333aecc6d34c28cf10a90/american-airlines.svg' },
  { name: 'Cartoon Network', src: 'https://images.ctfassets.net/w8fc6tgspyjz/S09Ryn7VjvIqguXpMU7vM/64209b2be18f9f2e95d102eebb30663b/cartoon-network.svg' },
  { name: 'Sephora', src: 'https://images.ctfassets.net/w8fc6tgspyjz/6SxSE4uQLGh772txC67Ifb/0452fc7391c9e19798988e76afae8a3e/sephora.svg' },
  { name: 'Paramount', src: 'https://images.ctfassets.net/w8fc6tgspyjz/38evIty7Dc9L7ExlrTGKx3/38dc6ca02ef2c2f9378b9eb301f38994/paramount.svg' },
  { name: 'Wayfair', src: 'https://images.ctfassets.net/w8fc6tgspyjz/5jkFQG7pE8b4UC148AlBnn/b19008f9bad8abed37773f5731069ce6/wayfair.svg' },
  { name: 'Logitech', src: 'https://images.ctfassets.net/w8fc6tgspyjz/4lCcjS7EAABvCH7c4t8HcR/b945eed4759e6c31412bb9278af22a81/logitech.svg' },
  { name: 'Chick-fil-a', src: 'https://images.ctfassets.net/w8fc6tgspyjz/5wHb71tCXjwPGG8TWFXMDz/483cdb184ed41fb36d6e3d3758f74cf9/chick-fil-a.svg' },
  { name: 'Zillow', src: 'https://images.ctfassets.net/w8fc6tgspyjz/7m4JUxNakVJnixrMbPYipQ/379964530942e63ab0f978e88fa44aec/zillow.svg' },
  { name: 'Datadog', src: 'https://images.ctfassets.net/w8fc6tgspyjz/32hgaZETaNJLoQcjupoE2m/64ae91001c50d2e2b6ef4a99696aeffb/datadog.svg' },
];

const TrustedCompanies = () => {
  const extended = [...logos, ...logos];

  return (
    <section className="bg-background py-6 sm:py-10">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          Dipercaya oleh berbagai perusahaan terkemuka di Indonesia
        </p>

        {/* Mask gradient kanan-kiri agar fade in/out */}
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            className="flex items-center gap-12 will-change-transform group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
            style={{
              animation: "marquee-left 42s linear infinite", // pelan
            }}
          >
            {extended.map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={`${logo.name} Logo`}
                  width={140}
                  height={32}
                  className="h-8 w-auto max-w-[140px] object-contain opacity-70 grayscale transition-[filter,opacity,transform] duration-200 hover:opacity-100 hover:grayscale-0"
                  priority={i < 8} // sedikit percepat LCP di awal
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframes agar tak perlu ubah tailwind.config */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0); /* karena kita gandakan array */
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedCompanies;