import type { ReviewerLoadEntry } from "./ReviewsTypes";
import { EmptyState } from "../../shared/components";

interface ReviewQueueProps {
  reviewerLoad: ReviewerLoadEntry[];
}

/** "Review queue" here means people with pending work, sorted by load —
 * the closest real signal available without a raw per-review list. */
export function ReviewQueue({ reviewerLoad }: ReviewQueueProps) {
  const withPending = reviewerLoad.filter((r) => r.pendingReviewCount > 0);

  if (withPending.length === 0) {
    return <EmptyState title="Review queue is empty" description="Nobody has pending reviews right now." />;
  }

  return (
    <div style={{ padding: 12 }}>
      {withPending.map((entry) => (
        <div
          key={entry.reviewerLogin}
          style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--win-face-dark)" }}
        >
          <span style={{ fontWeight: 600, fontSize: 13 }}>{entry.reviewerLogin}</span>
          <span style={{ fontSize: 12, color: entry.overloaded ? "var(--win-danger)" : "var(--win-text-dim)" }}>
            {entry.pendingReviewCount} pending
          </span>
        </div>
      ))}
    </div>
  );
}
