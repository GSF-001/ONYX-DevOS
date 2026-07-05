import type { RepositoryInsights } from "./InsightsTypes";
import { formatPercent } from "../../shared/utils";

export function BusFactor({ data }: { data: RepositoryInsights["busFactor"] }) {
  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>BUS FACTOR</p>
      <p
        style={{
          fontSize: 32,
          fontFamily: "var(--win-font-mono)",
          fontWeight: 700,
          color: data.busFactor <= 1 ? "var(--win-danger)" : data.busFactor <= 2 ? "var(--win-warning)" : "var(--win-success)",
        }}
      >
        {data.busFactor}
      </p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 12 }}>
        {data.busFactor <= 1
          ? "One person accounts for half of recent commits — high risk."
          : "Contributions are reasonably spread out."}
      </p>
      {data.contributions.slice(0, 6).map((c) => (
        <div key={c.authorLogin} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
          <span>{c.authorLogin}</span>
          <span style={{ color: "var(--win-text-dim)" }}>{formatPercent(c.share)}</span>
        </div>
      ))}
    </div>
  );
}
