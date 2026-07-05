export function About() {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 15 }}>ONYX Engineering Workstation</p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginTop: 4 }}>Version 1.0.0</p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginTop: 12, lineHeight: 1.6 }}>
        A retro-styled operating system for engineering teams — live review
        health, reviewer load, and repository risk signals, synced through
        GitHub webhooks.
      </p>
    </div>
  );
}
