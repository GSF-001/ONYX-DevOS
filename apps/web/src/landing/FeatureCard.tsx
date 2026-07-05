import type { FeatureCardDatum } from "./FeatureCardData";
import { ScreenshotFrame } from "./ScreenshotFrame";

interface FeatureCardProps {
  data: FeatureCardDatum;
}

export function FeatureCard({ data }: FeatureCardProps) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
        background: "var(--color-bg-raised)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 12,
            color: "var(--color-accent)",
            fontWeight: 700,
          }}
        >
          {data.index}
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{data.title}</h3>
      </div>

      <ScreenshotFrame title={data.title.toUpperCase()}>
        <div
          role="img"
          aria-label={data.screenshotAlt}
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, var(--color-bg-inset), var(--color-bg-raised))",
          }}
        />
      </ScreenshotFrame>

      <ul style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 4 }}>
        {data.bullets.map((bullet) => (
          <li
            key={bullet}
            style={{
              fontSize: 13,
              color: "var(--color-text-dim)",
              display: "flex",
              gap: 8,
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>·</span>
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
}
