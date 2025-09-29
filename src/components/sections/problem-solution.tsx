import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProblemSolutionSection = () => {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-secondary rounded-3xl p-8 sm:p-12 flex flex-col">
            <div>
              <h2 className="text-4xl lg:text-[40px] font-semibold text-foreground tracking-tight leading-tight">
                Trademark registration is complicated.
              </h2>
              <p className="mt-4 text-lg text-medium-gray">
                Juggling multiple tools, endless paperwork, and confusing legal jargon wastes time and causes errors.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <video
                className="w-full rounded-xl"
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
              <h2 className="text-4xl lg:text-[40px] font-semibold tracking-tight leading-tight">
                We make it simple.
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Our platform brings everything together: search, filing, monitoring, and legal support, into one seamless workflow.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-foreground hover:bg-gray-200 font-bold group rounded-lg h-12 px-6 text-base"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className="mt-auto pt-8 text-center">
              <div className="mb-4 text-gray-400 text-sm font-medium">
                <p>All your trademark tools</p>
                <p>in one single platform</p>
              </div>
              <video
                className="w-full rounded-xl"
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