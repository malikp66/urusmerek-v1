import Image from "next/image";
import { Button } from "@/components/ui/button";

const AiFeatures = () => {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-primary font-semibold mb-2">UrusMerek AI</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Smart tools for smarter workflows
          </h2>
          <p className="text-lg text-muted-foreground">
            Leverage AI to simplify and accelerate your trademark processes.
          </p>
        </div>

        <div className="space-y-20 lg:space-y-24">
          {/* Feature 1: Trademark Similarity Checking */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center">
              <Image
                src="https://images.ctfassets.net/w8fc6tgspyjz/5TRf10cv3AFIuMvl45fUuk/89d4dab98577db09087b2cb07de566cd/clickup-brain-1.png"
                alt="AI-Powered Trademark Similarity Checking visualization"
                width={550}
                height={450}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div>
              <p className="text-primary font-semibold mb-2">UrusMerek AI</p>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                AI-Powered Trademark Similarity Checking
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Instantly check for trademark similarities with our advanced AI.
                Get comprehensive analysis and reports to ensure your brand is
                unique and avoid potential legal conflicts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md"
                >
                  Try for Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 rounded-md text-foreground hover:bg-secondary"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Feature 2: Automated Document Preparation & Intelligent Search */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="md:order-last flex justify-center">
              <Image
                src="https://images.ctfassets.net/w8fc6tgspyjz/5U24qrdYQdSOJ8UbKyyeYh/297a97b00008121101dfff781f4e6742/clickup-brain-2.png"
                alt="Automated Document Preparation and Intelligent Search"
                width={550}
                height={450}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div className="md:order-first">
              <p className="text-primary font-semibold mb-2">
                Intelligent Search
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Automated Document Preparation & Intelligent Search
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Effortlessly search across multiple national and international
                trademark databases. Automate the preparation of your filing
                documents, saving you time and reducing errors.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-deep-red text-primary-foreground font-semibold px-6 rounded-md"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;