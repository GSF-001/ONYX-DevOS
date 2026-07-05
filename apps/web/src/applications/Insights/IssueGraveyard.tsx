import type { RepositoryInsights } from "./InsightsTypes";
import { EmptyState, Badge } from "../../shared/components";

export function IssueGraveyard({ data }: { data: RepositoryInsights["issueGraveyard"] }) {
  if (data.length === 0) {
    return <EmptyState title="No stale issues" description="Nothing's been sitting open past the threshold." />;
  }
  return (
    <div style={{ padding: 12 }}>
      {data.map((issue) => (
        <div key={issue.number} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
          <span style={{ fontSize: 13 }}>#{issue.number} {issue.title}</span>
          <Badge tone="warn">{issue.ageDays}d</Badge>
        </div>
      ))}
    </div>
  );
}
