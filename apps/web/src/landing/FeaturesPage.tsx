import { Link } from "react-router-dom";
import { FEATURE_CARDS, FeatureCard } from "../landing";

export function FeaturesPage() {
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px" }}>
      <Link
        to="/"
        style={{ fontSize: 12, color: "var(--color-accent)", fontFamily: "var(--font-display)" }}
      >
        ← Kembali
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12, marginBottom: 24 }}>
        Semua Fitur ONYX
      </h1>
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
    </main>
  );
}
