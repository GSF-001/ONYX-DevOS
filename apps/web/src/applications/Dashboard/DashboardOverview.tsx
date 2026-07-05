import type { DashboardPrTrendPoint } from "./DashboardTypes";
import type { ActivityFeedEntry } from "../../shared/api/endpoints";
import { Timeline } from "../../shared/components";
import { formatDateTime } from "../../shared/utils";

interface DashboardOverviewProps {
  trend: DashboardPrTrendPoint[];
  activity: ActivityFeedEntry[];
}

function TrendChart({ trend }: { trend: DashboardPrTrendPoint[] }) {
  const max = Math.max(1, ...trend.map((p) => Math.max(p.opened, p.merged)));

  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 6 }}>
        PULL REQUESTS — LAST 14 DAYS
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
        {trend.map((point) => (
          <div key={point.date} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }} title={point.date}>
            <div
              style={{
                height: `${(point.opened / max) * 100}%`,
                background: "var(--win-accent)",
                minHeight: point.opened > 0 ? 2 : 0,
              }}
            />
            <div
              style={{
                height: `${(point.merged / max) * 100}%`,
                background: "var(--win-success)",
                minHeight: point.merged > 0 ? 2 : 0,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11 }}>
        <span><span style={{ color: "var(--win-accent)" }}>■</span> Opened</span>
        <span><span style={{ color: "var(--win-success)" }}>■</span> Merged</span>
      </div>
    </div>
  );
}

export function DashboardOverview({ trend, activity }: DashboardOverviewProps) {
  const flatEvents = activity
    .flatMap((entry) =>
      entry.events.map((event) => ({ ...event, pullRequestNumber: entry.pullRequestNumber }))
    )
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 12, flex: 1, overflowY: "auto" }}>
      <TrendChart trend={trend} />
      <div>
        <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 6 }}>ACTIVITY FEED</p>
        <Timeline events={flatEvents} />
        {flatEvents.length > 0 && (
          <p style={{ fontSize: 10, color: "var(--win-text-faint)", marginTop: 4 }}>
            Last updated {formatDateTime(new Date().toISOString())}
          </p>
        )}
      </div>
    </div>
  );
}
