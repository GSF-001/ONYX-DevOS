import type { ReciprocityPair } from "./ReviewsTypes";
import { EmptyState } from "../../shared/components";

interface ReviewTimelineProps {
  reciprocityGap: ReciprocityPair[];
}

/**
 * Named "ReviewTimeline" in your tree, but per-PR chronological timelines
 * already live in PullRequests/Timeline.tsx (reused via shared/Timeline).
 * This file instead shows the review *relationship* view — reciprocity
 * gap — since that's the review-specific signal that doesn't belong
 * anywhere else, and duplicating the PR timeline here would just be the
 * same component under a different name.
 */
export function ReviewTimeline({ reciprocityGap }: ReviewTimelineProps) {
  if (reciprocityGap.length === 0) {
    return <EmptyState title="No reciprocity data yet" description="Needs more review history to compute." />;
  }

  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 8 }}>
        REVIEW RECIPROCITY — HIGH GAP = ONE-SIDED REVIEWING
      </p>
      {reciprocityGap.slice(0, 10).map((pair) => (
        <div
          key={`${pair.personA}-${pair.personB}`}
          style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: "1px solid var(--win-face-dark)" }}
        >
          <span>{pair.personA} ↔ {pair.personB}</span>
          <span style={{ color: pair.gap > 3 ? "var(--win-danger)" : "var(--win-text-dim)" }}>
            {pair.aReviewedB} / {pair.bReviewedA} (gap {pair.gap})
          </span>
        </div>
      ))}
    </div>
  );
}
