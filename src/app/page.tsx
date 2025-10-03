import NavigationHeader from "@/components/sections/navigation-header";
import HeroSection from "@/components/sections/hero-section";
import TrustedCompanies from "@/components/sections/trusted-companies";
import ProblemSolutionSection from "@/components/sections/problem-solution";
import ServicesShowcase from "@/components/sections/services-showcase";
import AiFeatures from "@/components/sections/ai-features";
import FeaturesGrid from "@/components/sections/features-grid";
import TestimonialsSection from "@/components/sections/testimonials";
import FlexibilityFeatures from "@/components/sections/flexibility-features";
import IndustryTemplates from "@/components/sections/industry-templates";
import FinalCta from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main>
        <HeroSection />
        <TrustedCompanies />
        {/* <ProblemSolutionSection /> */}
        <ServicesShowcase />
        <AiFeatures />
        <FeaturesGrid />
        <TestimonialsSection />
        {/* <FlexibilityFeatures /> */}
        <IndustryTemplates />
        <FinalCta />
      </main>
      
      <Footer />
    </div>
  );
}