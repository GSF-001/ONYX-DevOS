import { useState } from "react";
import type { useReviewsData } from "./ReviewsHooks";
import { PendingReviews } from "./PendingReviews";
import { ApprovedReviews } from "./ApprovedReviews";
import { ChangesRequested } from "./ChangesRequested";
import { ReviewQueue } from "./ReviewQueue";
import { ReviewerLoad } from "./ReviewerLoad";
import { ReviewTimeline } from "./ReviewTimeline";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Tab = "queue" | "load" | "pending" | "approved" | "changes" | "reciprocity";

const TABS: { id: Tab; label: string }[] = [
  { id: "queue", label: "Review Queue" },
  { id: "load", label: "Reviewer Load" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "changes", label: "Changes Requested" },
  { id: "reciprocity", label: "Reciprocity" },
];

export function ReviewsWindow({ data }: { data: ReturnType<typeof useReviewsData> }) {
  const [tab, setTab] = useState<Tab>("queue");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading reviews..." />
      </div>
    );
  }
  if (data.error) return <EmptyState title="Couldn't load reviews" description={data.error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "queue" && <ReviewQueue reviewerLoad={data.reviewerLoad} />}
        {tab === "load" && (
          <div style={{ padding: 12 }}>
            <ReviewerLoad entries={data.reviewerLoad} />
          </div>
        )}
        {tab === "pending" && <PendingReviews />}
        {tab === "approved" && <ApprovedReviews />}
        {tab === "changes" && <ChangesRequested />}
        {tab === "reciprocity" && <ReviewTimeline reciprocityGap={data.reciprocityGap} />}
      </div>
    </div>
  );
}
