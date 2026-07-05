interface ValueProp {
  label: string;
  description: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    label: "Operating System",
    description: "Not just a dashboard. ONYX is an operating system built for engineering teams.",
  },
  {
    label: "Real-Time Sync",
    description: "Everything connects live through GitHub webhooks.",
  },
  {
    label: "Desktop Experience",
    description: "Work in windows, not pages. Open as many apps as you need at once.",
  },
];

export function ValuePropBar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 24,
        padding: "20px 0",
        borderBottom: "1px solid #232a30",
      }}
    >
      {VALUE_PROPS.map((prop) => (
        <div key={prop.label}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--color-accent)",
              marginBottom: 4,
            }}
          >
            {prop.label.toUpperCase()}
          </p>
          <p style={{ fontSize: 13, color: "var(--color-text-dim)", lineHeight: 1.5 }}>
            {prop.description}
          </p>
        </div>
      ))}
    </div>
  );
}
