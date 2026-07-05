import { HeroSection } from "./HeroSection";
import { ValuePropBar } from "./ValuePropBar";
import { FeatureGrid } from "./FeatureGrid";
import { PricingSection } from "./PricingSection";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
      <HeroSection />
      <ValuePropBar />
      <FeatureGrid />
      <PricingSection />
      <Footer />
    </main>
  );
}
