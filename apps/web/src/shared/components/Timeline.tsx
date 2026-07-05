import type { TimelineEvent } from "../types";
import { formatDateTime, formatRelativeTime } from "../utils/formatDate";
import { Badge } from "./Badge";
import { EmptyState } from "./EmptyState";

interface TimelineProps {
  events: TimelineEvent[];
}

const EVENT_LABEL: Record<TimelineEvent["type"], string> = {
  opened: "opened",
  reviewed: "reviewed",
  merged: "merged",
  closed: "closed",
};

const REVIEW_TONE: Record<string, "good" | "warn" | "danger" | "neutral"> = {
  approved: "good",
  changes_requested: "danger",
  commented: "neutral",
  dismissed: "warn",
};

/**
 * Shared chronological event list — same component renders a single PR's
 * history on the PullRequests page, a repo-wide feed on Activity, and an
 * issue's history on Issues, so the visual language of "who did what when"
 * stays identical everywhere it appears.
 */
export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return <EmptyState title="No activity yet" description="Events will appear here as they happen." />;
  }

  return (
    <ol style={{ display: "flex", flexDirection: "column", gap: 0, listStyle: "none" }}>
      {events.map((event, index) => (
        <li
          key={`${event.type}-${event.at}-${index}`}
          style={{
            display: "flex",
            gap: 12,
            padding: "10px 0",
            borderBottom:
              index < events.length - 1 ? "1px solid var(--color-border)" : "none",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginTop: 6,
              flexShrink: 0,
              background:
                event.type === "merged"
                  ? "var(--color-accent)"
                  : event.type === "closed"
                    ? "var(--color-text-faint)"
                    : "var(--color-border-bright)",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600 }}>{event.actor}</span>
              <span style={{ color: "var(--color-text-dim)" }}>{EVENT_LABEL[event.type]}</span>
              {event.detail && (
                <Badge tone={REVIEW_TONE[event.detail] ?? "neutral"}>
                  {event.detail.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
            <time
              dateTime={event.at}
              title={formatDateTime(event.at)}
              style={{ fontSize: 12, color: "var(--color-text-faint)" }}
            >
              {formatRelativeTime(event.at)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
