import type { PullRequest } from "./PullRequestTypes";
import { EmptyState, Badge } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";
import { RiskAnalysis } from "./RiskAnalysis";

interface PullRequestListProps {
  pullRequests: PullRequest[];
  onOpen: (pr: PullRequest) => void;
}

export function PullRequestList({ pullRequests, onOpen }: PullRequestListProps) {
  if (pullRequests.length === 0) {
    return <EmptyState title="Nothing here" description="No pull requests match this filter." />;
  }

  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--win-text-dim)", borderBottom: "1px solid var(--win-face-dark)" }}>
          <th style={{ padding: 6 }}>#</th>
          <th style={{ padding: 6 }}>Title</th>
          <th style={{ padding: 6 }}>Author</th>
          <th style={{ padding: 6 }}>Age</th>
          <th style={{ padding: 6 }}>Risk</th>
        </tr>
      </thead>
      <tbody>
        {pullRequests.map((pr) => (
          <tr
            key={pr.id}
            onClick={() => onOpen(pr)}
            style={{ borderBottom: "1px solid var(--win-face-dark)", cursor: "pointer" }}
          >
            <td style={{ padding: 6 }}>#{pr.number}</td>
            <td style={{ padding: 6 }}>{pr.title}</td>
            <td style={{ padding: 6 }}>{pr.authorLogin}</td>
            <td style={{ padding: 6 }}>{formatRelativeTime(pr.createdAt)}</td>
            <td style={{ padding: 6 }}>
              <RiskAnalysis pullRequest={pr} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
