import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "var(--font-display)",
      }}
    >
      <p style={{ fontSize: 48, fontWeight: 700, color: "var(--color-accent)" }}>404</p>
      <p style={{ color: "var(--color-text-dim)" }}>This window doesn't exist.</p>
      <Link to="/" style={{ color: "var(--color-accent)", fontSize: 13 }}>
        ← Back to landing
      </Link>
    </div>
  );
}
