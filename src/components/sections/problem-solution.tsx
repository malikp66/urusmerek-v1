"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProblemSolutionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".ps-title", { y: 24, opacity: 0, duration: 0.5 })
        .from(".ps-desc", { y: 16, opacity: 0, duration: 0.4 }, "-=0.25")
        .from(".ps-video", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".ps-solution-title", { y: 24, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".ps-solution-desc", { y: 16, opacity: 0, duration: 0.4 }, "-=0.25")
        .from(".ps-cta", { y: 12, opacity: 0, duration: 0.35 }, "-=0.2")
        .from(".ps-converge-copy", { y: 10, opacity: 0, duration: 0.35 }, "-=0.15")
        .from(".ps-converge-video", { y: 16, opacity: 0, duration: 0.45 }, "-=0.15");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-secondary rounded-3xl p-8 sm:p-12 flex flex-col">
            <div>
              <h2 className="ps-title text-4xl lg:text-[40px] font-semibold text-foreground tracking-tight leading-tight">
                Pendaftaran merek itu rumit.
              </h2>
              <p className="ps-desc mt-4 text-lg text-medium-gray">
                Banyak alat berbeda, formulir yang membingungkan, dan istilah hukum yang bikin pusing. Akhirnya buang waktu dan berisiko salah langkah.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <video
                className="ps-video w-full rounded-xl"
                autoPlay
                loop
                muted
                playsInline
                src="https://videos.ctfassets.net/w8fc6tgspyjz/3Y7YYziaKZhhmQPuSppcXr/3ab81599ecbb75e685729d55489da272/CHAT_IS_BROKEN_V02-ezgif.com-gif-to-mp4-converter.mp4"
                poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              />
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-foreground text-primary-foreground rounded-3xl p-8 sm:p-12 flex flex-col">
            <div>
              <h2 className="ps-solution-title text-4xl lg:text-[40px] font-semibold tracking-tight leading-tight">
                Kami membuatnya sederhana.
              </h2>
              <p className="ps-solution-desc mt-4 text-lg text-gray-300">
                UrusMerek.id menyatukan semuanya: penelusuran merek, pengajuan, monitoring status, perpanjangan, hingga surat keberatan—dalam satu alur kerja yang rapi.
              </p>
              <div className="mt-8 ps-cta">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-foreground hover:bg-gray-200 font-bold group rounded-lg h-12 px-6 text-base"
                >
                  <a
                    href="https://api.whatsapp.com/send/?phone=6282267890152&text=Hi%2CSaya+ingin+konsultasi+pendaftaran+merek.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mulai konsultasi
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-auto pt-8 text-center">
              <div className="ps-converge-copy mb-4 text-gray-300 text-sm font-medium">
                <p>Semua alat urus merek</p>
                <p>dalam satu platform</p>
              </div>
              <video
                className="ps-converge-video w-full rounded-xl"
                autoPlay
                loop
                muted
                playsInline
                src="https://videos.ctfassets.net/w8fc6tgspyjz/6vm22aRpEdepqdDHlhP1rQ/a0b6722cb15efcdfcb028ff92a4fd153/CONVERGENCE_08_GIF_DARKMODE_1mbps_V01.mp4"
                poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;