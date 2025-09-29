"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS_DATA = [
  {
    title: 'Pendaftaran Merek',
    description: 'Mulai dari penelusuran hingga pendaftaran, kami memastikan merek Anda terlindungi secara hukum.',
    image: 'https://images.ctfassets.net/w8fc6tgspyjz/3TJWgPtSJq9aAj7svTnXfb/00dace90df14cf11f541f4ed6191d32a/launch-cover.png',
  },
  {
    title: 'Perpanjangan Merek',
    description: 'Jaga aset berharga Anda dengan layanan perpanjangan merek yang tepat waktu dan efisien.',
    image: 'https://images.ctfassets.net/w8fc6tgspyjz/3TJWgPtSJq9aAj7svTnXfb/00dace90df14cf11f541f4ed6191d32a/launch-cover.png',
  },
  {
    title: 'Surat Keberatan',
    description: 'Hadapi sengketa merek dengan surat keberatan yang disusun secara profesional oleh tim ahli kami.',
    image: 'https://images.ctfassets.net/w8fc6tgspyjz/3TJWgPtSJq9aAj7svTnXfb/00dace90df14cf11f541f4ed6191d32a/launch-cover.png',
  },
];

type TabProps = {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

const ServiceTab = ({ title, description, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full text-left p-6 transition-all duration-300 ease-in-out relative border-l-4',
      isActive ? 'border-primary bg-light-red/50' : 'border-gray-200 hover:bg-gray-50'
    )}
    style={{
      // The original uses a specific RGB for the background that isn't in vars
      backgroundColor: isActive ? 'rgba(247, 245, 255, 0)' : ''
    }}
  >
    <h3
      className={cn(
        'text-xl font-bold transition-colors duration-300',
        isActive ? 'text-primary' : 'text-foreground'
      )}
    >
      {title}
    </h3>
    <p className="mt-1 text-base text-muted-foreground">{description}</p>
  </button>
);


const ServicesShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <h2 className="font-bold text-4xl md:text-5xl leading-tight text-foreground tracking-tight">
                        Urus kebutuhan merek Anda, lebih cepat
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Dari pendaftaran, perpanjangan, hingga surat keberatan—semua layanan disiapkan agar proses lebih ringkas dan aman.
                    </p>
                    <Link
                        href="/layanan"
                        className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <span>Lihat semua layanan</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24 items-start">
                    <div className="flex flex-col mb-12 lg:mb-0">
                        {TABS_DATA.map((tab, index) => (
                            <ServiceTab
                                key={index}
                                title={tab.title}
                                description={tab.description}
                                isActive={activeTab === index}
                                onClick={() => setActiveTab(index)}
                            />
                        ))}
                    </div>

                    <div className="relative w-full aspect-[640/423]">
                        {TABS_DATA.map((tab, index) => (
                           <Image
                                key={index}
                                src={tab.image}
                                alt={tab.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                                className={cn(
                                    "rounded-xl shadow-2xl transition-opacity duration-500 ease-in-out object-cover",
                                    activeTab === index ? "opacity-100" : "opacity-0"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ServicesShowcase;