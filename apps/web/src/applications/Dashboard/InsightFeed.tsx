import type { InsightFeedItem } from "./DashboardTypes";
import { Badge, EmptyState } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";

const SEVERITY_TONE: Record<InsightFeedItem["severity"], "danger" | "warn" | "neutral"> = {
  high: "danger",
  medium: "warn",
  low: "neutral",
};

export function InsightFeed({ items }: { items: InsightFeedItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="No open concerns" description="Nothing risky detected right now." />;
  }

  return (
    <div className="win-frame" style={{ padding: 10 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--win-text-dim)", marginBottom: 8 }}>
        INSIGHT FEED
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)" }}
        >
          <Badge tone={SEVERITY_TONE[item.severity]}>{item.severity}</Badge>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</p>
            <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>{item.detail}</p>
          </div>
          <span style={{ fontSize: 10, color: "var(--win-text-faint)", whiteSpace: "nowrap" }}>
            {formatRelativeTime(item.at)}
          </span>
        </div>
      ))}
    </div>
  );
}
