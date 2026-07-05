export function DocumentationLink() {
  return (
    <a
      href="/docs"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        color: "var(--color-text-dim)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        padding: "6px 12px",
      }}
    >
      Read the docs
      <span aria-hidden>→</span>
    </a>
  );
}
