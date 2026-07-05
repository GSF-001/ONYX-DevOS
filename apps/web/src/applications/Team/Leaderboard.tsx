import type { ReviewerLoadEntry } from "./TeamTypes";
import type { RepositoryInsights } from "../../shared/api/endpoints";
import { EmptyState } from "../../shared/components";
import { formatPercent } from "../../shared/utils";

interface LeaderboardProps {
  reviewerLoad: ReviewerLoadEntry[];
  contributions: RepositoryInsights["busFactor"]["contributions"];
}

interface LeaderboardRow {
  login: string;
  commitCount: number;
  commitShare: number;
  reviewsCompleted30d: number;
}

/** Merges commit contribution share with review activity into a single
 * ranked list — the two real signals the backend provides per person. */
export function Leaderboard({ reviewerLoad, contributions }: LeaderboardProps) {
  const byLogin = new Map<string, LeaderboardRow>();

  for (const c of contributions) {
    byLogin.set(c.authorLogin, {
      login: c.authorLogin,
      commitCount: c.commitCount,
      commitShare: c.share,
      reviewsCompleted30d: 0,
    });
  }
  for (const r of reviewerLoad) {
    const existing = byLogin.get(r.reviewerLogin);
    if (existing) existing.reviewsCompleted30d = r.completedReviewCount30d;
    else
      byLogin.set(r.reviewerLogin, {
        login: r.reviewerLogin,
        commitCount: 0,
        commitShare: 0,
        reviewsCompleted30d: r.completedReviewCount30d,
      });
  }

  const rows = Array.from(byLogin.values()).sort(
    (a, b) => b.commitCount + b.reviewsCompleted30d - (a.commitCount + a.reviewsCompleted30d)
  );

  if (rows.length === 0) {
    return <EmptyState title="No activity yet" description="Leaderboard fills in once there's commit and review history." />;
  }

  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", padding: 12 }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--win-text-dim)", borderBottom: "1px solid var(--win-face-dark)" }}>
          <th style={{ padding: 6 }}>#</th>
          <th style={{ padding: 6 }}>Member</th>
          <th style={{ padding: 6 }}>Commits</th>
          <th style={{ padding: 6 }}>Share</th>
          <th style={{ padding: 6 }}>Reviews (30d)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.login} style={{ borderBottom: "1px solid var(--win-face-dark)" }}>
            <td style={{ padding: 6 }}>{i + 1}</td>
            <td style={{ padding: 6 }}>{row.login}</td>
            <td style={{ padding: 6 }}>{row.commitCount}</td>
            <td style={{ padding: 6 }}>{formatPercent(row.commitShare)}</td>
            <td style={{ padding: 6 }}>{row.reviewsCompleted30d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
