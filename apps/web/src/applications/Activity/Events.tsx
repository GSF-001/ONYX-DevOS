import type { ActivityFeedEntry, EventTypeFilter } from "./ActivityTypes";
import { EmptyState } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";

interface EventsProps {
  history: ActivityFeedEntry[];
  filter: EventTypeFilter;
}

/** Flat table view — same underlying data as Timeline.tsx but grouped as
 * rows instead of a chronological narrative, useful for scanning volume. */
export function Events({ history, filter }: EventsProps) {
  const rows = history.flatMap((entry) =>
    entry.events
      .filter((event) => filter === "all" || event.type === filter)
      .map((event) => ({ ...event, pr: entry }))
  );

  if (rows.length === 0) {
    return <EmptyState title="No matching events" description="Try a different filter." />;
  }

  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--win-text-dim)", borderBottom: "1px solid var(--win-face-dark)" }}>
          <th style={{ padding: 6 }}>Event</th>
          <th style={{ padding: 6 }}>PR</th>
          <th style={{ padding: 6 }}>Actor</th>
          <th style={{ padding: 6 }}>When</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--win-face-dark)" }}>
            <td style={{ padding: 6 }}>{row.type}</td>
            <td style={{ padding: 6 }}>#{row.pr.pullRequestNumber}</td>
            <td style={{ padding: 6 }}>{row.actor}</td>
            <td style={{ padding: 6 }}>{formatRelativeTime(row.at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
