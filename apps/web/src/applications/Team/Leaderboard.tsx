/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

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
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
      <thead>
        <tr
          style={{
            textAlign: "left",
            color: "var(--win-text-dim)",
            fontSize: 10,
            letterSpacing: "0.04em",
            background: "var(--win-face-dark)",
          }}
        >
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>#</th>
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>MEMBER</th>
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>COMMITS</th>
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>SHARE</th>
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>REVIEWS (30D)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.login}
            style={{
              borderBottom: "1px solid var(--win-face-dark)",
              background: i % 2 === 1 ? "rgba(255,255,255,0.03)" : "transparent",
            }}
          >
            <td style={{ padding: "7px 10px", color: "var(--win-text-dim)" }}>{i + 1}</td>
            <td style={{ padding: "7px 10px", fontWeight: 600 }}>{row.login}</td>
            <td style={{ padding: "7px 10px", fontFamily: "var(--win-font-mono)" }}>{row.commitCount}</td>
            <td style={{ padding: "7px 10px", fontFamily: "var(--win-font-mono)" }}>{formatPercent(row.commitShare)}</td>
            <td style={{ padding: "7px 10px", fontFamily: "var(--win-font-mono)" }}>{row.reviewsCompleted30d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
