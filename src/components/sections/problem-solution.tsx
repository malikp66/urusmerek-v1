"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";

type VideoData = {
  src: string;
  poster: string;
};

type PanelContent = {
  title: string;
  description: string;
  video: VideoData;
};

type CtaContent = {
  label: string;
  href: string;
  aria: string;
};

const ProblemSolutionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const t = useTranslations("problemSolution");
  const problem = t<PanelContent>("problem");
  const solution = t<PanelContent>("solution");
  const cta = t<CtaContent>("cta");
  const convergeLines = t<string[]>("converge");

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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-secondary rounded-3xl p-8 sm:p-12 flex flex-col">
            <div>
              <h2 className="ps-title text-4xl lg:text-[40px] font-semibold text-foreground tracking-tight leading-tight">
                {problem.title}
              </h2>
              <p className="ps-desc mt-4 text-lg text-medium-gray">{problem.description}</p>
            </div>
            <div className="mt-auto pt-8">
              <video
                className="ps-video w-full rounded-xl"
                autoPlay
                loop
                muted
                playsInline
                src={problem.video.src}
                poster={problem.video.poster}
              />
            </div>
          </div>

          <div className="bg-foreground text-primary-foreground rounded-3xl p-8 sm:p-12 flex flex-col">
            <div>
              <h2 className="ps-solution-title text-4xl lg:text-[40px] font-semibold tracking-tight leading-tight">
                {solution.title}
              </h2>
              <p className="ps-solution-desc mt-4 text-lg text-gray-300">{solution.description}</p>
              <div className="mt-8 ps-cta">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-foreground hover:bg-gray-200 font-bold group rounded-lg h-12 px-6 text-base"
                >
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={cta.aria}
                  >
                    {cta.label}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-auto pt-8 text-center">
              <div className="ps-converge-copy mb-4 text-gray-300 text-sm font-medium">
                {convergeLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <video
                className="ps-converge-video w-full rounded-xl"
                autoPlay
                loop
                muted
                playsInline
                src={solution.video.src}
                poster={solution.video.poster}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
