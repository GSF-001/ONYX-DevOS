import type { RepositoryInsights } from "./InsightsTypes";
import { EmptyState } from "../../shared/components";

export function ReviewerGap({ data }: { data: RepositoryInsights["reciprocityGap"] }) {
  if (data.length === 0) {
    return <EmptyState title="No reciprocity data yet" />;
  }
  return (
    <div style={{ padding: 12 }}>
      {data.slice(0, 8).map((pair) => (
        <div key={`${pair.personA}-${pair.personB}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0" }}>
          <span>{pair.personA} ↔ {pair.personB}</span>
          <span style={{ color: pair.gap > 3 ? "var(--win-danger)" : "var(--win-text-dim)" }}>gap {pair.gap}</span>
        </div>
      ))}
    </div>
  );
}
