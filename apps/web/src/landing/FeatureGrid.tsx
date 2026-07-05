import { FEATURE_CARDS } from "./FeatureCardData";
import { FeatureCard } from "./FeatureCard";

export function FeatureGrid() {
  return (
    <section aria-labelledby="feature-grid-heading" style={{ padding: "40px 0" }}>
      <h2
        id="feature-grid-heading"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          letterSpacing: "0.08em",
          color: "var(--color-text-dim)",
          marginBottom: 20,
        }}
      >
        PREVIEW ALL FEATURES
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.index} data={card} />
        ))}
      </div>
    </section>
  );
}
