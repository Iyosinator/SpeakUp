import { CtaSection } from "./components/home/cta-section";
import { FeaturesSection } from "./components/home/features-section";
import { HeroSection } from "./components/home/hero-section";
import { HowItWorksSection } from "./components/home/how-it-works-section";
import { Navigation } from "./components/home/navigation";
import { ProblemSection } from "./components/home/problem-section";
import { TestimonialsSection } from "./components/home/testimonials-section";
import { Footer } from "./components/home/footer";

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection  />
        <CtaSection />
        <Footer />
      </main>
    </>
  );
}
