/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { HeroSection } from "./HeroSection";
import { ValuePropBar } from "./ValuePropBar";
import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
      <HeroSection />
      <ValuePropBar />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
