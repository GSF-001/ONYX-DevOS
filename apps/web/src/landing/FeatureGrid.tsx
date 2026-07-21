import { Link } from "react-router-dom";
import { FEATURE_CARDS } from "./FeatureCardData";
import { FeatureCard } from "./FeatureCard";

const TEASER_COUNT = 3;

export function FeatureGrid() {
  const teaser = FEATURE_CARDS.slice(0, TEASER_COUNT);

  return (
    <section aria-labelledby="feature-grid-heading" style={{ padding: "40px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <h2
          id="feature-grid-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "var(--color-text-dim)",
          }}
        >
          LIHAT PRATINJAU FITUR
        </h2>
        <Link
          to="/features"
          style={{
            fontSize: 12,
            color: "var(--color-accent)",
            fontFamily: "var(--font-display)",
            whiteSpace: "nowrap",
          }}
        >
          Lihat semua 12 fitur →
        </Link>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {teaser.map((card) => (
          <FeatureCard key={card.index} data={card} />
        ))}
      </div>
    </section>
  );
}
