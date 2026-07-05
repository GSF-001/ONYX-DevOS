import type { TeamViewState } from "./TeamTypes";

/** Summary strip at the top of the Team window — three real aggregates:
 * headcount, total pending reviews, and total 30-day completed reviews. */
export function TeamStats({ members, reviewerLoad }: Pick<TeamViewState, "members" | "reviewerLoad">) {
  const totalPending = reviewerLoad.reduce((sum, r) => sum + r.pendingReviewCount, 0);
  const totalCompleted = reviewerLoad.reduce((sum, r) => sum + r.completedReviewCount30d, 0);
  const overloadedCount = reviewerLoad.filter((r) => r.overloaded).length;

  return (
    <div style={{ display: "flex", gap: 16, padding: 12, borderBottom: "1px solid var(--win-face-dark)" }}>
      <Stat label="Members" value={members.length} />
      <Stat label="Pending reviews" value={totalPending} />
      <Stat label="Reviews (30d)" value={totalCompleted} />
      <Stat label="Overloaded" value={overloadedCount} tone={overloadedCount > 0 ? "var(--win-danger)" : undefined} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--win-text-dim)" }}>{label.toUpperCase()}</p>
      <p style={{ fontSize: 20, fontFamily: "var(--win-font-mono)", fontWeight: 700, color: tone }}>{value}</p>
    </div>
  );
}
